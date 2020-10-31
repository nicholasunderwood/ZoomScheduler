@echo off
setlocal
set "period=%1"
if defined period (
    echo running with period %period%
    python3 "C:\Users\nacho\Documents\Projects\ZoomScheduler\launch.py" %period%
) else (
    echo period not supplied
)
pause



schtasks /create /xml ".\0.xml" /tn "\TASKSCHEDULER-FOLDER-PATH\TASK-INPORT-NAME" /ru "COMPUTER-NAME\USER-NAME"