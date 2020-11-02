@echo off
set dir = %cd%
set count = 0

FOR /L %%i IN (0,1,8) DO (
    schtasks /delete /tn \Custom\%%i
)

for /r %%i in (tasks\*.xml) do (
    call :subroutine "%%i"
)

:subroutine
    echo %count%:%1
    schtasks /Create /XML %1 /TN \Custom\%count%
    set /a count+=1
    GOTO :eof