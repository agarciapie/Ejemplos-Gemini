"""
notificacions_whatsapp.py
==========================
Script autònom que llegeix events.json i config.json i envia
un missatge de WhatsApp al grup corresponent 7 dies abans de cada event.

Us:
  python notificacions_whatsapp.py            -> Envia les notificacions pendents
  python notificacions_whatsapp.py --dry-run  -> Mostra els missatges sense enviar

Requeriments:
  pip install pywhatkit

Configura la tasca diaria a Windows amb:
  executar_notificacions.bat
"""

# ── FORÇAR UTF-8 A WINDOWS ──────────────────────────────────────────────────
import sys
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")

import json
import os
import time
from datetime import date, datetime, timedelta

# ── RUTES ────────────────────────────────────────────────────────────────────
BASE_DIR      = os.path.dirname(os.path.abspath(__file__))
EVENTS_JSON   = os.path.join(BASE_DIR, "events.json")
CONFIG_JSON   = os.path.join(BASE_DIR, "config.json")
LOG_JSON      = os.path.join(BASE_DIR, "notificacions_log.json")

# ── CONSTANTS ─────────────────────────────────────────────────────────────────
DIES_AVIS = 7   # Quants dies abans s'envia l'avís


# ── CÀRREGA DE DADES ──────────────────────────────────────────────────────────

def load_json(path: str, default):
    if os.path.exists(path):
        try:
            with open(path, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            print(f"⚠️  Error llegint {path}: {e}")
    return default


def save_json(path: str, data) -> None:
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


# ── LÒGICA PRINCIPAL ──────────────────────────────────────────────────────────

def build_message(event: dict) -> str:
    """Construeix el text del missatge WhatsApp per a un event."""
    title    = event.get("title", "Event sense títol")
    ev_date  = event.get("date", "?")
    ev_time  = event.get("time") or "Per confirmar"
    location = event.get("location") or "Pendent de confirmació"
    desc     = event.get("description", "")

    # Formata la data en català
    try:
        dt = datetime.strptime(ev_date, "%Y-%m-%d")
        MESOS_CA = {
            1: "gener", 2: "febrer", 3: "març", 4: "abril",
            5: "maig", 6: "juny", 7: "juliol", 8: "agost",
            9: "setembre", 10: "octubre", 11: "novembre", 12: "desembre"
        }
        DIES_CA = {
            0: "dilluns", 1: "dimarts", 2: "dimecres", 3: "dijous",
            4: "divendres", 5: "dissabte", 6: "diumenge"
        }
        dia_setmana = DIES_CA[dt.weekday()].capitalize()
        data_fmt = f"{dia_setmana}, {dt.day} de {MESOS_CA[dt.month]} de {dt.year}"
    except ValueError:
        data_fmt = ev_date

    msg = (
        f"🏌️ *RECORDATORI – AgendaGolf* ⛳\n\n"
        f"📌 *{title}*\n"
        f"📆 Data: {data_fmt}\n"
        f"🕐 Hora: {ev_time}\n"
        f"📍 Lloc: {location}\n"
    )
    if desc:
        msg += f"\nℹ️ {desc}\n"
    msg += "\nBona sort a tothom! 🍀"
    return msg


def get_group_for_event(event: dict, config: dict) -> tuple[str, str]:
    """
    Retorna (nom_grup, modalitat) per a un event basant-se en el títol.
    Retorna ('', '') si no coincideix cap modalitat configurada.
    """
    title_lower = event.get("title", "").lower()

    for modalitat_key in ("stroke", "match"):
        cfg_mod = config.get(modalitat_key, {})
        competicio = cfg_mod.get("competicio", "")
        grup       = cfg_mod.get("whatsapp_grup", "")

        if not grup:
            continue  # Grup no configurat, saltem

        # Comprovem si el títol de l'event conté paraules clau de la modalitat
        if modalitat_key == "stroke" and "stroke" in title_lower:
            return (grup, "Stroke")
        if modalitat_key == "match" and "match" in title_lower:
            return (grup, "Match")

    return ("", "")


def log_key(event: dict) -> str:
    """Clau única d'un event per al log."""
    return f"{event['date']}|{event['title']}"


def find_pending_notifications(events: list, config: dict, today: date) -> list[dict]:
    """
    Retorna la llista d'events que:
    - Estan a exactament DIES_AVIS dies vista
    - Pertanyen a una modalitat configurada amb grup de WhatsApp
    """
    target_date = today + timedelta(days=DIES_AVIS)
    target_str  = target_date.strftime("%Y-%m-%d")

    pending = []
    for ev in events:
        if ev.get("date") != target_str:
            continue
        grup, modalitat = get_group_for_event(ev, config)
        if not grup:
            continue
        pending.append({
            "event":     ev,
            "grup":      grup,
            "modalitat": modalitat,
            "message":   build_message(ev),
        })
    return pending


def send_whatsapp_group(group_name: str, message: str) -> bool:
    """
    Envia un missatge a un grup de WhatsApp via pywhatkit.
    Retorna True si l'enviament ha estat correcte, False si hi ha hagut errors.
    """
    try:
        import pywhatkit as pwk  # type: ignore
        # sendwhatmsg_to_group_instantly requereix la sessió de WhatsApp Web activa
        pwk.sendwhatmsg_to_group_instantly(
            group_id=group_name,
            message=message,
            wait_time=15,        # Segons d'espera fins que obre WhatsApp Web
            tab_close=True,      # Tanca la pestanya un cop enviat
            close_time=3,
        )
        return True
    except ImportError:
        print("❌ pywhatkit no instal·lat. Executa: pip install pywhatkit")
        return False
    except Exception as e:
        print(f"❌ Error enviant WhatsApp: {e}")
        return False


# ── ENTRY POINT ───────────────────────────────────────────────────────────────

def main():
    dry_run = "--dry-run" in sys.argv
    today   = date.today()

    print(f"\n{'=' * 55}")
    print(f"  🏌️  AgendaGolf – Notificacions WhatsApp")
    print(f"  📅 Data d'avui: {today.strftime('%d/%m/%Y')}")
    print(f"  🔔 Revisant events a {DIES_AVIS} dies vista ({(today + timedelta(days=DIES_AVIS)).strftime('%d/%m/%Y')})")
    if dry_run:
        print("  🧪 MODE DRY-RUN: no s'enviaran missatges reals")
    print(f"{'=' * 55}\n")

    events = load_json(EVENTS_JSON, [])
    config = load_json(CONFIG_JSON, {})
    log    = load_json(LOG_JSON, {})

    if not events:
        print("ℹ️  Cap event trobat a events.json")
        return

    if not config:
        print("ℹ️  Cap configuració trobada a config.json")
        return

    pending = find_pending_notifications(events, config, today)

    if not pending:
        print("✅ Cap notificació pendent per avui.")
        return

    print(f"📬 {len(pending)} notificació(ns) a enviar:\n")

    results = []
    for item in pending:
        ev        = item["event"]
        grup      = item["grup"]
        modalitat = item["modalitat"]
        message   = item["message"]
        key       = log_key(ev)

        print(f"  📌 {ev['title']}")
        print(f"     Grup: {grup}  |  Modalitat: {modalitat}")
        print(f"     Missatge:\n{'─' * 45}")
        for line in message.split("\n"):
            print(f"     {line}")
        print(f"{'─' * 45}")

        # Comprova si ja s'ha enviat prèviament
        today_str = today.strftime("%Y-%m-%d")
        if log.get(key) == today_str:
            print(f"  ⏭️  Ja enviat avui. Saltant.\n")
            results.append({"event": ev["title"], "status": "ja_enviat"})
            continue

        if dry_run:
            print(f"  🧪 [DRY-RUN] S'enviaria al grup: {grup}\n")
            results.append({"event": ev["title"], "status": "dry_run"})
            continue

        print(f"  📤 Enviant...")
        ok = send_whatsapp_group(grup, message)

        if ok:
            log[key] = today_str
            save_json(LOG_JSON, log)
            print(f"  ✅ Enviat correctament!\n")
            results.append({"event": ev["title"], "grup": grup, "status": "enviat", "data": today_str})
        else:
            print(f"  ❌ Error enviant. Comprova WhatsApp Web.\n")
            results.append({"event": ev["title"], "status": "error"})

        # Pausa entre enviaments per no saturar WhatsApp
        if len(pending) > 1:
            time.sleep(5)

    print(f"\n{'=' * 55}")
    enviats  = sum(1 for r in results if r["status"] == "enviat")
    errors   = sum(1 for r in results if r["status"] == "error")
    saltats  = sum(1 for r in results if r["status"] == "ja_enviat")
    print(f"  ✅ Enviats: {enviats}  |  ❌ Errors: {errors}  |  ⏭️  Saltats: {saltats}")
    print(f"{'=' * 55}\n")


if __name__ == "__main__":
    main()
