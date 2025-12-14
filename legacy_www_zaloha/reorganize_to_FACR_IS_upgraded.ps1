param()

Write-Host "Starting reorganization script..." -ForegroundColor Cyan

$oldFolderName = 'www zaloha'
$upgradedFolderName = 'www_upgraded_with_ai'
$newRoot = 'FACR_IS_upgraded'
$legacyName = 'legacy_www_zaloha'

if (-not (Test-Path $oldFolderName)) {
    Write-Error "Expected folder '$oldFolderName' not found in this directory. Run this script from the parent folder (e.g., C:\xampp\htdocs)."
    exit 1
}

if (Test-Path $newRoot) {
    Write-Error "Target folder '$newRoot' already exists. Aborting to avoid overwriting."
    exit 1
}

New-Item -ItemType Directory -Path $newRoot | Out-Null

$upgradedSource = Join-Path $oldFolderName $upgradedFolderName
if (Test-Path $upgradedSource) {
    Write-Host "Moving upgraded project '$upgradedFolderName' into $newRoot..."
    robocopy $upgradedSource (Join-Path $newRoot '.') /MIR /NDL /NFL /NJH /NJS > $null
    Remove-Item -Recurse -Force $upgradedSource -ErrorAction SilentlyContinue
} else {
    Write-Host "No '$upgradedFolderName' found inside '$oldFolderName'  skipping moving upgraded project." -ForegroundColor Yellow
}

$legacyDest = Join-Path $newRoot $legacyName
New-Item -ItemType Directory -Path $legacyDest | Out-Null

Write-Host "Moving original project files into '$legacyDest'..."

Get-ChildItem -Path $oldFolderName -Force | ForEach-Object {
    if ($_.Name -in @('.','..', $upgradedFolderName)) { return }
    $sourcePath = $_.FullName
    $targetPath = Join-Path $legacyDest $_.Name
    if ($_.PSIsContainer) {
        robocopy $sourcePath $targetPath /MIR /NDL /NFL /NJH /NJS > $null
        Remove-Item -Recurse -Force $sourcePath -ErrorAction SilentlyContinue
    } else {
        Move-Item -Path $sourcePath -Destination $targetPath -Force
    }
}

Write-Host "Reorganization complete. New project root: '$newRoot'" -ForegroundColor Green
Write-Host "- Main upgraded files (if present) moved into: $newRoot\" -ForegroundColor Cyan
Write-Host "- Legacy original files moved into: $newRoot\$legacyName" -ForegroundColor Cyan

Write-Host "If you want the filesystem folder originally named '$oldFolderName' removed, you can delete it now." -ForegroundColor Yellow
