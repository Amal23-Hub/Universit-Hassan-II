$filePath = 'c:\UH2C\Universit-Hassan-II-Cs\app\manifestations-scientifiques\organisation-manifestation-member\page.tsx'
$content = Get-Content $filePath -Raw -Encoding UTF8

# Remplacer l'apostrophe courbe par l'apostrophe droite
$content = $content -replace [char]8217, [char]39

Set-Content $filePath -Value $content -Encoding UTF8
