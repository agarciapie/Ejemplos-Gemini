@echo off
:: executar_notificacions.bat
:: ==========================
:: Executa el script de notificacions WhatsApp d'AgendaGolf.
:: Programa aquest fitxer al Planificador de Tasques de Windows per a
:: una execució diaria (recomanat: cada mati a les 09:00h).
::
:: Com programar la tasca:
::   1. Obre "Planificador de tasques" de Windows
::   2. Crea una tasca nova
::   3. Desencadenant: Diariament a les 09:00
::   4. Accio: Inicia un programa -> Ruta d'aquest fitxer .bat
:: =============================================================

:: Canvia al directori del script
cd /d "%~dp0"

:: Activa l'entorn virtual si existeix (ajusta la ruta si cal)
IF EXIST "..\venv\Scripts\activate.bat" (
    call "..\venv\Scripts\activate.bat"
) ELSE IF EXIST "venv\Scripts\activate.bat" (
    call "venv\Scripts\activate.bat"
)

:: Executa el script de notificacions
python notificacions_whatsapp.py

:: Pausa opcional per veure el resultat (eliminar per execucio silenciosa)
:: pause
