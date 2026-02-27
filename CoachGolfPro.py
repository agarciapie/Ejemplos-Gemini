"""
CoachGolfPro.py
===============
Aplicació Streamlit que actua com a entrenador de golf intel·ligent, combinant:
  1. Chat amb coneixement dels vídeos de YouTube (de CoachGolfGem.py)
  2. Anàlisi visual de swing pujant un vídeo (de CoachGolfVideo.py)

Requeriments (requirements.txt):
  streamlit
  google-genai
  youtube-transcript-api
  requests

Execució:
  streamlit run CoachGolfPro.py
"""

# ── IMPORTACIONS ───────────────────────────────────────────────────────────────

import streamlit as st               # Framework web per crear la interfície d'usuari
from google import genai             # NOU SDK de Google Gemini (substitueix google.generativeai)
from google.genai import types       # Tipus de configuració del nou SDK
import os                            # Operacions amb el sistema de fitxers
import time                          # Pausar l'execució mentre el servidor processa el vídeo
import tempfile                      # Crear fitxers temporals per al vídeo pujat
import requests as _req              # Crida HTTP servidor→API per al comptador de visites
import streamlit.components.v1 as _components  # Per injectar HTML/JS (Google Analytics)
import uuid as _uuid                  # Per generar client_id únic per sessió (GA4)
try:
    from langdetect import detect as _detect_lang
    _LANGDETECT_OK = True
except ImportError:
    _LANGDETECT_OK = False


# ── CÀRREGA DEL CONEIXEMENT (KNOWLEDGE) ───────────────────────────────────────
# coach_config.json conté les transcripcions dels vídeos de YouTube,
# la normativa de Pitch&Putt i la instrucció de sistema (SYSTEM_INSTRUCTION).
#
# Per actualitzar el coneixement o modificar SYSTEM_INSTRUCTION,
# edita directament coach_config.json o torna a executar build_gem.py.

def _load_config():
    """
    Llegeix KNOWLEDGE i SYSTEM_INSTRUCTION des de coach_config.json.

    Returns:
        tuple: (knowledge: str, system_instruction: str)
               Retorna strings buits si el fitxer no existeix o hi ha error.
    """
    import json
    config_path = os.path.join(os.path.dirname(__file__), "coach_config.json")
    try:
        with open(config_path, "r", encoding="utf-8") as f:
            cfg = json.load(f)
        return cfg.get("knowledge", ""), cfg.get("system_instruction", "")
    except Exception:
        return "", ""

# S'executa una sola vegada en arrencar l'app
KNOWLEDGE, SYSTEM_INSTRUCTION = _load_config()


# ── CONFIGURACIÓ DE LA PÀGINA ─────────────────────────────────────────────────
# Aquesta crida SEMPRE ha de ser la primera funció de Streamlit que s'executa.

st.set_page_config(
    page_title="Golf Coach Pro",
    page_icon="⛳",
    layout="wide",
)

# ── GOOGLE ANALYTICS (GA4) ─ SERVER-SIDE TRACKING ────────────────────────────
# Usem el GA4 Measurement Protocol per enviar events directament des del
# servidor Python. Això és 100% fiable: no depèn del browser de l'usuari,
# no pot ser bloquejat per adblockers ni per les CSP headers de Streamlit Cloud.
_GA4_ID         = "G-KBSGED08HM"
_GA4_API_SECRET = "W7GQLD0DSJiMT7CRNXbKUg"
_GA4_ENDPOINT   = (
    f"https://www.google-analytics.com/mp/collect"
    f"?measurement_id={_GA4_ID}&api_secret={_GA4_API_SECRET}"
)

def _ga4_send(event_name: str, params: dict = None) -> None:
    """Envia un event a GA4 via Measurement Protocol (servidor Python)."""
    if "ga4_client_id" not in st.session_state:
        st.session_state.ga4_client_id = str(_uuid.uuid4())
    payload = {
        "client_id": st.session_state.ga4_client_id,
        "events": [{"name": event_name, "params": params or {}}],
    }
    try:
        _req.post(_GA4_ENDPOINT, json=payload, timeout=3)
    except Exception:
        pass  # El tracking no hauria d'aturar mai l'app

# Envia el page_view una sola vegada per sessió
if "ga4_page_viewed" not in st.session_state:
    st.session_state.ga4_page_viewed = True
    _ga4_send("page_view", {"page_title": "Golf Coach Pro", "page_location": "streamlit"})


# CSS personalitzat per als colors i estil de la interfície
st.markdown("""
    <style>
    .main { background-color: #f0fdf4; }
    [data-testid="stSidebar"] { background-color: #14532d; }
    [data-testid="stSidebar"] * { color: #ffffff !important; }
    [data-testid="stSidebar"] .stSelectbox label { color: #bbf7d0 !important; }
    .stButton>button { background-color: #166534; color: white; border-radius: 8px; }
    .stButton>button:hover { background-color: #15803d; }
    h1 { color: #14532d; }
    </style>
""", unsafe_allow_html=True)


# ── CÀRREGA DE LA API KEY (sense mostrar-la a la UI) ─────────────────────────
# Ordre de prioritat:
#   1. st.secrets["GEMINI_API_KEY"]  → Streamlit Cloud / secrets.toml
#   2. API_KEY.txt                   → ús local / desenvolupament

API_KEY = ""

try:
    API_KEY = st.secrets["GEMINI_API_KEY"]
except Exception:
    pass

if not API_KEY:
    key_file = os.path.join(os.path.dirname(__file__), "API_KEY.txt")
    if os.path.exists(key_file):
        with open(key_file, "r") as f:
            API_KEY = f.read().strip()




# ── COMPTADOR DE VISITES (servidor Python → API) ─────────────────────────────
# La crida HTTP es fa des del SERVIDOR Python (no del navegador),
# de manera que no hi ha problemes de CORS ni de CSP del navegador.
# session_state evita comptar més d'una vegada per sessió de Streamlit:
# - Clic a un botó / canvi de sacció  → NO compta (session_state persisteix)
# - Obrir l'app / F5 / nova pestanya  → SÍ compta (nova sessió = nova visita)

if "visit_counted" not in st.session_state:
    # Primera vegada que aquesta sessió de navegador arriba aquí:
    # inicialitzem el flag a False i fem la crida a l'API UNA SOLA VEGADA.
    # Les rerenderitzacions de Streamlit (botons, st.rerun, canvis de secció)
    # NO entren aquí perquè session_state ja conté "visit_counted".
    st.session_state.visit_counted = False
    st.session_state.visit_count = None

if not st.session_state.visit_counted:
    st.session_state.visit_counted = True
    try:
        r = _req.get(
            "https://api.counterapi.dev/v1/coachgolfpro/visites/up",
            timeout=4,
        )
        if r.ok:
            st.session_state.visit_count = r.json().get("count")
    except Exception:
        pass  # Si l'API no respon, el comptador no es mostra però l'app continua



# ── MENÚ LATERAL (NAVEGACIÓ) ──────────────────────────────────────────────────
# st.radio retorna l'opció seleccionada; condiciona quin bloc s'executa

with st.sidebar:
    st.markdown("## ⛳ Golf Coach Pro")
    st.markdown("---")
    seccio = st.radio(
        "Selecciona una opció:",
        ["💬 Consulta al entrenador", "🎥 Anàlisi de vídeo"],
        index=0,
    )
    st.markdown("---")
    st.markdown(
        "<small>Entrenador basat en vídeos de YouTube + anàlisi d'IA de Gemini</small>",
        unsafe_allow_html=True,
    )
    # Mostra el recompte de visites (només si l'API ha respost correctament)
    if st.session_state.get("visit_count") is not None:
        st.markdown("---")
        st.metric("\U0001f465 Visites", f"{st.session_state.visit_count:,}")


# ── VALIDACIÓ DE LA API KEY ───────────────────────────────────────────────────
# Si no s'ha pogut obtenir la clau, aturem l'app amb un missatge d'error.

if not API_KEY:
    st.error("❌ No s'ha trobat la API Key. Contacta l'administrador de l'aplicació.")
    st.stop()

# Creem el client del nou SDK amb la clau carregada.
# A diferència de l'SDK antic (genai.configure), el nou SDK usa un objecte Client
# que s'instancia amb la clau i es reutilitza per a totes les crides.
client = genai.Client(api_key=API_KEY)


# ══════════════════════════════════════════════════════════════════════════════
# SECCIÓ 1: CONSULTA AL ENTRENADOR (CHAT AMB BASE DE CONEIXEMENT)
# ══════════════════════════════════════════════════════════════════════════════
# Chat de text amb un model Gemini que té com a context les transcripcions
# dels 14 vídeos de golf de YouTube.
#
# Flux:
#   1. SYSTEM_INSTRUCTION + KNOWLEDGE → instrucció de sistema completa
#   2. L'usuari escriu una pregunta
#   3. client.models.generate_content() envia la pregunta + instrucció al model
#   4. La resposta es mostra i es guarda a session_state per a la conversa

if seccio == "💬 Consulta al entrenador":

    st.title("💬 Consulta al Entrenador de Golf")
    st.caption("Fes preguntes sobre tècnica, swing, postura, grip... Basat en els vídeos del canal.")
    st.caption("També pots consultar sobre les regles del Pitch&Putt.")

    # Instrucció de sistema: rol de l'entrenador + transcripcions dels vídeos
    full_system = (
        SYSTEM_INSTRUCTION
        + "\n\n---\nCONTINGUT DELS VIDEOS:\n"
        + KNOWLEDGE
        + "\n\n---\n"
        + "LANGUAGE RULE (MANDATORY): Always respond in the EXACT same language "
        + "as the user's question. If the question is in English, respond in English. "
        + "If in Spanish/Castilian, respond in Spanish. If in Catalan, respond in Catalan. "
        + "Never switch language. This rule overrides everything else."
    )

    # Configuració del model: instrucció de sistema passada com a GenerateContentConfig
    # (nou SDK: la configuració va separada del nom del model)
    chat_config = types.GenerateContentConfig(
        system_instruction=full_system,
    )

    # Historial de la conversa guardat a session_state.
    # Streamlit relança l'script en cada interacció; session_state persiteix entre rerenderitzacions.
    # Format: [{"role": "user"/"assistant", "content": "..."}, ...]
    if "gem_messages" not in st.session_state:
        st.session_state.gem_messages = []

    # Mostrem tots els missatges anteriors de la conversa
    for message in st.session_state.gem_messages:
        with st.chat_message(message["role"]):
            st.markdown(message["content"])

    # camp de text fix a la part inferior; := assigna i comprova en una línia
    if prompt := st.chat_input("Pregunta al teu entrenador de golf..."):

        st.session_state.gem_messages.append({"role": "user", "content": prompt})
        with st.chat_message("user"):
            st.markdown(prompt)

        with st.chat_message("assistant"):
            # Placeholder animat mentre la IA processa la resposta
            thinking_placeholder = st.empty()
            thinking_placeholder.markdown(
                """<span style="color:#6b7280;font-size:1.1em;">
                ⛳ <span class="dot-flashing">Pensant<span>.</span><span>.</span><span>.</span></span>
                </span>
                <style>
                .dot-flashing span {
                    animation: blink 1.2s infinite;
                    animation-fill-mode: both;
                }
                .dot-flashing span:nth-child(2) { animation-delay: 0.2s; }
                .dot-flashing span:nth-child(3) { animation-delay: 0.4s; }
                @keyframes blink {
                    0%,80%,100% { opacity: 0; }
                    40%          { opacity: 1; }
                }
                </style>""",
                unsafe_allow_html=True,
            )
            try:
                # Nova crida al model:  client.models.generate_content()
                # - model: nom del model Gemini
                # - contents: el missatge de l'usuari
                # - config: inclou la instrucció de sistema amb el coneixement dels vídeos
                # ── DETECCIÓ D'IDIOMA ─────────────────────────────────────────────
                # Detectem l'idioma del prompt per indicar-lo explícitament
                # al model, evitant que infereixi malament l'idioma.
                _LANG_NAMES = {
                    "ca": "Catalan", "es": "Spanish", "en": "English",
                    "fr": "French",  "de": "German",  "it": "Italian",
                    "pt": "Portuguese", "nl": "Dutch",
                }
                _detected = "the same language as the question"
                if _LANGDETECT_OK and len(prompt) >= 10:
                    try:
                        _code = _detect_lang(prompt)
                        _detected = _LANG_NAMES.get(_code, _code)
                    except Exception:
                        pass

                response = client.models.generate_content(
                    model="gemini-2.5-flash",
                    contents=(
                        f"[SYSTEM RULE - HIGHEST PRIORITY: You MUST reply in "
                        f"{_detected}. Do NOT change the language under any "
                        f"circumstances. The user's question is: \"{prompt}\"]\n\n{prompt}"
                    ),
                    config=chat_config,
                )
                answer = response.text
                thinking_placeholder.empty()   # Elimina el "Pensant..."
                st.markdown(answer)
                st.session_state.gem_messages.append({"role": "assistant", "content": answer})
                # Tracking GA4: registra cada consulta al entrenador
                _ga4_send("coach_query", {"language": _detected, "section": "chat"})

            except Exception as e:
                err = str(e)
                thinking_placeholder.empty()   # Elimina el "Pensant..." fins i tot en cas d'error
                # Error 429: quota de l'API esgotada (límit de peticions per minut/dia)
                if "429" in err or "quota" in err.lower():
                    st.error("⚠️ Quota esgotada. Espera uns minuts i torna-ho a intentar.")
                else:
                    st.error(f"❌ Error: {err}")

    # Botó per buidar l'historial (només apareix si hi ha missatges)
    if st.session_state.gem_messages:
        if st.button("🗑️ Netejar conversa"):
            st.session_state.gem_messages = []
            st.rerun()


# ══════════════════════════════════════════════════════════════════════════════
# SECCIÓ 2: ANÀLISI DE VÍDEO DE SWING
# ══════════════════════════════════════════════════════════════════════════════
# L'usuari puja un vídeo del swing; Gemini l'analitza visualment.
#
# Flux (4 passos):
#   1. Guardar el vídeo en un fitxer temporal al disc local
#   2. Pujar-lo a la Files API de Google (emmagatzematge temporal al núvol)
#   3. Esperar que Google acabi de processar el vídeo (estat "PROCESSING")
#   4. Generar l'anàlisi combinant el prompt de text + el vídeo processat
#   + Neteja: eliminar fitxers temporals (local i remot)

elif seccio == "🎥 Anàlisi de vídeo":

    st.title("🎥 Anàlisi de Swing per Vídeo")
    st.caption("Puja un vídeo del teu swing i l'IA analitzarà el teu moviment.")

    # Configuració del model per a anàlisi visual (expert en biomecànica de golf)
    video_config = types.GenerateContentConfig(
        system_instruction=(
            "Ets un expert en biomecànica de golf. Analitza el vídeo fotograma a fotograma. "
            "Fixa't en el grip, l'alineació, el backswing i el follow-through. "
            "Dóna consells concrets per corregir errors visuals."
        ),
    )

    # Widget de pujada de fitxers. Accepta MP4, MOV i AVI.
    uploaded_file = st.file_uploader(
        "📁 Puja el teu swing (MP4, MOV, AVI)",
        type=["mp4", "mov", "avi"],
    )

    if uploaded_file:
        # Previsualització del vídeo directament a la pàgina
        st.video(uploaded_file)

        # Prompt editable: l'usuari pot personalitzar la pregunta al model
        prompt_video = st.text_area(
            "Instruccions addicionals per a l'entrenador (opcional):",
            value="Analitza aquest swing de golf. Quins són els 3 errors principals i com puc corregir-los?",
            height=80,
        )

        if st.button("🔍 Analitzar Swing"):
            with st.spinner("L'IA està estudiant el teu moviment... (pot trigar uns segons)"):
                try:
                    # PAS 1: Guardar el vídeo en un fitxer temporal al disc local.
                    # delete=False: el fitxer no s'elimina automàticament en tancar-lo
                    # (el necessitem per pujar-lo a l'API de Google)
                    with tempfile.NamedTemporaryFile(delete=False, suffix=".mp4") as tmp:
                        tmp.write(uploaded_file.read())
                        video_path = tmp.name

                    # PAS 2: Pujar el vídeo a la Files API de Google Gemini.
                    # client.files.upload() retorna una referència al fitxer al núvol
                    video_file = client.files.upload(file=video_path)

                    # PAS 3: Esperar que Google acabi de processar el vídeo.
                    # El servidor analitza el vídeo de forma asíncrona;
                    # comprovem l'estat cada 2 segons fins que deixi de ser "PROCESSING"
                    while video_file.state.name == "PROCESSING":
                        time.sleep(2)
                        video_file = client.files.get(name=video_file.name)

                    # PAS 4: Generar l'anàlisi multimodal (text + vídeo).
                    # Passem una llista amb el prompt i la referència al vídeo processat;
                    # Gemini analitza ambdós conjuntament
                    response = client.models.generate_content(
                        model="gemini-2.5-flash",
                        contents=[prompt_video, video_file],
                        config=video_config,
                    )

                    st.markdown("### 📊 Informe de l'Entrenador")
                    st.markdown(response.text)

                    # NETEJA: Eliminar el vídeo del servidor de Google.
                    # (s'elimina sol als 48h, però és millor fer-ho immediatament)
                    try:
                        client.files.delete(name=video_file.name)
                    except Exception:
                        pass

                    # NETEJA: Eliminar el fitxer temporal del disc local
                    try:
                        os.remove(video_path)
                    except Exception:
                        pass

                except Exception as e:
                    err = str(e)
                    if "429" in err or "quota" in err.lower():
                        st.error("⚠️ Quota esgotada. Espera uns minuts i torna-ho a intentar.")
                    else:
                        st.error(f"❌ Error en l'anàlisi: {err}")
    else:
        st.info("👆 Puja un vídeo per començar l'anàlisi.")
