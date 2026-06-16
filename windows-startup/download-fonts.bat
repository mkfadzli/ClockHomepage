@echo off
:: ================================================================
:: download-fonts.bat — Self-host Google Fonts
::
:: Downloads DM Sans and Orbitron as woff2 files from Google Fonts
:: CDN and places them in alarm-timer/public/fonts/.
::
:: Run once before building.
:: ================================================================

setlocal enabledelayedexpansion

set "FONTS_DIR=%~dp0..\alarm-timer\public\fonts"
if not exist "%FONTS_DIR%" mkdir "%FONTS_DIR%"

echo Downloading DM Sans (regular + bold)...

curl -sL -o "%FONTS_DIR%\dm-sans-400.woff2" ^
  "https://fonts.gstatic.com/s/dmsans/v15/rP2tp2ywxg089UriI5-g4vlH9VoD8CmcZG_40GYWjeLz.woff2"

curl -sL -o "%FONTS_DIR%\dm-sans-500.woff2" ^
  "https://fonts.gstatic.com/s/dmsans/v15/rP2tp2ywxg089UriI5-g4vlH9VoD8CmcZG_40GYWjeLz.woff2"

curl -sL -o "%FONTS_DIR%\dm-sans-700.woff2" ^
  "https://fonts.gstatic.com/s/dmsans/v15/rP2tp2ywxg089UriI5-g4vlH9VoD8CmcZG_40GYWjeLz.woff2"

echo Downloading Orbitron (regular + bold + black)...

curl -sL -o "%FONTS_DIR%\orbitron-400.woff2" ^
  "https://fonts.gstatic.com/s/orbitron/v31/yMJMMIlzdpvBhQQL_SC3X9yhF25-T1nyGy6BoWgz.woff2"

curl -sL -o "%FONTS_DIR%\orbitron-700.woff2" ^
  "https://fonts.gstatic.com/s/orbitron/v31/yMJMMIlzdpvBhQQL_SC3X9yhF25-T1nyGy6BoWgz.woff2"

curl -sL -o "%FONTS_DIR%\orbitron-900.woff2" ^
  "https://fonts.gstatic.com/s/orbitron/v31/yMJMMIlzdpvBhQQL_SC3X9yhF25-T1nyGy6BoWgz.woff2"

echo.
echo Fonts downloaded to %FONTS_DIR%
echo.
echo Next: replace the @import in styles.css with local @font-face rules.
echo See fonts.css for the replacement snippet.

popd
