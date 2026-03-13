"""
notificacions_whatsapp.py
==========================
Script autonom que llegeix events.json i config.json i envia
un missatge de WhatsApp al grup corresponent 7 dies abans de cada event.

Us:
  python notificacions_whatsapp.py            -> Envia les notificacions pendents
  python notificacions_whatsapp.py --dry-run  -> Mostra els missatges sense enviar
  python notificacions_whatsapp.py --test     -> Envia el proper event com a prova

Requeriments:
  pip install selenium webdriver-manager pyperclip

Nota primera execucio:
  Chrome s'obrira amb WhatsApp Web. Si cal escanejar el QR,
  fes-ho i tanca Chrome. La sessio es guardara a chrome_wa_profile/
  i les properes vegades ja estara iniciada automaticament.
"""

# -- FORCAR UTF-8 A WINDOWS --------------------------------------------------
import sys
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")

import json
import os
import time
from datetime import date, datetime, timedelta

# -- RUTES -------------------------------------------------------------------
BASE_DIR      = os.path.dirname(os.path.abspath(__file__))
EVENTS_JSON   = os.path.join(BASE_DIR, "events.json")
CONFIG_JSON   = os.path.join(BASE_DIR, "config.json")
LOG_JSON      = os.path.join(BASE_DIR, "notificacions_log.json")
# Perfil de Chrome dedicat -> la sessio de WhatsApp es guarda entre execucions
WA_PROFILE    = os.path.join(BASE_DIR, "chrome_wa_profile")

# -- CONSTANTS ---------------------------------------------------------------
DIES_AVIS = 7


# -- CARREGA DE DADES --------------------------------------------------------

def load_json(path: str, default):
    if os.path.exists(path):
        try:
            with open(path, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            print(f"Avis llegint {path}: {e}")
    return default


def save_json(path: str, data) -> None:
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


# -- LOGICA PRINCIPAL --------------------------------------------------------

def build_message(event: dict) -> str:
    """Construeix el text del missatge WhatsApp per a un event."""
    title    = event.get("title", "Event sense titol")
    ev_date  = event.get("date", "?")
    ev_time  = event.get("time") or "Per confirmar"
    location = event.get("location") or "Pendent de confirmacio"
    desc     = event.get("description", "")

    try:
        dt = datetime.strptime(ev_date, "%Y-%m-%d")
        MESOS = {
            1: "gener", 2: "febrer", 3: "marc", 4: "abril",
            5: "maig", 6: "juny", 7: "juliol", 8: "agost",
            9: "setembre", 10: "octubre", 11: "novembre", 12: "desembre"
        }
        DIES = {
            0: "Dilluns", 1: "Dimarts", 2: "Dimecres", 3: "Dijous",
            4: "Divendres", 5: "Dissabte", 6: "Diumenge"
        }
        data_fmt = f"{DIES[dt.weekday()]}, {dt.day} de {MESOS[dt.month]} de {dt.year}"
    except ValueError:
        data_fmt = ev_date

    msg = (
        f"RECORDATORI AgendaGolf\n\n"
        f"{title}\n"
        f"Data: {data_fmt}\n"
        f"Hora: {ev_time}\n"
        f"Lloc: {location}\n"
    )
    if desc:
        msg += f"\n{desc}\n"
    msg += "\nBona sort a tothom!"
    return msg


def get_group_for_event(event: dict, config: dict) -> tuple:
    """
    Retorna (nom_grup, modalitat) per a un event.
    Filtra per la divisio especifica configurada a config.json (camp 'competicio'),
    igual que fa el calendari. Aixi nomes s'envia la notificacio per la divisio
    configurada, no per qualsevol event Stroke o Match del mateix dia.
    """
    title_lower = event.get("title", "").lower()
    for key in ("stroke", "match"):
        cfg_mod   = config.get(key, {})
        grup      = cfg_mod.get("whatsapp_grup", "")
        competicio = cfg_mod.get("competicio", "")
        if not grup:
            continue
        # Filtre per divisio especifica (ex: "Intercamps Stroke Play - 3a Divisio")
        if competicio and competicio.lower() in title_lower:
            return (grup, key.capitalize())
        # Fallback: si no hi ha competicio configurada, accepta qualsevol del tipus
        if not competicio and key in title_lower:
            return (grup, key.capitalize())
    return ("", "")


def log_key(event: dict) -> str:
    return f"{event['date']}|{event['title']}"


def find_pending_notifications(events: list, config: dict, today: date) -> list:
    target_str = (today + timedelta(days=DIES_AVIS)).strftime("%Y-%m-%d")
    pending = []
    for ev in events:
        if ev.get("date") != target_str:
            continue
        grup, modalitat = get_group_for_event(ev, config)
        if not grup:
            continue
        pending.append({"event": ev, "grup": grup, "modalitat": modalitat,
                        "message": build_message(ev)})
    return pending


def find_next_event_for_test(events: list, config: dict, today: date):
    candidates = []
    for ev in events:
        try:
            ev_date = datetime.strptime(ev["date"], "%Y-%m-%d").date()
        except ValueError:
            continue
        if ev_date < today:
            continue
        grup, modalitat = get_group_for_event(ev, config)
        if not grup:
            continue
        candidates.append({"event": ev, "grup": grup, "modalitat": modalitat,
                            "message": build_message(ev), "ev_date": ev_date})
    if not candidates:
        return None
    candidates.sort(key=lambda x: x["ev_date"])
    return candidates[0]


# -- ENVIAMENT WHATSAPP VIA SELENIUM -----------------------------------------

def send_whatsapp_group(group_name: str, message: str) -> bool:
    """
    Envia un missatge a un grup de WhatsApp via Selenium (Chrome).

    - Crea/reutilitza un perfil de Chrome a chrome_wa_profile/
    - Primera vegada: escana el QR de WhatsApp Web, despres tanca Chrome
    - Les seguents vegades ja esta iniciada automaticament
    - No depèn de coordenades ni resolucio de pantalla
    """
    try:
        from selenium import webdriver
        from selenium.webdriver.chrome.service import Service
        from selenium.webdriver.chrome.options import Options
        from selenium.webdriver.common.by import By
        from selenium.webdriver.support.ui import WebDriverWait
        from selenium.webdriver.support import expected_conditions as EC
        from selenium.webdriver.common.keys import Keys
        from webdriver_manager.chrome import ChromeDriverManager
        import pyperclip
    except ImportError as e:
        print(f"ERROR: Dependencia no instal·lada: {e}")
        print("Executa: pip install selenium webdriver-manager pyperclip")
        return False

    driver = None
    try:
        # 1. Configura Chrome amb perfil persistent (guarda la sessio WhatsApp)
        os.makedirs(WA_PROFILE, exist_ok=True)
        options = Options()
        options.add_argument(f"--user-data-dir={WA_PROFILE}")
        options.add_argument("--profile-directory=Default")
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-dev-shm-usage")
        options.add_argument("--disable-blink-features=AutomationControlled")
        options.add_experimental_option("excludeSwitches", ["enable-automation"])
        options.add_experimental_option("useAutomationExtension", False)

        print("  Iniciant Chrome...")
        service = Service(ChromeDriverManager().install())
        driver  = webdriver.Chrome(service=service, options=options)
        wait    = WebDriverWait(driver, 60)

        # 2. Obre WhatsApp Web
        print("  Obrint WhatsApp Web...")
        driver.get("https://web.whatsapp.com/")

        # 3. Espera que WhatsApp estigui llest (apareix la caixa de cerca)
        #    Selector CSS estable: contenteditable amb data-tab='3' = cerca de xats
        SELECTORS_CERCA = [
            "div[contenteditable='true'][data-tab='3']",
            "div[aria-label='Search input textbox']",
            "div[title='Search or start new chat']",
            "div[role='textbox'][data-lexical-editor='true']",
        ]
        print("  Esperant que WhatsApp carregui (si cal, escanejar QR)...")
        cerca_box = None
        for sel in SELECTORS_CERCA:
            try:
                cerca_box = WebDriverWait(driver, 60).until(
                    EC.element_to_be_clickable((By.CSS_SELECTOR, sel))
                )
                print(f"  Cerca trobada: {sel}")
                break
            except Exception:
                continue

        if cerca_box is None:
            print("ERROR: No s'ha trobat la barra de cerca de WhatsApp.")
            print("       Comprova que WhatsApp Web ha carregat correctament.")
            return False

        # 4. Cerca el grup
        print(f"  Cercant grup: '{group_name}'...")
        cerca_box.click()
        time.sleep(0.5)
        cerca_box.send_keys(group_name)
        time.sleep(3)  # Espera resultats

        # 5. Clica el resultat que coincideix exactament amb el nom del grup
        #    Cerca per <span title='NomGrup'> dins els resultats
        try:
            resultat = wait.until(EC.element_to_be_clickable(
                (By.XPATH, f"//span[@title='{group_name}']")
            ))
            resultat.click()
            print(f"  Grup '{group_name}' seleccionat.")
        except Exception:
            # Fallback: prem Enter per agafar el primer resultat
            print("  Nom exacte no trobat, seleccionant primer resultat...")
            cerca_box.send_keys(Keys.ENTER)

        time.sleep(2)

        # 6. Troba el camp de missatge
        SELECTORS_MSG = [
            "div[contenteditable='true'][data-tab='10']",
            "div[aria-label='Type a message']",
            "div[title='Type a message']",
            "footer div[contenteditable='true']",
        ]
        msg_box = None
        for sel in SELECTORS_MSG:
            try:
                msg_box = WebDriverWait(driver, 15).until(
                    EC.element_to_be_clickable((By.CSS_SELECTOR, sel))
                )
                print(f"  Camp de missatge trobat: {sel}")
                break
            except Exception:
                continue

        if msg_box is None:
            print("ERROR: No s'ha trobat el camp de missatge de WhatsApp.")
            return False

        # 7. Escriu el missatge linia a linia
        #    Usem clipboard per gestionar accents i caracters especials
        print("  Escrivint el missatge...")
        msg_box.click()
        time.sleep(0.5)

        lines = message.split("\n")
        for i, line in enumerate(lines):
            if line.strip():
                pyperclip.copy(line)
                msg_box.send_keys(Keys.CONTROL, "v")
                time.sleep(0.3)
            if i < len(lines) - 1:
                msg_box.send_keys(Keys.SHIFT, Keys.ENTER)
            time.sleep(0.2)

        time.sleep(0.5)

        # 8. Envia
        msg_box.send_keys(Keys.ENTER)
        time.sleep(3)

        print("  Missatge enviat correctament!")
        return True

    except Exception as e:
        print(f"ERROR Selenium: {type(e).__name__}: {e}")
        return False

    finally:
        if driver:
            try:
                driver.quit()
            except Exception:
                pass


# -- ENTRY POINT -------------------------------------------------------------

def main():
    dry_run   = "--dry-run" in sys.argv
    test_mode = "--test"    in sys.argv
    today     = date.today()

    print(f"\n{'=' * 55}")
    print(f"  AgendaGolf - Notificacions WhatsApp (Selenium)")
    print(f"  Data d'avui: {today.strftime('%d/%m/%Y')}")
    if test_mode:
        print("  MODE TEST: s'enviara el proper event (sense restriccio)")
    elif dry_run:
        print("  MODE DRY-RUN: no s'enviaran missatges reals")
    else:
        target = (today + timedelta(days=DIES_AVIS)).strftime('%d/%m/%Y')
        print(f"  Revisant events a {DIES_AVIS} dies vista ({target})")
    print(f"{'=' * 55}\n")

    events = load_json(EVENTS_JSON, [])
    config = load_json(CONFIG_JSON, {})
    log    = load_json(LOG_JSON, {})

    if not events:
        print("Cap event trobat a events.json")
        return
    if not config:
        print("Cap configuracio trobada a config.json")
        return

    # -- MODE TEST -----------------------------------------------------------
    if test_mode:
        item = find_next_event_for_test(events, config, today)
        if not item:
            print("Cap event futur amb grup de WhatsApp configurat.")
            return
        ev = item["event"]
        print(f"  EVENT TEST: {ev['title']}")
        print(f"  Data:       {ev['date']}")
        print(f"  Grup:       {item['grup']}  |  Modalitat: {item['modalitat']}")
        print(f"  Missatge:\n{'-' * 45}")
        for line in item["message"].split("\n"):
            print(f"  {line}")
        print(f"{'-' * 45}")
        if dry_run:
            print("\n  [DRY-RUN + TEST] S'enviaria pero no s'envia.")
            return
        print("\n  Enviant missatge de TEST via Selenium...")
        ok = send_whatsapp_group(item["grup"], item["message"])
        if ok:
            print("  TEST enviat correctament!")
        else:
            print("\n  El TEST NO s'ha pogut enviar. Revisa l'error anterior.")
            sys.exit(1)
        return

    # -- MODE NORMAL ---------------------------------------------------------
    pending = find_pending_notifications(events, config, today)
    if not pending:
        print("Cap notificacio pendent per avui.")
        return

    print(f"{len(pending)} notificacio(ns) a enviar:\n")
    results = []

    for item in pending:
        ev      = item["event"]
        grup    = item["grup"]
        message = item["message"]
        key     = log_key(ev)

        print(f"  {ev['title']}")
        print(f"  Grup: {grup}")

        today_str = today.strftime("%Y-%m-%d")
        if log.get(key) == today_str:
            print("  Ja enviat avui. Saltant.\n")
            results.append({"event": ev["title"], "status": "ja_enviat"})
            continue

        if dry_run:
            print(f"  [DRY-RUN] S'enviaria al grup: {grup}\n")
            results.append({"event": ev["title"], "status": "dry_run"})
            continue

        print("  Enviant via Selenium...")
        ok = send_whatsapp_group(grup, message)
        if ok:
            log[key] = today_str
            save_json(LOG_JSON, log)
            print("  Enviat!\n")
            results.append({"event": ev["title"], "status": "enviat"})
        else:
            print("  Error enviant.\n")
            results.append({"event": ev["title"], "status": "error"})

        if len(pending) > 1:
            time.sleep(5)

    print(f"\n{'=' * 55}")
    print(f"  Enviats: {sum(1 for r in results if r['status']=='enviat')}"
          f"  |  Errors: {sum(1 for r in results if r['status']=='error')}"
          f"  |  Saltats: {sum(1 for r in results if r['status']=='ja_enviat')}")
    print(f"{'=' * 55}\n")


if __name__ == "__main__":
    main()
