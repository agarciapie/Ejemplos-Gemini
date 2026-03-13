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
from datetime import datetime, date, timedelta
import pdfplumber
from streamlit_calendar import calendar as st_calendar

# ── RUTES ───────────────────────────────────────────────────────────────────────
BASE_DIR    = os.path.dirname(__file__)
EVENTS_JSON = os.path.join(BASE_DIR, "events.json")
CONFIG_JSON = os.path.join(BASE_DIR, "config.json")

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


# ── OPCIONS DE CONFIGURACIÓ ──────────────────────────────────────────────────

COMPETICIO_OPCIONS = {
    "Modalitat Stroke": [
        "Intercamps Stroke Play - 1a Divisió",
        "Intercamps Stroke Play - 2a Divisió",
        "Intercamps Stroke Play - 3a Divisió",
        "Intercamps Stroke Play - 4a Divisió",
    ],
    "Modalitat Match": [
        "Intercamps Match Play - 1a Divisió",
        "Intercamps Match Play - 2a Divisió",
        "Intercamps Match Play - 3a Divisió",
        "Intercamps Match Play - 4a Divisió",
    ],
}


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


def load_config() -> dict:
    """Carrega la configuració des del fitxer config.json."""
    if os.path.exists(CONFIG_JSON):
        try:
            with open(CONFIG_JSON, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            pass
    return {"modalitat": "", "competicio": "", "whatsapp_grup": ""}


def save_config(cfg: dict) -> None:
    """Guarda la configuració al fitxer config.json."""
    with open(CONFIG_JSON, "w", encoding="utf-8") as f:
        json.dump(cfg, f, ensure_ascii=False, indent=2)


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
        ["📅 Calendari", "📄 Importar PDF", "📋 Llista d'Events", "⚙️ Configuració"],
        index=0,
    )
    st.markdown("---")
    # Mostra la configuració activa al sidebar
    cfg_sidebar = load_config()
    if cfg_sidebar.get("competicio"):
        st.markdown(
            f"<div style='color:#bbf7d0;font-size:0.8rem;'>🏌️ "
            f"<b>{cfg_sidebar['competicio']}</b></div>",
            unsafe_allow_html=True,
        )
    if cfg_sidebar.get("whatsapp_grup"):
        st.markdown(
            f"<div style='color:#86efac;font-size:0.8rem;'>💬 "
            f"{cfg_sidebar['whatsapp_grup']}</div>",
            unsafe_allow_html=True,
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
        # ── Filtra els events segons la configuració activa ──────────────────
        cfg_cal      = load_config()
        stroke_cat   = cfg_cal.get("stroke", {}).get("competicio", "")
        match_cat    = cfg_cal.get("match",  {}).get("competicio", "")

        # Construïm la llista de paraules clau de les categories actives
        # Exemple: "Intercamps Stroke Play - 3a Divisió" → busquem "Stroke Play - 3a Divisió"
        keywords = []
        if stroke_cat:
            keywords.append(stroke_cat)
        if match_cat:
            keywords.append(match_cat)

        if keywords:
            filtered_events = [
                ev for ev in events_stored
                if any(kw.lower() in ev["title"].lower() for kw in keywords)
            ]
            # Informa sobre el filtre aplicat
            cats_html = " &nbsp;·&nbsp; ".join(
                f"<b>{k}</b>" for k in keywords
            )
            st.markdown(
                f"<div class='info-box' style='margin-bottom:1rem'>"
                f"🔍 Mostrant únicament: {cats_html}</div>",
                unsafe_allow_html=True,
            )
        else:
            filtered_events = events_stored
            st.info("ℹ️ No hi ha cap categoria configurada. Mostrarem tots els events. "
                    "Ve a **⚙️ Configuració** per seleccionar la teva divisió.")

        if not filtered_events:
            st.markdown(
                "<div class='info-box'>No hi ha events per a la categoria configurada.</div>",
                unsafe_allow_html=True,
            )
        else:
            cal_events = events_to_calendar_format(filtered_events)

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

                if 0 <= idx < len(filtered_events):
                    ev = filtered_events[idx]
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


# ══════════════════════════════════════════════════════════════════════════════
# SECCIÓ 4: CONFIGURACIÓ
# ══════════════════════════════════════════════════════════════════════════════

elif seccio == "⚙️ Configuració":

    st.title("⚙️ Configuració")
    st.caption("Defineix la divisió i el grup de WhatsApp per a cadascuna de les modalitats.")

    cfg = load_config()

    # ── Dues columnes, una per modalitat ────────────────────────────────────────
    col_stroke, col_spacer, col_match = st.columns([5, 1, 5])

    # ── MODALITAT STROKE ────────────────────────────────────────────────────────
    with col_stroke:
        st.markdown(
            "<div style='background:#f0fdf4;border:2px solid #86efac;"
            "border-radius:12px;padding:1.2rem 1.4rem;'>"
            "<h3 style='color:#14532d;margin-top:0'>🏌️ Modalitat Stroke</h3>",
            unsafe_allow_html=True,
        )

        stroke_cfg      = cfg.get("stroke", {})
        stroke_divisions = COMPETICIO_OPCIONS["Modalitat Stroke"]
        stroke_actual   = stroke_cfg.get("competicio") or stroke_divisions[0]

        stroke_comp = st.selectbox(
            "Divisió:",
            stroke_divisions,
            index=stroke_divisions.index(stroke_actual)
                  if stroke_actual in stroke_divisions else 0,
            key="cfg_stroke_comp",
        )
        stroke_wa = st.text_input(
            "Grup de WhatsApp:",
            value=stroke_cfg.get("whatsapp_grup") or "",
            placeholder="Ex: Intercamps Stroke 2026 – 1a Div",
            key="cfg_stroke_wa",
        )
        st.markdown("</div>", unsafe_allow_html=True)

    # ── MODALITAT MATCH ─────────────────────────────────────────────────────────
    with col_match:
        st.markdown(
            "<div style='background:#eff6ff;border:2px solid #93c5fd;"
            "border-radius:12px;padding:1.2rem 1.4rem;'>"
            "<h3 style='color:#1e3a8a;margin-top:0'>🏌️ Modalitat Match</h3>",
            unsafe_allow_html=True,
        )

        match_cfg       = cfg.get("match", {})
        match_divisions = COMPETICIO_OPCIONS["Modalitat Match"]
        match_actual    = match_cfg.get("competicio") or match_divisions[0]

        match_comp = st.selectbox(
            "Divisió:",
            match_divisions,
            index=match_divisions.index(match_actual)
                  if match_actual in match_divisions else 0,
            key="cfg_match_comp",
        )
        match_wa = st.text_input(
            "Grup de WhatsApp:",
            value=match_cfg.get("whatsapp_grup") or "",
            placeholder="Ex: Intercamps Match 2026 – 1a Div",
            key="cfg_match_wa",
        )
        st.markdown("</div>", unsafe_allow_html=True)

    st.markdown("---")

    # ── Botons guardar / esborrar ────────────────────────────────────────────────
    col_save, col_reset = st.columns([2, 1])
    with col_save:
        if st.button("💾 Guardar configuració", use_container_width=True, key="btn_save_cfg"):
            new_cfg = {
                "stroke": {
                    "competicio":    stroke_comp,
                    "whatsapp_grup": stroke_wa.strip(),
                },
                "match": {
                    "competicio":    match_comp,
                    "whatsapp_grup": match_wa.strip(),
                },
            }
            save_config(new_cfg)
            st.success("✅ Configuració guardada correctament!")
            st.rerun()
    with col_reset:
        if st.button("🗑️ Esborrar config", use_container_width=True, key="btn_reset_cfg"):
            save_config({"stroke": {}, "match": {}})
            st.info("Configuració restablerta.")
            st.rerun()

    # ── Resum de la configuració guardada ───────────────────────────────────────
    cfg_saved = load_config()
    stroke_s  = cfg_saved.get("stroke", {})
    match_s   = cfg_saved.get("match",  {})

    if stroke_s.get("competicio") or match_s.get("competicio"):
        st.markdown("---")
        st.markdown("### 📋 Configuració actual guardada")
        rc1, rc2 = st.columns(2)

        with rc1:
            if stroke_s.get("competicio"):
                st.markdown(
                    "<div class='event-card' style='border-left-color:#15803d;'>"
                    f"<div class='event-title'>🏌️ {stroke_s['competicio']}</div>"
                    f"<div class='event-meta'>🎯 Modalitat Stroke</div>"
                    + (f"<div class='event-meta'>💬 {stroke_s['whatsapp_grup']}</div>"
                       if stroke_s.get("whatsapp_grup") else "")
                    + "</div>",
                    unsafe_allow_html=True,
                )

        with rc2:
            if match_s.get("competicio"):
                st.markdown(
                    "<div class='event-card' style='border-left-color:#2563eb;'>"
                    f"<div class='event-title'>🏌️ {match_s['competicio']}</div>"
                    f"<div class='event-meta'>🎯 Modalitat Match</div>"
                    + (f"<div class='event-meta'>💬 {match_s['whatsapp_grup']}</div>"
                       if match_s.get("whatsapp_grup") else "")
                    + "</div>",
                    unsafe_allow_html=True,
                )

    # ── SECCIÓ NOTIFICACIONS WHATSAPP ───────────────────────────────────────────
    st.markdown("---")
    st.markdown("### 🔔 Notificacions WhatsApp")
    st.caption("Events que rebran un avís per WhatsApp en els propers dies.")

    import subprocess
    import sys

    NOTIF_LOG  = os.path.join(BASE_DIR, "notificacions_log.json")
    NOTIF_PY   = os.path.join(BASE_DIR, "notificacions_whatsapp.py")
    DIES_AVIS  = 7

    def load_notif_log() -> dict:
        if os.path.exists(NOTIF_LOG):
            try:
                with open(NOTIF_LOG, "r", encoding="utf-8") as f:
                    return json.load(f)
            except Exception:
                pass
        return {}

    def get_group_for_event_ui(ev: dict, cfg_now: dict) -> tuple:
        title_lower = ev.get("title", "").lower()
        for mod_key in ("stroke", "match"):
            m = cfg_now.get(mod_key, {})
            grup = m.get("whatsapp_grup", "")
            if not grup:
                continue
            if mod_key in title_lower:
                return (grup, mod_key.capitalize())
        return ("", "")

    all_events_notif = load_events()
    cfg_notif        = load_config()
    log_notif        = load_notif_log()
    today_notif      = date.today()

    # Mostra els propers DIES_AVIS dies + 14 dies per veure el que s'avisarà avui i aviat
    upcoming = []
    for ev in all_events_notif:
        try:
            ev_date = datetime.strptime(ev["date"], "%Y-%m-%d").date()
        except ValueError:
            continue
        days_left = (ev_date - today_notif).days
        if 0 <= days_left <= 14:
            grup, modalitat = get_group_for_event_ui(ev, cfg_notif)
            key_notif = f"{ev['date']}|{ev['title']}"
            ja_enviat = (log_notif.get(key_notif) == today_notif.strftime("%Y-%m-%d"))
            upcoming.append({
                "ev": ev, "days_left": days_left,
                "grup": grup, "modalitat": modalitat,
                "ja_enviat": ja_enviat,
                "envia_avui": days_left == DIES_AVIS,
            })

    if not upcoming:
        st.info("ℹ️ No hi ha events en els propers 14 dies per a les modalitats configurades.")
    else:
        for item in upcoming:
            ev         = item["ev"]
            days_left  = item["days_left"]
            grup       = item["grup"] or "—"
            modalitat  = item["modalitat"] or "—"
            ja_enviat  = item["ja_enviat"]
            envia_avui = item["envia_avui"]

            if days_left == 0:
                emoji_dia = "🟥"
                label_dia = "**AVUI**"
            elif days_left == DIES_AVIS:
                emoji_dia = "🔔"
                label_dia = f"En **{days_left}** dies → **S'envia avís avui!**"
            else:
                emoji_dia = "📅"
                label_dia = f"En **{days_left}** dies"

            estat_badge = "✅ Ja enviat" if ja_enviat else ("🔔 Pendent" if envia_avui else "")
            estat_color = "#15803d" if ja_enviat else "#dc2626"

            st.markdown(
                f"<div class='event-card'>"
                f"<div class='event-title'>{emoji_dia} {ev['title']}</div>"
                f"<div class='event-meta'>📆 {ev['date']} &nbsp;·&nbsp; {label_dia}</div>"
                f"<div class='event-meta'>💬 Grup: <b>{grup}</b> &nbsp;·&nbsp; 🎯 {modalitat}"
                + (f" &nbsp;·&nbsp; <span style='color:{estat_color};font-weight:600'>{estat_badge}</span>" if estat_badge else "")
                + "</div></div>",
                unsafe_allow_html=True,
            )

    st.markdown("")
    col_notif1, col_notif2, col_notif3 = st.columns(3)

    with col_notif1:
        if st.button("🔔 Enviar notificacions ara", key="btn_send_notif", use_container_width=True):
            with st.spinner("📤 Executant el script de notificacions..."):
                try:
                    result = subprocess.run(
                        [sys.executable, NOTIF_PY],
                        capture_output=True, text=True, timeout=120,
                        encoding="utf-8", errors="replace",
                    )
                    output = result.stdout + result.stderr
                    if result.returncode == 0:
                        st.success("✅ Script executat correctament!")
                    else:
                        st.warning("⚠️ El script ha acabat amb errors. Revisa la sortida.")
                    if output.strip():
                        st.code(output, language=None)
                except FileNotFoundError:
                    st.error(f"❌ No s'ha trobat el script: {NOTIF_PY}")
                except subprocess.TimeoutExpired:
                    st.error("❌ El script ha superat el temps màxim (120s).")
                except Exception as e:
                    st.error(f"❌ Error: {e}")

    with col_notif2:
        # Cerca el proper event amb grup configurat per mostrar al tooltip del botó
        def _find_next_for_ui(evs, cfg):
            today_ui = date.today()
            for ev in sorted(evs, key=lambda e: e.get("date", "")):
                try:
                    ev_d = datetime.strptime(ev["date"], "%Y-%m-%d").date()
                except ValueError:
                    continue
                if ev_d < today_ui:
                    continue
                title_l = ev.get("title", "").lower()
                for mk in ("stroke", "match"):
                    g = cfg.get(mk, {}).get("whatsapp_grup", "")
                    if g and mk in title_l:
                        return ev, g
            return None, None

        next_ev_ui, next_grup_ui = _find_next_for_ui(all_events_notif, cfg_notif)

        if next_ev_ui:
            short_title = next_ev_ui["title"][:28] + ("…" if len(next_ev_ui["title"]) > 28 else "")
            test_label  = f"🧪 TEST → {short_title}"
            help_test   = (
                f"Envia ara la notificació de **{next_ev_ui['title']}** "
                f"({next_ev_ui['date']}) al grup **{next_grup_ui}**, "
                f"sense esperar els 7 dies."
            )
        else:
            test_label = "🧪 Test (cap event disponible)"
            help_test  = "No hi ha cap event futur amb grup de WhatsApp configurat."

        if st.button(test_label, key="btn_test_notif", use_container_width=True,
                     disabled=(next_ev_ui is None), help=help_test):
            with st.spinner("🧪 Enviant notificació de TEST..."):
                try:
                    result = subprocess.run(
                        [sys.executable, NOTIF_PY, "--test"],
                        capture_output=True, text=True, timeout=120,
                        encoding="utf-8", errors="replace",
                    )
                    output = result.stdout + result.stderr
                    if result.returncode == 0:
                        st.success(
                            f"✅ TEST enviat! Comprova el grup **{next_grup_ui}** a WhatsApp."
                        )
                    else:
                        st.error(
                            "❌ El TEST ha fallat. Causa més probable: el **nom del grup** "
                            f"(`{next_grup_ui}`) no coincideix exactament amb el nom que apareix "
                            "a WhatsApp, o WhatsApp Web no està obert al navegador."
                        )
                    if output.strip():
                        st.code(output, language=None)
                except FileNotFoundError:
                    st.error(f"❌ No s'ha trobat el script: {NOTIF_PY}")
                except subprocess.TimeoutExpired:
                    st.error("❌ El script ha superat el temps màxim (120s).")
                except Exception as e:
                    st.error(f"❌ Error: {e}")

    with col_notif3:
        if st.button("🔍 Dry-Run (sense enviar)", key="btn_dryrun_notif", use_container_width=True):
            with st.spinner("🔍 Simulant enviament..."):
                try:
                    result = subprocess.run(
                        [sys.executable, NOTIF_PY, "--dry-run"],
                        capture_output=True, text=True, timeout=30,
                        encoding="utf-8", errors="replace",
                    )
                    output = result.stdout + result.stderr
                    st.info("🔍 Resultat del Dry-Run (cap missatge enviat)")
                    if output.strip():
                        st.code(output, language=None)
                except Exception as e:
                    st.error(f"❌ Error: {e}")

    # ── Historial d'enviaments ────────────────────────────────────────────────
    if log_notif:
        with st.expander("📜 Historial d'enviaments", expanded=False):
            log_items = sorted(log_notif.items(), key=lambda x: x[1], reverse=True)
            for key_log, data_log in log_items[:20]:
                parts = key_log.split("|", 1)
                ev_date_log  = parts[0] if len(parts) > 0 else "?"
                ev_title_log = parts[1] if len(parts) > 1 else key_log
                st.markdown(
                    f"<div class='event-meta'>✅ {data_log} &nbsp;·&nbsp; "
                    f"<b>{ev_title_log}</b> &nbsp;(event: {ev_date_log})</div>",
                    unsafe_allow_html=True,
                )

    st.markdown("")
    st.info(
        "💡 **Consell:** Per automatitzar l'enviament diari, programa el fitxer "
        "`executar_notificacions.bat` al **Planificador de Tasques de Windows** "
        "perquè s'executi cada dia a les 09:00h."
    )

