@echo off
setlocal
set "url=%1"
set "pswd=%2"
echo %url%
echo %pswd%
if defined url (
    echo running with url %url%
    start "" %url%
) else (
    echo period not supplied
)

if defined pswd (
    echo running with password %pswd%
    echo %pswd%| clip
)