@echo off

FOR /L %%i IN (0,1,9) DO (

    schtasks /delete /tn \ZoomScheduler\%%i /f

    if exist %cd%\tasks\%%i.xml (
        schtasks /create /XML %cd%\tasks\%%i.xml /tn \ZoomScheduler\%%i
    )
)