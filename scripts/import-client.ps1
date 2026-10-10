param([Parameter(Mandatory=$true)][string]$Jar,[string]$AssetsDirectory)
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression.FileSystem
$resolvedJar=(Resolve-Path -LiteralPath $Jar).Path
$version=Get-Content -LiteralPath ([IO.Path]::ChangeExtension($resolvedJar,'.json')) -Raw | ConvertFrom-Json
$verifiedManifest=Get-Content -LiteralPath (Join-Path $PSScriptRoot 'asset-manifest-1.21.1.json') -Raw | ConvertFrom-Json
if($version.id -ne '1.21.1'){throw 'Only an original 1.21.1 client is accepted.'}
$sha1=(Get-FileHash -LiteralPath $resolvedJar -Algorithm SHA1).Hash.ToLowerInvariant()
if($sha1 -ne $version.downloads.client.sha1 -or $sha1 -ne $verifiedManifest.clientSha1){throw 'Client hash does not match the original 1.21.1 client.'}
if(-not $AssetsDirectory){$gameRoot=Split-Path (Split-Path (Split-Path $resolvedJar));$AssetsDirectory=Join-Path $gameRoot 'assets'}
$indexFile=Join-Path $AssetsDirectory ('indexes/'+$version.assetIndex.id+'.json')
$sharedIndexDiffers=(Get-FileHash -LiteralPath $indexFile -Algorithm SHA1).Hash.ToLowerInvariant() -ne $version.assetIndex.sha1
if($sharedIndexDiffers){Write-Output 'Shared PCL index differs; checking each selected entry against the official 1.21.1 hash manifest.'}
$index=Get-Content -LiteralPath $indexFile -Raw | ConvertFrom-Json
$destinationRoot=Join-Path (Split-Path $PSScriptRoot) 'public/assets'
foreach($folder in @('logo','gui','panorama','fonts','sounds')){New-Item -ItemType Directory -Force (Join-Path $destinationRoot $folder) | Out-Null}
$mapping=@{
 'textures/gui/title/minecraft.png'='logo/minecraft.png';'textures/gui/title/edition.png'='logo/edition.png';
 'textures/gui/sprites/widget/button.png'='gui/button.png';'textures/gui/sprites/widget/button_highlighted.png'='gui/button-highlight.png';'textures/gui/sprites/widget/button_disabled.png'='gui/button-disabled.png';
 'textures/gui/sprites/icon/language.png'='gui/language.png';'textures/gui/sprites/icon/accessibility.png'='gui/accessibility.png';
 'textures/font/ascii.png'='fonts/ascii.png';'textures/font/accented.png'='fonts/accented.png';'textures/font/nonlatin_european.png'='fonts/nonlatin_european.png';'font/include/default.json'='fonts/default.json';'texts/splashes.txt'='gui/splashes.txt'
}
$zip=[IO.Compression.ZipFile]::OpenRead($resolvedJar)
try{foreach($key in $mapping.Keys){$entry=$zip.GetEntry('assets/minecraft/'+$key);if(-not $entry){throw "Missing JAR resource: $key"};$target=Join-Path $destinationRoot $mapping[$key];$stream=$entry.Open();$hasher=[Security.Cryptography.SHA1]::Create();try{$entryHash=[BitConverter]::ToString($hasher.ComputeHash($stream)).Replace('-','')}finally{$stream.Dispose();$hasher.Dispose()};if((Test-Path -LiteralPath $target) -and (Get-FileHash -LiteralPath $target -Algorithm SHA1).Hash -eq $entryHash){continue};[IO.Compression.ZipFileExtensions]::ExtractToFile($entry,$target,$true)}}finally{$zip.Dispose()}
$objects=@{}
for($i=0;$i -lt 6;$i++){$objects["minecraft/textures/gui/title/background/panorama_$i.png"]="panorama/panorama_$i.png"}
$objects['minecraft/textures/gui/title/background/panorama_overlay.png']='panorama/overlay.png'
$objects['minecraft/sounds/random/click.ogg']='sounds/click.ogg'
$objectRecords=@()
foreach($key in $objects.Keys){$entry=$index.objects.$key;if(-not $entry){throw "Missing asset index entry: $key"};$hash=$entry.hash;if($hash -ne $verifiedManifest.objects.$key){throw "Resource belongs to a different version: $key"};$source=Join-Path $AssetsDirectory ('objects/'+$hash.Substring(0,2)+'/'+$hash);if((Get-FileHash -LiteralPath $source -Algorithm SHA1).Hash.ToLowerInvariant() -ne $hash){throw "Asset hash mismatch: $key"};$target=Join-Path $destinationRoot $objects[$key];if(-not ((Test-Path -LiteralPath $target) -and (Get-FileHash -LiteralPath $target -Algorithm SHA1).Hash.ToLowerInvariant() -eq $hash)){Copy-Item -LiteralPath $source -Destination $target};$objectRecords+=@{name=$key;sha1=$hash;destination=$objects[$key]}}
@{version='1.21.1';source=$resolvedJar;sha1=$sha1;assetIndex=$indexFile;sharedIndexDiffers=$sharedIndexDiffers;officialIndexSource=$verifiedManifest.source;scope='User-authorized local research only; no redistribution license granted';jarAssets=$mapping;indexedAssets=$objectRecords} | ConvertTo-Json -Depth 5 | Set-Content -Encoding utf8 (Join-Path $destinationRoot 'CLIENT_PROVENANCE.json')
Write-Output 'Imported hash-verified 1.21.1 assets for local research.'
# A separate URL lets fallback survive failure of panorama_0's texture request.
$fallback=Join-Path $destinationRoot 'panorama/fallback.png'
$front=Join-Path $destinationRoot 'panorama/panorama_0.png'
if(-not ((Test-Path -LiteralPath $fallback) -and (Get-FileHash -LiteralPath $fallback -Algorithm SHA1).Hash -eq (Get-FileHash -LiteralPath $front -Algorithm SHA1).Hash)){Copy-Item -LiteralPath $front -Destination $fallback}
