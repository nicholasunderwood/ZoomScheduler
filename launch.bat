@echo off
setlocal
set "url=%1"
set "pswd=%2"
echo %url%
echo %pswd%
if defined url (
    echo running with url %url%
    start "" %url%
    @REM if defined pswd {
    @REM     echo running with url %url% and password %pswd%
    @REM     python3 "C:\Users\nacho\Documents\Projects\ZoomScheduler\launch.py" %url% %pswd%
    @REM } else (
    @REM     echo running with url %url%
    @REM     python3 "C:\Users\nacho\Documents\Projects\ZoomScheduler\launch.py" %url%
    @REM )
) else (
    echo period not supplied
)

if defined pswd (
    echo running with password %pswd%
    echo %pswd%| clip
)
pause


@REM schtasks /create /xml ".\0.xml" /tn "\TASKSCHEDULER-FOLDER-PATH\TASK-INPORT-NAME" /ru "COMPUTER-NAME\USER-NAME"