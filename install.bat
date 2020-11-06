@echo off

FOR /L %%i IN (0,1,9) DO (

    schtasks /delete /tn \Zoom\%%i /f

    if exist %cd%\resources\app\tasks\%%i.xml (
        schtasks /create /XML %cd%\resources\app\tasks\%%i.xml /tn \Zoom\%%i
    )
    if exist %cd%\tasks\%%i.xml (
        schtasks /create /XML %cd%\tasks\%%i.xml /tn \Zoom\%%i
    )
)