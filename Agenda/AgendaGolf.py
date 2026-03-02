"""
AgendaGolf.py
=============
Aplicació Streamlit que llegeix un fitxer PDF i extreu
els esdeveniments que hi troba, mostrant-los en un calendari
interactiu. Els esdeveniments es guarden en un fitxer JSON
per poder-los consultar posteriorment sense tornar a pujar el PDF.

Requeriments (requirements.txt):
  streamlit
  google-genai
  pdfplumber
  streamlit-calendar

Execució (des de la carpeta Agenda):
  streamlit run AgendaGolf.py
"""

# ── IMPORTACIONS ────────────────────────────────────────────────────────────────
import streamlit as st
from google import genai
from google.genai import types
import os
import json
import re
from datetime import datetime, date
import pdfplumber
from streamlit_calendar import calendar as st_calendar

# ── RUTES ───────────────────────────────────────────────────────────────────────
BASE_DIR   = os.path.dirname(__file__)
EVENTS_JSON = os.path.join(BASE_DIR, "events.json")

# ── CONFIGURACIÓ DE LA PÀGINA ───────────────────────────────────────────────────
st.set_page_config(
    page_title="AgendaGolf 🗓️",
    page_icon="⛳",
    layout="wide",
)

# ── CSS PERSONALITZAT ────────────────────────────────────────────────────────────
st.markdown("""
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap');

html, body, [class*="css"] {
    font-family: 'Inter', sans-serif;
}
.main {
    background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%);
}
[data-testid="stSidebar"] {
    background: linear-gradient(180deg, #14532d 0%, #166534 60%, #15803d 100%);
}
[data-testid="stSidebar"] * { color: #ffffff !important; }
[data-testid="stSidebar"] hr { border-color: #4ade80 !important; }

.stButton > button {
    background: linear-gradient(135deg, #15803d, #166534);
    color: white;
    border: none;
    border-radius: 10px;
    padding: 0.5rem 1.2rem;
    font-weight: 600;
    transition: all 0.2s ease;
    box-shadow: 0 2px 6px rgba(21,128,61,0.3);
}
.stButton > button:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(21,128,61,0.4);
}

h1 { color: #14532d; letter-spacing: -0.5px; }
h2 { color: #166534; }
h3 { color: #15803d; }

.event-card {
    background: white;
    border-left: 5px solid #15803d;
    border-radius: 10px;
    padding: 1rem 1.2rem;
    margin-bottom: 0.8rem;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    transition: transform 0.15s ease;
}
.event-card:hover { transform: translateX(4px); }
.event-title { font-weight: 700; font-size: 1.05rem; color: #14532d; }
.event-meta  { color: #6b7280; font-size: 0.875rem; margin-top: 0.3rem; }
.event-desc  { color: #374151; font-size: 0.9rem; margin-top: 0.5rem; }

.badge {
    display: inline-block;
    background: #dcfce7;
    color: #166534;
    border-radius: 9999px;
    padding: 0.15rem 0.7rem;
    font-size: 0.78rem;
    font-weight: 600;
    margin-right: 0.3rem;
}
.info-box {
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
    border-radius: 10px;
    padding: 1rem 1.2rem;
    color: #166534;
}
</style>
""", unsafe_allow_html=True)


# ── CÀRREGA DE LA API KEY ─────────────────────────────────────────────────────
# Ordre de prioritat:
#   1. st.secrets["GEMINI_API_KEY"]  → Streamlit Cloud / secrets.toml
#   2. API_KEY.txt al directori pare → ús local / desenvolupament

API_KEY = ""

try:
    API_KEY = st.secrets["GEMINI_API_KEY"]
except Exception:
    pass

if not API_KEY:
    # Busca API_KEY.txt a la carpeta pare (Ejemplos Gemini)
    parent_dir = os.path.dirname(BASE_DIR)
    for search_dir in [BASE_DIR, parent_dir]:
        key_file = os.path.join(search_dir, "API_KEY.txt")
        if os.path.exists(key_file):
            with open(key_file, "r") as f:
                API_KEY = f.read().strip()
            break


# ── FUNCIONS AUXILIARS ────────────────────────────────────────────────────────

def load_events() -> list[dict]:
    """Carrega els esdeveniments des del fitxer JSON de persistència."""
    if os.path.exists(EVENTS_JSON):
        try:
            with open(EVENTS_JSON, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return []
    return []


def save_events(events: list[dict]) -> None:
    """Guarda la llista d'esdeveniments al fitxer JSON."""
    with open(EVENTS_JSON, "w", encoding="utf-8") as f:
        json.dump(events, f, ensure_ascii=False, indent=2)


def extract_pdf_text(uploaded_file) -> str:
    """Extreu el text complet d'un PDF pujat amb pdfplumber."""
    text_parts = []
    with pdfplumber.open(uploaded_file) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text_parts.append(page_text)
    return "\n\n".join(text_parts)


def extract_events_with_gemini(client, pdf_text: str) -> list[dict]:
    """
    Envia el text del PDF a Gemini i retorna una llista estructurada d'esdeveniments.

    Cada event té els camps:
        title       : str  – Nom de l'event
        date        : str  – Format YYYY-MM-DD
        time        : str  – Format HH:MM o null
        location    : str  – Lloc o null
        description : str  – Descripció breu
    """
    prompt = f"""Analitza el text d'un document PDF que conté informació sobre competicions, esdeveniments o activitats de golf.

Extreu TOTS els esdeveniments, competicions, tornejos, cursos, reunions o activitats que tinguin una data concreta.

Retorna EXCLUSIVAMENT un array JSON vàlid, sense cap text addicional, sense marques de codi, sense explicacions.

Format de cada event:
{{
  "title": "Nom clar i descriptiu de l'event",
  "date": "YYYY-MM-DD",
  "time": "HH:MM o null si no hi ha hora",
  "location": "Lloc de l'event o null si no s'especifica",
  "description": "Descripció breu de 1-2 frases"
}}

Si no trobes cap event amb data concreta, retorna un array buit: []

TEXT DEL PDF:
---
{pdf_text[:15000]}
---

Respon ÚNICAMENT amb el JSON array. Res més."""

    config = types.GenerateContentConfig(
        system_instruction=(
            "Ets un assistent especialitzat en extracció d'informació estructurada de documents. "
            "Sempre retornes JSON vàlid, sense res més. Mai inclous text fora del JSON."
        ),
    )

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
        config=config,
    )

    raw = response.text.strip()

    # Intenta extreure el JSON fins i tot si la resposta inclou text addicional
    json_match = re.search(r"\[.*\]", raw, re.DOTALL)
    if json_match:
        raw = json_match.group(0)

    events = json.loads(raw)

    # Valida i normalitza cada event
    valid_events = []
    for ev in events:
        if not isinstance(ev, dict):
            continue
        # Comprova que té title i date
        if not ev.get("title") or not ev.get("date"):
            continue
        # Normalitza la data
        try:
            datetime.strptime(ev["date"], "%Y-%m-%d")
        except ValueError:
            continue  # Descarta dates invàlides
        valid_events.append({
            "title":       ev.get("title", "Sense títol"),
            "date":        ev["date"],
            "time":        ev.get("time") or None,
            "location":    ev.get("location") or None,
            "description": ev.get("description") or "",
        })

    # Ordena per data
    valid_events.sort(key=lambda e: e["date"])
    return valid_events


def events_to_calendar_format(events: list[dict]) -> list[dict]:
    """Converteix els events al format que espera streamlit-calendar."""
    palette = [
        "#15803d", "#166534", "#16a34a", "#4ade80",
        "#0d9488", "#0891b2", "#7c3aed", "#db2777",
    ]
    cal_events = []
    for i, ev in enumerate(events):
        color = palette[i % len(palette)]
        cal_ev = {
            "title": ev["title"],
            "start": ev["date"],
            "color": color,
            "extendedProps": {
                "idx": i,
                "time":        ev.get("time") or "–",
                "location":    ev.get("location") or "–",
                "description": ev.get("description") or "",
            },
        }
        if ev.get("time"):
            cal_ev["start"] = f"{ev['date']}T{ev['time']}:00"
        cal_events.append(cal_ev)
    return cal_events


# ── BARRA LATERAL ─────────────────────────────────────────────────────────────

with st.sidebar:
    st.markdown("## ⛳ AgendaGolf")
    st.markdown("---")
    seccio = st.radio(
        "Navegació:",
        ["📅 Calendari", "📄 Importar PDF", "📋 Llista d'Events"],
        index=0,
    )
    st.markdown("---")
    events_stored = load_events()
    total = len(events_stored)
    st.markdown(
        f"<div style='color:#bbf7d0;font-size:0.85rem;'>"
        f"📌 <b>{total}</b> event{'s' if total != 1 else ''} guardats</div>",
        unsafe_allow_html=True,
    )
    st.markdown("---")
    if st.button("🗑️ Esborrar tots els events", key="btn_delete_all"):
        save_events([])
        st.success("Events eliminats.")
        st.rerun()


# ── VALIDACIÓ API KEY ─────────────────────────────────────────────────────────

if not API_KEY:
    st.error(
        "❌ No s'ha trobat la API Key de Gemini.\n\n"
        "Crea un fitxer `API_KEY.txt` a la carpeta del projecte amb la teva clau, "
        "o afegeix `GEMINI_API_KEY` a `.streamlit/secrets.toml`."
    )
    st.stop()

client = genai.Client(api_key=API_KEY)


# ══════════════════════════════════════════════════════════════════════════════
# SECCIÓ 1: CALENDARI
# ══════════════════════════════════════════════════════════════════════════════

if seccio == "📅 Calendari":

    st.title("📅 AgendaGolf – Calendari")

    events_stored = load_events()

    if not events_stored:
        st.markdown(
            "<div class='info-box'>No hi ha events a l'agenda. "
            "Ve a <b>📄 Importar PDF</b> per afegir events des d'un document.</div>",
            unsafe_allow_html=True,
        )
    else:
        cal_events = events_to_calendar_format(events_stored)

        # Opcions del calendari
        cal_options = {
            "initialView": "dayGridMonth",
            "headerToolbar": {
                "left":   "prev,next today",
                "center": "title",
                "right":  "dayGridMonth,timeGridWeek,listMonth",
            },
            "locale": "ca",
            "buttonText": {
                "today":     "Avui",
                "month":     "Mes",
                "week":      "Setmana",
                "list":      "Llista",
            },
            "eventColor": "#15803d",
            "height": 600,
            "selectable": True,
            "editable":   False,
        }

        # Estil personalitzat per al calendari
        custom_css = """
        .fc-toolbar-title { color: #14532d !important; font-weight: 700; }
        .fc-button-primary { background: #15803d !important; border-color: #166534 !important; }
        .fc-button-primary:hover { background: #166534 !important; }
        .fc-daygrid-event { border-radius: 6px !important; font-weight: 500; }
        .fc-list-event-title { font-weight: 600; }
        """

        result = st_calendar(
            events=cal_events,
            options=cal_options,
            custom_css=custom_css,
            key="agenda_calendar",
        )

        # Panell de detalls quan es clica un event
        if result and result.get("eventClick"):
            props = result["eventClick"]["event"].get("extendedProps", {})
            idx   = props.get("idx", -1)

            if 0 <= idx < len(events_stored):
                ev = events_stored[idx]
                with st.expander(f"📌 {ev['title']}", expanded=True):
                    col1, col2 = st.columns(2)
                    with col1:
                        st.markdown(f"**📆 Data:** {ev['date']}")
                        if ev.get("time"):
                            st.markdown(f"**🕐 Hora:** {ev['time']}")
                    with col2:
                        if ev.get("location"):
                            st.markdown(f"**📍 Lloc:** {ev['location']}")
                    if ev.get("description"):
                        st.markdown(f"**ℹ️ Descripció:**")
                        st.info(ev["description"])


# ══════════════════════════════════════════════════════════════════════════════
# SECCIÓ 2: IMPORTAR PDF
# ══════════════════════════════════════════════════════════════════════════════

elif seccio == "📄 Importar PDF":

    st.title("📄 Importar PDF")
    st.caption("Puja un document PDF i l'IA extraurà automàticament tots els esdeveniments que conté.")

    uploaded_pdf = st.file_uploader(
        "Selecciona un fitxer PDF",
        type=["pdf"],
        help="El document pot ser un calendari de competicions, programa d'activitats, temporada de golf, etc.",
    )

    if uploaded_pdf:
        st.success(f"✅ Fitxer carregat: **{uploaded_pdf.name}**")

        col_mode, col_btn = st.columns([3, 1])
        with col_mode:
            mode = st.radio(
                "Mode d'importació:",
                ["➕ Afegir als events existents", "🔄 Substituir tots els events"],
                horizontal=True,
            )
        with col_btn:
            st.markdown("<br>", unsafe_allow_html=True)
            run_btn = st.button("🔍 Extreure Events", use_container_width=True)

        if run_btn:
            with st.spinner("📖 Llegint el PDF..."):
                try:
                    pdf_text = extract_pdf_text(uploaded_pdf)
                except Exception as e:
                    st.error(f"❌ Error llegint el PDF: {e}")
                    st.stop()

                if not pdf_text.strip():
                    st.warning("⚠️ El PDF no conté text llegible (pot ser un PDF escanejat).")
                    st.stop()

            n_chars = len(pdf_text)
            st.info(f"📃 Text extret: **{n_chars:,}** caràcters / **{len(pdf_text.split())}** paraules")

            with st.spinner("🤖 Gemini analitzant el document..."):
                try:
                    new_events = extract_events_with_gemini(client, pdf_text)
                except json.JSONDecodeError:
                    st.error("❌ Gemini no ha retornat un JSON vàlid. Torna-ho a intentar.")
                    st.stop()
                except Exception as e:
                    err = str(e)
                    if "429" in err or "quota" in err.lower():
                        st.error("⚠️ Quota de l'API esgotada. Espera uns minuts i torna-ho a intentar.")
                    else:
                        st.error(f"❌ Error Gemini: {err}")
                    st.stop()

            if not new_events:
                st.warning("⚠️ No s'han trobat esdeveniments amb dates concretes en aquest document.")
            else:
                # Guarda els events
                if "Substituir" in mode:
                    final_events = new_events
                else:
                    existing = load_events()
                    # Evita duplicats per títol + data
                    existing_keys = {(e["title"], e["date"]) for e in existing}
                    deduped = [e for e in new_events if (e["title"], e["date"]) not in existing_keys]
                    final_events = existing + deduped

                save_events(final_events)

                st.success(f"🎉 **{len(new_events)}** events extrets i guardats correctament!")
                st.balloons()

                # Previsualització dels events trobats
                st.markdown("### Events trobats")
                for ev in new_events:
                    time_str  = f" · 🕐 {ev['time']}"        if ev.get("time")     else ""
                    loc_str   = f" · 📍 {ev['location']}"    if ev.get("location") else ""
                    desc_str  = f"<div class='event-desc'>{ev['description']}</div>" if ev.get("description") else ""
                    st.markdown(
                        f"<div class='event-card'>"
                        f"<div class='event-title'>📌 {ev['title']}</div>"
                        f"<div class='event-meta'>📆 {ev['date']}{time_str}{loc_str}</div>"
                        f"{desc_str}"
                        f"</div>",
                        unsafe_allow_html=True,
                    )

                st.markdown("---")
                st.info("✅ Ve a **📅 Calendari** per veure els events al calendari interactiu.")

    else:
        st.markdown(
            "<div class='info-box'>"
            "👆 Puja un PDF per extreure els seus events automàticament.<br><br>"
            "💡 <b>Exemples de documents compatibles:</b><br>"
            "• Calendari de competicions de golf<br>"
            "• Programes d'activitats del club<br>"
            "• Circulars de temporada<br>"
            "• Normatives amb dates importants"
            "</div>",
            unsafe_allow_html=True,
        )


# ══════════════════════════════════════════════════════════════════════════════
# SECCIÓ 3: LLISTA D'EVENTS
# ══════════════════════════════════════════════════════════════════════════════

elif seccio == "📋 Llista d'Events":

    st.title("📋 Llista d'Events")

    events_stored = load_events()

    if not events_stored:
        st.markdown(
            "<div class='info-box'>No hi ha events. Importa un PDF primer.</div>",
            unsafe_allow_html=True,
        )
    else:
        # Filtre per mes/any
        all_dates = [datetime.strptime(e["date"], "%Y-%m-%d") for e in events_stored]
        min_year  = min(d.year for d in all_dates)
        max_year  = max(d.year for d in all_dates)

        col_f1, col_f2, col_f3 = st.columns(3)
        today = date.today()
        with col_f1:
            fil_year = st.selectbox("Any:", ["Tots"] + list(range(min_year, max_year + 1)), index=0)
        with col_f2:
            mesos = {
                1:"Gener",2:"Febrer",3:"Març",4:"Abril",5:"Maig",6:"Juny",
                7:"Juliol",8:"Agost",9:"Setembre",10:"Octubre",11:"Novembre",12:"Desembre"
            }
            fil_month = st.selectbox("Mes:", ["Tots"] + list(mesos.values()), index=0)
        with col_f3:
            fil_text = st.text_input("Cerca:", placeholder="Títol o lloc...")

        # Aplica filtres
        filtered = []
        for ev in events_stored:
            ev_date = datetime.strptime(ev["date"], "%Y-%m-%d")
            if fil_year != "Tots" and ev_date.year != int(fil_year):
                continue
            if fil_month != "Tots":
                num_mes = [k for k, v in mesos.items() if v == fil_month][0]
                if ev_date.month != num_mes:
                    continue
            if fil_text:
                needle = fil_text.lower()
                if (needle not in ev["title"].lower() and
                        needle not in (ev.get("location") or "").lower()):
                    continue
            filtered.append(ev)

        st.caption(f"Mostrant **{len(filtered)}** de {len(events_stored)} events")
        st.markdown("---")

        if not filtered:
            st.info("Cap event coincideix amb els filtres aplicats.")
        else:
            for ev in filtered:
                ev_date   = datetime.strptime(ev["date"], "%Y-%m-%d")
                is_past   = ev_date.date() < today
                time_str  = f" · 🕐 {ev['time']}"     if ev.get("time")     else ""
                loc_str   = f" · 📍 {ev['location']}" if ev.get("location") else ""
                desc_str  = f"<div class='event-desc'>{ev['description']}</div>" if ev.get("description") else ""
                faded     = "opacity:0.55;" if is_past else ""
                st.markdown(
                    f"<div class='event-card' style='{faded}'>"
                    f"<div class='event-title'>{'✓ ' if is_past else '📌 '}{ev['title']}</div>"
                    f"<div class='event-meta'>📆 {ev['date']}{time_str}{loc_str}</div>"
                    f"{desc_str}"
                    f"</div>",
                    unsafe_allow_html=True,
                )
