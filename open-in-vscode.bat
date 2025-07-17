@echo off
setlocal

REM Get the path to the batch file’s directory
set "DIR=%~dp0"

REM Set the name of the target file (change this to your file)
set "TARGET=example.txt"

REM Build the full path
set "FILE=%DIR%%TARGET%"

REM Open the file in VS Code
code --new-window "%FILE%"

endlocal
