@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo.
echo Сайт knit.katarina запускается...
echo Откройте в браузере:
echo   http://localhost:8000/home.html
echo   http://localhost:8000/register.html  - регистрация на сайте
echo   http://localhost:8000/login.html     - вход
echo.
echo Не закрывайте это окно, пока пользуетесь сайтом.
echo.
php -S localhost:8000
pause
