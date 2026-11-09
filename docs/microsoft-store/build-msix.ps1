[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string]$PackageIdentityName,

    [Parameter(Mandatory = $true)]
    [string]$PackageIdentityPublisher,

    [Parameter(Mandatory = $true)]
    [string]$PublisherDisplayName,

    [string]$OutputDirectory,

    [string]$MaxVersionTested = '10.0.26300.0'
)

$ErrorActionPreference = 'Stop'

function Invoke-LoggedCommand {
    param(
        [Parameter(Mandatory = $true)][string]$Command,
        [Parameter(Mandatory = $true)][string[]]$Arguments,
        [Parameter(Mandatory = $true)][string]$LogPath
    )

    & $Command @Arguments 2>&1 | Tee-Object -FilePath $LogPath
    if ($LASTEXITCODE -ne 0) {
        throw "$Command terminó con código $LASTEXITCODE. Revisa $LogPath."
    }
}

function Find-WindowsSdkTool {
    param([Parameter(Mandatory = $true)][string]$ToolName)

    $command = Get-Command $ToolName -ErrorAction SilentlyContinue
    if ($command) { return $command.Source }

    $sdkRoot = Join-Path ${env:ProgramFiles(x86)} 'Windows Kits\10\bin'
    if (-not (Test-Path -LiteralPath $sdkRoot)) { return $null }
    $sdkVersions = Get-ChildItem -LiteralPath $sdkRoot -Directory -ErrorAction SilentlyContinue |
        Where-Object { $_.Name -match '^\d+\.\d+\.\d+\.\d+$' } |
        Sort-Object { [version]$_.Name } -Descending
    foreach ($sdkVersion in $sdkVersions) {
        $candidate = Join-Path $sdkVersion.FullName (Join-Path 'x64' $ToolName)
        if (Test-Path -LiteralPath $candidate) { return $candidate }
    }
    return $null
}

if ($env:OS -ne 'Windows_NT') {
    throw 'Este empaquetado requiere Windows.'
}
if ($env:PROCESSOR_ARCHITECTURE -ne 'AMD64') {
    throw 'El paquete preparado aquí es x64 y debe generarse en Windows x64.'
}
foreach ($value in @($PackageIdentityName, $PackageIdentityPublisher, $PublisherDisplayName)) {
    if ([string]::IsNullOrWhiteSpace($value) -or $value -match '(?i)(PACKAGE_IDENTITY_NAME|PACKAGE_IDENTITY_PUBLISHER|PUBLISHER_DISPLAY_NAME|TODO|PLACEHOLDER|REPLACE_WITH|REEMPLAZAR_CON)') {
        throw 'Indica los tres valores exactos de identidad visibles en Partner Center; no uses valores de ejemplo.'
    }
}

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path
Set-Location -LiteralPath $repoRoot
$workingChanges = (& git status --porcelain --untracked-files=all 2>&1 | Out-String).Trim()
if ($LASTEXITCODE -ne 0) { throw 'No se pudo revisar el estado de Git.' }
if (-not [string]::IsNullOrWhiteSpace($workingChanges)) {
    throw 'Para identificar con claridad el origen del paquete, confirma o aparta los cambios locales antes de compilar.'
}
if ($MaxVersionTested -notmatch '^10\.0\.\d+\.\d+$' -or [version]$MaxVersionTested -lt [version]'10.0.22000.0') {
    throw 'MaxVersionTested debe ser una versión Windows 11 válida (10.0.22000.0 o superior), basada en una prueba real.'
}
$packageJson = Get-Content -LiteralPath 'package.json' -Raw | ConvertFrom-Json
$tauriConfig = Get-Content -LiteralPath 'src-tauri\tauri.conf.json' -Raw | ConvertFrom-Json
$cargoToml = Get-Content -LiteralPath 'src-tauri\Cargo.toml' -Raw
$cargoVersionMatch = [regex]::Match($cargoToml, '(?m)^version\s*=\s*"([^\"]+)"')
if (-not $cargoVersionMatch.Success) { throw 'No se pudo leer la versión de src-tauri/Cargo.toml.' }
$appVersion = [string]$packageJson.version
if ($appVersion -ne [string]$tauriConfig.version -or $appVersion -ne $cargoVersionMatch.Groups[1].Value) {
    throw 'package.json, tauri.conf.json y Cargo.toml deben tener la misma versión.'
}
if ($appVersion -notmatch '^(\d+)\.(\d+)\.(\d+)$') {
    throw 'La versión de producto debe usar tres componentes numéricos, por ejemplo 2.2.0.'
}
$versionParts = @($Matches[1], $Matches[2], $Matches[3]) | ForEach-Object { [int]$_ }
if ($versionParts | Where-Object { $_ -gt 65535 }) { throw 'Cada componente de la versión debe ser menor o igual a 65535.' }
$packageVersion = "$appVersion.0"

if ([string]::IsNullOrWhiteSpace($OutputDirectory)) {
    $OutputDirectory = Join-Path $repoRoot "artifacts\msstore\$packageVersion-x64"
}
$outputRoot = [System.IO.Path]::GetFullPath($OutputDirectory)
if (Test-Path -LiteralPath $outputRoot) {
    throw "La carpeta de salida ya existe; elige otra con -OutputDirectory para conservar el artefacto anterior: $outputRoot"
}
New-Item -ItemType Directory -Path $outputRoot -Force | Out-Null
$logsRoot = Join-Path $outputRoot 'logs'
New-Item -ItemType Directory -Path $logsRoot -Force | Out-Null

$nodeVersion = (& node --version 2>&1 | Out-String).Trim()
if ($LASTEXITCODE -ne 0 -or $nodeVersion -notmatch '^v22\.') {
    throw "Se requiere Node.js 22, igual que el flujo de publicación del proyecto. Detectado: $nodeVersion"
}
$npmVersion = (& npm --version 2>&1 | Out-String).Trim()
if ($LASTEXITCODE -ne 0) { throw 'No se pudo consultar la versión de npm.' }
Invoke-LoggedCommand -Command 'npm' -Arguments @('ci') -LogPath (Join-Path $logsRoot 'npm-ci.log')

$rustVersion = (& rustc --version 2>&1 | Out-String).Trim()
if ($LASTEXITCODE -ne 0) { throw 'Instala Rust estable/MSVC antes de compilar.' }
$cargoVersion = (& cargo --version 2>&1 | Out-String).Trim()
if ($LASTEXITCODE -ne 0) { throw 'Instala Cargo junto con Rust antes de compilar.' }
$tauriVersion = (& npm run tauri -- --version 2>&1 | Out-String).Trim()
if ($LASTEXITCODE -ne 0) { throw 'No se pudo consultar la versión de Tauri CLI.' }

Invoke-LoggedCommand -Command 'npm' -Arguments @('test') -LogPath (Join-Path $logsRoot 'npm-test.log')
Invoke-LoggedCommand -Command 'npm' -Arguments @('run', 'tauri', '--', 'build', '--target', 'x86_64-pc-windows-msvc', '--no-bundle', '--ci') -LogPath (Join-Path $logsRoot 'tauri-build.log')

$builtExe = Join-Path $repoRoot 'src-tauri\target\x86_64-pc-windows-msvc\release\semana-al-plato.exe'
if (-not (Test-Path -LiteralPath $builtExe)) {
    throw "No aparece el ejecutable x64 compilado: $builtExe"
}
$makeAppx = Find-WindowsSdkTool -ToolName 'MakeAppx.exe'
if (-not $makeAppx) { throw 'No se encuentra MakeAppx.exe del Windows SDK. Instala el Windows 10/11 SDK.' }
$makeAppxFileVersion = (Get-Item -LiteralPath $makeAppx).VersionInfo.FileVersion
$makeAppxProductVersion = (Get-Item -LiteralPath $makeAppx).VersionInfo.ProductVersion

$commit = (& git rev-parse HEAD 2>&1 | Out-String).Trim()
if ($LASTEXITCODE -ne 0) { throw 'No se pudo identificar el commit de origen.' }
$stageName = 'msix-stage-' + [guid]::NewGuid().ToString('N')
$stageRoot = Join-Path $repoRoot (Join-Path 'src-tauri\target' $stageName)
$iconRoot = Join-Path $repoRoot ('src-tauri\target\msix-icons-' + [guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Path $stageRoot -Force | Out-Null
$assetRoot = Join-Path $stageRoot 'Assets'
New-Item -ItemType Directory -Path $assetRoot -Force | Out-Null
$iconRootApp = Join-Path $iconRoot 'app'
$iconRootStore = Join-Path $iconRoot 'store'
New-Item -ItemType Directory -Path $iconRootApp -Force | Out-Null
New-Item -ItemType Directory -Path $iconRootStore -Force | Out-Null

try {
    Invoke-LoggedCommand -Command 'npm' -Arguments @('run', 'tauri', '--', 'icon', 'src-tauri/icons/source.svg', '--output', $iconRootApp, '--png', '44,50,150') -LogPath (Join-Path $logsRoot 'icons-package.log')
    Invoke-LoggedCommand -Command 'npm' -Arguments @('run', 'tauri', '--', 'icon', 'docs/microsoft-store/assets/store-tile.svg', '--output', $iconRootStore, '--png', '300') -LogPath (Join-Path $logsRoot 'icon-store-listing.log')

    Copy-Item -LiteralPath $builtExe -Destination (Join-Path $stageRoot 'SemanaAlPlato.exe')
    Get-ChildItem -LiteralPath (Split-Path -Parent $builtExe) -File -Filter '*.dll' | ForEach-Object {
        Copy-Item -LiteralPath $_.FullName -Destination (Join-Path $stageRoot $_.Name)
    }
    Copy-Item -LiteralPath (Join-Path $iconRootApp '44x44.png') -Destination (Join-Path $assetRoot 'Square44x44Logo.png')
    Copy-Item -LiteralPath (Join-Path $iconRootApp '150x150.png') -Destination (Join-Path $assetRoot 'Square150x150Logo.png')
    Copy-Item -LiteralPath (Join-Path $iconRootApp '50x50.png') -Destination (Join-Path $assetRoot 'StoreLogo.png')
    $listingAssets = Join-Path $outputRoot 'listing-assets'
    New-Item -ItemType Directory -Path $listingAssets -Force | Out-Null
    Copy-Item -LiteralPath (Join-Path $iconRootStore '300x300.png') -Destination (Join-Path $listingAssets 'StoreTile-300x300.png')

    $manifest = [xml](Get-Content -LiteralPath (Join-Path $PSScriptRoot 'Package.appxmanifest.template.xml') -Raw)
    $ns = New-Object System.Xml.XmlNamespaceManager($manifest.NameTable)
    $ns.AddNamespace('a', 'http://schemas.microsoft.com/appx/manifest/foundation/windows10')
    $identity = $manifest.SelectSingleNode('/a:Package/a:Identity', $ns)
    $identity.SetAttribute('Name', $PackageIdentityName)
    $identity.SetAttribute('Publisher', $PackageIdentityPublisher)
    $identity.SetAttribute('Version', $packageVersion)
    $targetDeviceFamily = $manifest.SelectSingleNode('/a:Package/a:Dependencies/a:TargetDeviceFamily', $ns)
    $targetDeviceFamily.SetAttribute('MaxVersionTested', $MaxVersionTested)
    $properties = $manifest.SelectSingleNode('/a:Package/a:Properties', $ns)
    $properties.SelectSingleNode('a:PublisherDisplayName', $ns).InnerText = $PublisherDisplayName
    $manifestPath = Join-Path $stageRoot 'AppxManifest.xml'
    $manifest.Save($manifestPath)

    $packageName = "Semana-al-Plato_${packageVersion}_x64.msix"
    $msixPath = Join-Path $outputRoot $packageName
    Invoke-LoggedCommand -Command $makeAppx -Arguments @('pack', '/v', '/o', '/d', $stageRoot, '/p', $msixPath) -LogPath (Join-Path $logsRoot 'makeappx.log')

    $uploadName = "Semana-al-Plato_${packageVersion}_x64.msixupload"
    $zipPath = Join-Path $outputRoot ($uploadName + '.zip')
    $uploadPath = Join-Path $outputRoot $uploadName
    Compress-Archive -LiteralPath $msixPath -DestinationPath $zipPath -CompressionLevel Optimal
    Move-Item -LiteralPath $zipPath -Destination $uploadPath

    $msixHash = (Get-FileHash -LiteralPath $msixPath -Algorithm SHA256).Hash.ToLowerInvariant()
    $uploadHash = (Get-FileHash -LiteralPath $uploadPath -Algorithm SHA256).Hash.ToLowerInvariant()
    @"
MSIX: $packageName
SHA-256: $msixHash

Store upload file: $uploadName
SHA-256: $uploadHash

Product version: $appVersion
Package version: $packageVersion (fourth component reserved as 0)
Architecture: x64
MaxVersionTested: $MaxVersionTested
Package identity name: $PackageIdentityName
Package publisher: $PackageIdentityPublisher
Publisher display name: $PublisherDisplayName
Source commit: $commit
Node.js: $nodeVersion
npm: $npmVersion
Rust: $rustVersion
Cargo: $cargoVersion
Tauri CLI: $tauriVersion
MakeAppx file version: $makeAppxFileVersion
MakeAppx product version: $makeAppxProductVersion
Build OS: $([Environment]::OSVersion.VersionString)
Package signing: unsigned; Microsoft Store signing is expected only after Store certification/publication.
Local execution: not performed by this script.
Windows App Certification Kit: not run by this script.
Store upload ZIP: contains the MSIX only; no .appxsym symbols are included.
"@ | Set-Content -LiteralPath (Join-Path $outputRoot 'BUILD-METADATA.txt') -Encoding utf8
    Write-Output "MSIX listo para revisión: $msixPath"
    Write-Output "Archivo de envío: $uploadPath"
    Write-Output "SHA-256 MSIX: $msixHash"
    Write-Output "SHA-256 envío: $uploadHash"
}
finally {
    if (Test-Path -LiteralPath $iconRoot) { Remove-Item -LiteralPath $iconRoot -Recurse -Force }
}
