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
$sourceHeaderExtensions = [System.Collections.Generic.HashSet[string]]::new([System.StringComparer]::OrdinalIgnoreCase)
foreach ($extension in @(
    '.rs', '.c', '.h', '.cc', '.cpp', '.cxx', '.m', '.mm', '.js', '.jsx', '.ts', '.tsx',
    '.py', '.sh', '.html', '.css', '.java', '.kt', '.go', '.swift', '.php', '.rb', '.s', '.asm'
)) {
    [void]$sourceHeaderExtensions.Add($extension)
}

$inventory = [System.Collections.Generic.List[object]]::new()
$noticeSections = [System.Collections.Generic.List[string]]::new()
$includedTextCount = 0
$supplementalTextCount = 0
$supplementedPackageCount = 0
$missingLicenseExpressionCount = 0
$missingLicenseTextCount = 0
$sourceHeaderMentionCount = 0
$packagesWithSourceHeaderMentions = 0

$licenseSupplements = @{
    'alloc-stdlib@0.3.0' = [pscustomobject]@{
        Files = @('alloc-stdlib-0.3.0-BSD-3-Clause.txt')
        Source = 'https://github.com/dropbox/rust-alloc-no-stdlib/blob/0a81fd6928ea3b33c8cd484aa4575d50ffb98012/LICENSE (published-crate VCS revision; see license-supplements/SOURCES.md)'
    }
    'selectors@0.38.0' = [pscustomobject]@{
        Files = @('selectors-0.38.0-MPL-2.0.txt')
        Source = 'https://github.com/servo/stylo/blob/572ecba2d1600e7c3d490586692a209faf703baa/selectors/Cargo.toml (exact published selectors revision); canonical MPL-2.0 text matches https://github.com/servo/rust-cssparser/blob/v0.37.0/LICENSE; see license-supplements/SOURCES.md'
    }
    'tauri-plugin@2.7.2' = [pscustomobject]@{
        Files = @('tauri-plugin-2.7.2-Apache-2.0.txt', 'tauri-plugin-2.7.2-MIT.txt')
        Source = 'https://github.com/tauri-apps/tauri/tree/tauri-plugin-v2.7.2 (shared repository license files; see license-supplements/SOURCES.md)'
    }
    'webview2-com@0.39.1' = [pscustomobject]@{
        Files = @('webview2-rs-0.39.1-MIT.txt')
        Source = 'https://github.com/wravery/webview2-rs/blob/edc2caf886175ccaebe86078c9cfe1ae2a187328/LICENSE (published-crate VCS revision; see license-supplements/SOURCES.md)'
    }
    'webview2-com-macros@0.8.1' = [pscustomobject]@{
        Files = @('webview2-rs-0.39.1-MIT.txt')
        Source = 'https://github.com/wravery/webview2-rs/blob/dffa41a8a46d3f5565eefbff2de57d38d399f158/LICENSE (published-crate VCS revision; see license-supplements/SOURCES.md)'
    }
    'webview2-com-sys@0.39.1' = [pscustomobject]@{
        Files = @('webview2-rs-0.39.1-MIT.txt')
        Source = 'https://github.com/wravery/webview2-rs/blob/edc2caf886175ccaebe86078c9cfe1ae2a187328/LICENSE (published-crate VCS revision; see license-supplements/SOURCES.md)'
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

    $packageFiles = @(Get-ChildItem -LiteralPath $packageRoot -File -Recurse -ErrorAction SilentlyContinue)
    $sourceHeaderMentions = [System.Collections.Generic.List[object]]::new()
    foreach ($sourceFile in $packageFiles) {
        if ($sourceFile.Name -match '(?i)^(LICENSE|LICENCE|COPYING|NOTICE|COPYRIGHT)([-_. ].*)?$') {
            [void]$licenseFiles.Add($sourceFile)
        }

        if ($sourceHeaderExtensions.Contains($sourceFile.Extension)) {
            $sourceLines = @(Get-Content -LiteralPath $sourceFile.FullName -Encoding utf8 -TotalCount 40 -ErrorAction SilentlyContinue)
            for ($lineIndex = 0; $lineIndex -lt $sourceLines.Count; $lineIndex++) {
                $sourceLine = [string]$sourceLines[$lineIndex]
                if ($sourceLine -match '(?i)copyright|SPDX-License-Identifier' -and $sourceLine -match '^\s*(?://|/\*|\*|<!--|#|;|--)') {
                    $relativeSourcePath = [System.IO.Path]::GetRelativePath($packageRoot, $sourceFile.FullName) -replace '\\', '/'
                    [void]$sourceHeaderMentions.Add([pscustomobject]@{
                        Path = $relativeSourcePath
                        Line = $lineIndex + 1
                        Text = [regex]::Replace($sourceLine.Trim(), '\s+', ' ')
                    })
                }
            }
        }
    }

    $uniqueFiles = @($licenseFiles | Sort-Object FullName -Unique)
    $safePackageName = ('{0}-{1}' -f $package.name, $package.version) -replace '[^A-Za-z0-9._-]', '_'
    $packageOutput = Join-Path $licenseOutputRoot $safePackageName
    $copiedNames = [System.Collections.Generic.List[string]]::new()
    $supplementSource = ''
    $supplementKey = '{0}@{1}' -f $package.name, $package.version
    $supplement = $licenseSupplements[$supplementKey]
    if ($sourceHeaderMentions.Count -gt 0) {
        $sourceHeaderMentionCount += $sourceHeaderMentions.Count
        $packagesWithSourceHeaderMentions++
    }
    [void]$noticeSections.Add("## $($package.name) $($package.version)")
    [void]$noticeSections.Add("Declared SPDX license: $(if ($package.license) { $package.license } else { 'not declared' })")
    [void]$noticeSections.Add("Source: $($package.source)")
    if ([string]$package.license -match '(^|\s|\()MPL-2\.0($|\s|\))') {
        [void]$noticeSections.Add("MPL source crate page: https://crates.io/crates/$($package.name)/$($package.version)")
        [void]$noticeSections.Add("MPL versioned source archive: https://crates.io/api/v1/crates/$($package.name)/$($package.version)/download")
    }

    if ($uniqueFiles.Count -gt 0) {
        New-Item -ItemType Directory -Path $packageOutput -Force | Out-Null
        foreach ($licenseFile in $uniqueFiles) {
            $copyName = [System.IO.Path]::GetRelativePath($packageRoot, $licenseFile.FullName)
            if ($copyName -eq '..' -or $copyName.StartsWith('..\', [System.StringComparison]::OrdinalIgnoreCase) -or [System.IO.Path]::IsPathRooted($copyName)) {
                $copyName = Join-Path 'declared-external' $licenseFile.Name
            }
            $copyName = $copyName -replace '\\', '/'
            $copyPath = Join-Path $packageOutput ($copyName -replace '/', [string][System.IO.Path]::DirectorySeparatorChar)
            $copyDirectory = Split-Path -Parent $copyPath
            New-Item -ItemType Directory -Path $copyDirectory -Force | Out-Null
            Copy-Item -LiteralPath $licenseFile.FullName -Destination $copyPath
            [void]$copiedNames.Add($copyName)
            [void]$noticeSections.Add("### License file: $copyName")
            [void]$noticeSections.Add((Get-Content -LiteralPath $licenseFile.FullName -Raw -Encoding utf8))
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
            [void]$noticeSections.Add((Get-Content -LiteralPath $supplementPath -Raw -Encoding utf8))
            [void]$noticeSections.Add('')
            $includedTextCount++
            $supplementalTextCount++
        }
        $supplementSource = $supplement.Source
        $supplementedPackageCount++
    }

    if ($sourceHeaderMentions.Count -gt 0) {
        [void]$noticeSections.Add('### Source header mentions (first 40 lines of source files; Copyright/©/SPDX scan)')
        foreach ($mention in $sourceHeaderMentions | Sort-Object Path, Line, Text -Unique) {
            [void]$noticeSections.Add(('{0}:{1}: {2}' -f $mention.Path, $mention.Line, $mention.Text))
        }
        [void]$noticeSections.Add('')
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
    'Source header mentions are conservatively collected from comment lines in the first 40 lines of recognized source files; their inclusion is not a legal review.'
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
    SourceHeaderMentionLines = $sourceHeaderMentionCount
    PackagesWithSourceHeaderMentions = $packagesWithSourceHeaderMentions
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
