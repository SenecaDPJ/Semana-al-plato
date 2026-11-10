[CmdletBinding()]
param(
    [string]$OutputDirectory
)

$ErrorActionPreference = 'Stop'

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path
Set-Location -LiteralPath $repoRoot

$appVersion = [string](Get-Content -LiteralPath 'package.json' -Raw | ConvertFrom-Json).version
$packageVersion = "$appVersion.0"
if ([string]::IsNullOrWhiteSpace($OutputDirectory)) {
    $OutputDirectory = Join-Path $repoRoot "artifacts\msstore\$packageVersion-x64"
}
$outputRoot = [System.IO.Path]::GetFullPath($OutputDirectory)
if (-not (Test-Path -LiteralPath $outputRoot -PathType Container)) {
    throw "No existe la carpeta del artefacto MSIX: $outputRoot"
}

$targetTriple = 'x86_64-pc-windows-msvc'
$metadataText = (& cargo metadata --locked --format-version 1 --filter-platform $targetTriple --manifest-path 'src-tauri\Cargo.toml' | Out-String)
if ($LASTEXITCODE -ne 0) {
    throw 'cargo metadata no pudo resolver el lockfile; no se generó el inventario de licencias.'
}
$metadata = $metadataText | ConvertFrom-Json
if (-not $metadata.resolve -or -not $metadata.resolve.nodes) {
    throw 'cargo metadata no devolvió el grafo de dependencias resuelto para el objetivo Windows.'
}
$resolvedPackageIds = [System.Collections.Generic.HashSet[string]]::new([System.StringComparer]::Ordinal)
foreach ($node in $metadata.resolve.nodes) {
    [void]$resolvedPackageIds.Add([string]$node.id)
}
$externalPackages = @($metadata.packages | Where-Object {
    -not [string]::IsNullOrWhiteSpace($_.source) -and $resolvedPackageIds.Contains([string]$_.id)
} | Sort-Object name, version, source)
$licenseOutputRoot = Join-Path $outputRoot 'third-party-licenses'
New-Item -ItemType Directory -Path $licenseOutputRoot -Force | Out-Null

$inventory = [System.Collections.Generic.List[object]]::new()
$noticeSections = [System.Collections.Generic.List[string]]::new()
$includedTextCount = 0
$supplementalTextCount = 0
$supplementedPackageCount = 0
$missingLicenseExpressionCount = 0
$missingLicenseTextCount = 0

$licenseSupplements = @{
    'alloc-stdlib@0.3.0' = [pscustomobject]@{
        Files = @('alloc-stdlib-0.3.0-BSD-3-Clause.txt')
        Source = 'https://github.com/dropbox/rust-alloc-no-stdlib/blob/master/LICENSE'
    }
    'selectors@0.38.0' = [pscustomobject]@{
        Files = @('selectors-0.38.0-MPL-2.0.txt')
        Source = 'https://www.mozilla.org/en-US/MPL/2.0/ (canonical MPL-2.0 text; Servo source notes at https://github.com/servo/stylo/issues/317)'
    }
    'tauri-plugin@2.7.2' = [pscustomobject]@{
        Files = @('tauri-plugin-2.7.2-Apache-2.0.txt', 'tauri-plugin-2.7.2-MIT.txt')
        Source = 'https://github.com/tauri-apps/tauri (shared repository license files; see license-supplements/SOURCES.md)'
    }
    'webview2-com@0.39.1' = [pscustomobject]@{
        Files = @('webview2-rs-0.39.1-MIT.txt')
        Source = 'https://github.com/wravery/webview2-rs/blob/main/LICENSE'
    }
    'webview2-com-macros@0.8.1' = [pscustomobject]@{
        Files = @('webview2-rs-0.39.1-MIT.txt')
        Source = 'https://github.com/wravery/webview2-rs/blob/main/LICENSE'
    }
    'webview2-com-sys@0.39.1' = [pscustomobject]@{
        Files = @('webview2-rs-0.39.1-MIT.txt')
        Source = 'https://github.com/wravery/webview2-rs/blob/main/LICENSE'
    }
}

foreach ($package in $externalPackages) {
    $packageRoot = Split-Path -Parent ([string]$package.manifest_path)
    $licenseFiles = [System.Collections.Generic.List[System.IO.FileInfo]]::new()
    $licenseFileDeclared = [string]$package.license_file
    $declaredDisplayPath = ''
    $declaredFileMissing = $false

    if (-not [string]::IsNullOrWhiteSpace($licenseFileDeclared)) {
        if ([System.IO.Path]::IsPathRooted($licenseFileDeclared)) {
            $declaredPath = $licenseFileDeclared
            $declaredDisplayPath = [System.IO.Path]::GetRelativePath($packageRoot, $declaredPath)
        } else {
            $declaredPath = Join-Path $packageRoot $licenseFileDeclared
            $declaredDisplayPath = $licenseFileDeclared
        }
        if (Test-Path -LiteralPath $declaredPath -PathType Leaf) {
            [void]$licenseFiles.Add((Get-Item -LiteralPath $declaredPath))
        } else {
            $declaredFileMissing = $true
        }
    }

    Get-ChildItem -LiteralPath $packageRoot -File -ErrorAction SilentlyContinue |
        Where-Object { $_.Name -match '(?i)^(LICENSE|LICENCE|COPYING|NOTICE|COPYRIGHT)([-_. ].*)?$' } |
        ForEach-Object { [void]$licenseFiles.Add($_) }

    $licenseDirectory = Join-Path $packageRoot 'LICENSES'
    if (Test-Path -LiteralPath $licenseDirectory -PathType Container) {
        Get-ChildItem -LiteralPath $licenseDirectory -File -Recurse -ErrorAction SilentlyContinue |
            ForEach-Object { [void]$licenseFiles.Add($_) }
    }

    $uniqueFiles = @($licenseFiles | Sort-Object FullName -Unique)
    $safePackageName = ('{0}-{1}' -f $package.name, $package.version) -replace '[^A-Za-z0-9._-]', '_'
    $packageOutput = Join-Path $licenseOutputRoot $safePackageName
    $copiedNames = [System.Collections.Generic.List[string]]::new()
    $supplementSource = ''
    $supplementKey = '{0}@{1}' -f $package.name, $package.version
    $supplement = $licenseSupplements[$supplementKey]
    [void]$noticeSections.Add("## $($package.name) $($package.version)")
    [void]$noticeSections.Add("Declared SPDX license: $(if ($package.license) { $package.license } else { 'not declared' })")
    [void]$noticeSections.Add("Source: $($package.source)")

    if ($uniqueFiles.Count -gt 0) {
        New-Item -ItemType Directory -Path $packageOutput -Force | Out-Null
        foreach ($licenseFile in $uniqueFiles) {
            $copyName = $licenseFile.Name
            $copyPath = Join-Path $packageOutput $copyName
            if (Test-Path -LiteralPath $copyPath) {
                $copyName = '{0}-{1}' -f [guid]::NewGuid().ToString('N').Substring(0, 8), $licenseFile.Name
                $copyPath = Join-Path $packageOutput $copyName
            }
            Copy-Item -LiteralPath $licenseFile.FullName -Destination $copyPath
            [void]$copiedNames.Add($copyName)
            [void]$noticeSections.Add("### $($licenseFile.Name)")
            [void]$noticeSections.Add((Get-Content -LiteralPath $licenseFile.FullName -Raw))
            [void]$noticeSections.Add('')
            $includedTextCount++
        }
    }

    if ($uniqueFiles.Count -eq 0 -and $supplement) {
        New-Item -ItemType Directory -Path $packageOutput -Force | Out-Null
        foreach ($supplementName in $supplement.Files) {
            $supplementPath = Join-Path $PSScriptRoot (Join-Path 'license-supplements' $supplementName)
            if (-not (Test-Path -LiteralPath $supplementPath -PathType Leaf)) {
                throw "Falta el texto de licencia suplementario '$supplementName' para $supplementKey."
            }
            $copyPath = Join-Path $packageOutput $supplementName
            Copy-Item -LiteralPath $supplementPath -Destination $copyPath
            [void]$copiedNames.Add($supplementName)
            [void]$noticeSections.Add("### Supplemental license text: $supplementName")
            [void]$noticeSections.Add("Supplement source: $($supplement.Source)")
            [void]$noticeSections.Add((Get-Content -LiteralPath $supplementPath -Raw))
            [void]$noticeSections.Add('')
            $includedTextCount++
            $supplementalTextCount++
        }
        $supplementSource = $supplement.Source
        $supplementedPackageCount++
    }

    if ([string]::IsNullOrWhiteSpace([string]$package.license) -and $uniqueFiles.Count -eq 0 -and -not $supplement) {
        $reviewStatus = 'MANUAL_REVIEW_REQUIRED_MISSING_EXPRESSION_AND_TEXT'
        $missingLicenseExpressionCount++
        $missingLicenseTextCount++
    } elseif ([string]::IsNullOrWhiteSpace([string]$package.license)) {
        $reviewStatus = 'MANUAL_REVIEW_REQUIRED_MISSING_EXPRESSION'
        $missingLicenseExpressionCount++
    } elseif ($uniqueFiles.Count -eq 0 -and -not $supplement) {
        $reviewStatus = if ($declaredFileMissing) { 'MANUAL_REVIEW_REQUIRED_DECLARED_FILE_MISSING' } else { 'MANUAL_REVIEW_REQUIRED_TEXT_NOT_FOUND' }
        $missingLicenseTextCount++
    } elseif ($uniqueFiles.Count -eq 0 -and $supplement) {
        $reviewStatus = 'MANUAL_REVIEW_REQUIRED_SUPPLEMENTED_TEXT_VERIFY_SOURCE_AND_TERMS'
    } else {
        $reviewStatus = 'MANUAL_REVIEW_REQUIRED_REVIEW_TERMS'
    }

    [void]$inventory.Add([pscustomobject]@{
        Name = [string]$package.name
        Version = [string]$package.version
        Source = [string]$package.source
        LicenseExpression = [string]$package.license
        DeclaredLicenseFile = $declaredDisplayPath
        IncludedLicenseFiles = ($copiedNames -join '; ')
        SupplementalLicenseTextSource = $supplementSource
        ReviewStatus = $reviewStatus
    })
}

$inventoryPath = Join-Path $outputRoot 'CARGO-LICENSE-INVENTORY.csv'
$summaryPath = Join-Path $outputRoot 'CARGO-LICENSE-SUMMARY.json'
$noticesPath = Join-Path $outputRoot 'THIRD-PARTY-NOTICES.txt'
$inventory | Export-Csv -LiteralPath $inventoryPath -NoTypeInformation -Encoding utf8
$noticeHeader = @(
    "Generated from the Cargo dependency graph for target $targetTriple, license files included with locked dependencies, and documented upstream supplements."
    'This inventory is for review; it is not legal clearance or a determination that licenses are compatible.'
    'Supplemented texts and their sources are listed in CARGO-LICENSE-INVENTORY.csv and docs/microsoft-store/license-supplements/SOURCES.md.'
    ''
)
@($noticeHeader + $noticeSections) | Set-Content -LiteralPath $noticesPath -Encoding utf8

$sourceCommit = (& git rev-parse HEAD 2>&1 | Out-String).Trim()
if ($LASTEXITCODE -ne 0) { throw 'No se pudo identificar el commit usado para el inventario.' }
$summary = [pscustomobject]@{
    ProductVersion = $appVersion
    PackageVersion = $packageVersion
    SourceCommit = $sourceCommit
    TargetTriple = $targetTriple
    ExternalPackageCount = $externalPackages.Count
    LicenseFilesIncluded = $includedTextCount
    SupplementalLicenseTextsIncluded = $supplementalTextCount
    PackagesWithSupplementedLicenseText = $supplementedPackageCount
    PackagesMissingLicenseExpression = $missingLicenseExpressionCount
    PackagesMissingLicenseText = $missingLicenseTextCount
    PackagesRequiringManualLicenseReview = $externalPackages.Count
    Inventory = 'CARGO-LICENSE-INVENTORY.csv'
    Notices = 'THIRD-PARTY-NOTICES.txt'
    LicenseFileCopies = 'third-party-licenses/'
    LegalReviewComplete = $false
}
$summary | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath $summaryPath -Encoding utf8
$summary | ConvertTo-Json -Depth 5
