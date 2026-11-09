[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string]$ArtifactsDirectory,

    [Parameter(Mandatory = $true)]
    [string]$ExpectedPublisher
)

$ErrorActionPreference = 'Stop'
$artifactsPath = [System.IO.Path]::GetFullPath($ArtifactsDirectory)
if (-not (Test-Path -LiteralPath $artifactsPath -PathType Container)) {
    throw "No existe la carpeta de artefactos: $artifactsPath"
}

$packages = @(Get-ChildItem -LiteralPath $artifactsPath -Filter '*.msix' -File | Where-Object { $_.Name -notmatch '-LOCALTEST\.msix$' })
if ($packages.Count -ne 1) {
    throw "Se esperaba un único MSIX Store unsigned en $artifactsPath; encontrados: $($packages.Count)."
}
$storePackage = $packages[0]

Add-Type -AssemblyName System.IO.Compression
$packageMemory = [System.IO.MemoryStream]::new([System.IO.File]::ReadAllBytes($storePackage.FullName))
$packageArchive = [System.IO.Compression.ZipArchive]::new($packageMemory, [System.IO.Compression.ZipArchiveMode]::Read)
try {
    $manifestEntry = $packageArchive.GetEntry('AppxManifest.xml')
    if ($null -eq $manifestEntry) { throw 'El paquete no contiene AppxManifest.xml.' }
    $reader = [System.IO.StreamReader]::new($manifestEntry.Open())
    try { $manifest = [xml]$reader.ReadToEnd() } finally { $reader.Dispose() }
}
finally {
    $packageArchive.Dispose()
    $packageMemory.Dispose()
}

$identity = $manifest.SelectSingleNode("//*[local-name()='Identity']")
$targetFamily = $manifest.SelectSingleNode("//*[local-name()='TargetDeviceFamily']")
if ($null -eq $identity -or $null -eq $targetFamily) { throw 'El manifiesto no contiene Identity o TargetDeviceFamily.' }
if ($identity.GetAttribute('Publisher') -ne $ExpectedPublisher) {
    throw "El Publisher del MSIX no coincide con el valor esperado: $($identity.GetAttribute('Publisher'))"
}
if ([version]$targetFamily.GetAttribute('MinVersion') -lt [version]'10.0.26100.1742') {
    throw 'No se firma un paquete cuyo MinVersion sea inferior al sistema mínimo probado en esta revisión.'
}

$sdkBin = Join-Path ${env:ProgramFiles(x86)} 'Windows Kits\10\bin'
$signTool = Get-ChildItem -LiteralPath $sdkBin -Filter 'signtool.exe' -Recurse -File -ErrorAction SilentlyContinue |
    Where-Object { $_.FullName -match '\\x64\\signtool\.exe$' } |
    Sort-Object -Property LastWriteTime -Descending |
    Select-Object -First 1
if ($null -eq $signTool) { throw "No se encontró el SignTool x64 del Windows SDK en $sdkBin." }

$testPackagePath = Join-Path $artifactsPath ($storePackage.BaseName + '-LOCALTEST.msix')
$publicCertificatePath = Join-Path $artifactsPath 'LOCALTEST-SIGNER.cer'
$signingInfoPath = Join-Path $artifactsPath 'LOCALTEST-SIGNING-INFO.txt'
$certificate = $null
try {
    $certificate = New-SelfSignedCertificate `
        -Type Custom `
        -Subject $ExpectedPublisher `
        -KeyAlgorithm RSA `
        -KeyLength 2048 `
        -HashAlgorithm SHA256 `
        -KeyUsage DigitalSignature `
        -KeyExportPolicy NonExportable `
        -CertStoreLocation 'Cert:\CurrentUser\My' `
        -TextExtension @('2.5.29.37={text}1.3.6.1.5.5.7.3.3') `
        -NotAfter (Get-Date).AddDays(14)

    Copy-Item -LiteralPath $storePackage.FullName -Destination $testPackagePath
    Export-Certificate -Cert $certificate -FilePath $publicCertificatePath -Force | Out-Null
    Import-Certificate -FilePath $publicCertificatePath -CertStoreLocation 'Cert:\CurrentUser\TrustedPeople' | Out-Null
    Import-Certificate -FilePath $publicCertificatePath -CertStoreLocation 'Cert:\CurrentUser\Root' | Out-Null

    & $signTool.FullName sign /fd SHA256 /sha1 $certificate.Thumbprint /s My /v $testPackagePath
    if ($LASTEXITCODE -ne 0) { throw "SignTool sign devolvió $LASTEXITCODE." }

    & $signTool.FullName verify /pa /all /v $testPackagePath
    if ($LASTEXITCODE -ne 0) { throw "SignTool verify devolvió $LASTEXITCODE." }

    $testHash = (Get-FileHash -LiteralPath $testPackagePath -Algorithm SHA256).Hash.ToLowerInvariant()
    $info = @"
Purpose: local installation testing only; not for Store submission.
Store package: $($storePackage.Name)
Test package: $([System.IO.Path]::GetFileName($testPackagePath))
Test package SHA-256: $testHash
Package identity: $($identity.GetAttribute('Name'))
Publisher / certificate subject: $ExpectedPublisher
Certificate thumbprint: $($certificate.Thumbprint)
Certificate expiry: $($certificate.NotAfter.ToUniversalTime().ToString('yyyy-MM-ddTHH:mm:ssZ'))
Private key export: disabled; no PFX or private key is included.
Trust this public certificate only in the isolated test VM, then remove it after testing.
The Store MSIX and .msixupload remain unsigned and unchanged.
"@
    [System.IO.File]::WriteAllText($signingInfoPath, $info, [System.Text.UTF8Encoding]::new($false))
}
finally {
    if ($null -ne $certificate) {
        Remove-Item -LiteralPath "Cert:\CurrentUser\My\$($certificate.Thumbprint)" -Force -ErrorAction SilentlyContinue
        Remove-Item -LiteralPath "Cert:\CurrentUser\TrustedPeople\$($certificate.Thumbprint)" -Force -ErrorAction SilentlyContinue
        Remove-Item -LiteralPath "Cert:\CurrentUser\Root\$($certificate.Thumbprint)" -Force -ErrorAction SilentlyContinue
    }
}

Write-Output "Copia firmada solo para pruebas: $testPackagePath"
Write-Output "Certificado público de pruebas: $publicCertificatePath"
