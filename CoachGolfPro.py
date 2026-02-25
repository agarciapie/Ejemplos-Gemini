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
import re                            # Expressions regulars per extreure text de CoachGolfGem.py
import ast                           # Avaluació segura de literals Python


# ── CÀRREGA DEL CONEIXEMENT (KNOWLEDGE) ───────────────────────────────────────
# CoachGolfGem.py conté les transcripcions dels 14 vídeos de YouTube i la
# instrucció del sistema (SYSTEM_INSTRUCTION) com a constants Python hardcodejades.
#
# IMPORTANT: No importem CoachGolfGem.py com a mòdul perquè conté crides a
# Streamlit que causarien un error si s'executessin fora de context.
# En canvi, llegim el fitxer com a text pla i extraiem les constants amb
# regex + ast.literal_eval (segur, no executa codi arbitrari).

def _load_gem_data():
    """
    Llegeix KNOWLEDGE i SYSTEM_INSTRUCTION des de CoachGolfGem.py com a text pla.

    Returns:
        tuple: (knowledge: str, system_instruction: str)
               Retorna strings buits si el fitxer no existeix o hi ha error.
    """
    gem_path = os.path.join(os.path.dirname(__file__), "CoachGolfGem.py")
    knowledge = ""
    system_instruction = ""
    try:
        with open(gem_path, "r", encoding="utf-8") as f:
            source = f.read()

        # Cerca el bloc:  KNOWLEDGE = '...' (pot ser multilínia)
        m = re.search(r"^KNOWLEDGE\s*=\s*(.+?)(?=^\w|\Z)", source,
                      re.MULTILINE | re.DOTALL)
        if m:
            knowledge = ast.literal_eval(m.group(1).strip())

        # Cerca SYSTEM_INSTRUCTION = '...'
        m2 = re.search(r"^SYSTEM_INSTRUCTION\s*=\s*(.+?)(?=^\w|\Z)", source,
                       re.MULTILINE | re.DOTALL)
        if m2:
            system_instruction = ast.literal_eval(m2.group(1).strip())

    except Exception:
        pass  # Continua amb strings buits si el fitxer no existeix o hi ha error

    return knowledge, system_instruction

# S'executa una sola vegada en arrencar l'app
KNOWLEDGE, SYSTEM_INSTRUCTION = _load_gem_data()


# ── CONFIGURACIÓ DE LA PÀGINA ─────────────────────────────────────────────────
# Aquesta crida SEMPRE ha de ser la primera funció de Streamlit que s'executa.

st.set_page_config(
    page_title="Golf Coach Pro",
    page_icon="⛳",
    layout="wide",
)

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



# ── COMPTADOR DE VISITES ──────────────────────────────────────────────────────
# Imatge SVG de hits.seeyoufarm.com incrustada directament via st.markdown.
# No requereix JS ni iframes. El navegador carrega la imatge quan obres la pàgina;
# les rerenderitzacions de Streamlit no la recarreguen (React no modifica nodes
# del DOM si l'atribut src no canvia), de manera que el comptador
# s'incrementa una vegada per cada vegada que s'obre o recarrega la pàgina.
_BADGE_URL = (
    "https://hits.seeyoufarm.com/api/count/incr/badge.svg"
    "?url=coachgolfpro-streamlit"
    "&count_bg=%2322c55e&title_bg=%2314532d"
    "&title=Visites&edge_flat=true"
)


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
    # Comptador de visites: imatge SVG incrustada directament al sidebar
    st.markdown("---")
    st.markdown(
        f'<img src="{_BADGE_URL}" alt="Visites" style="height:22px; border-radius:3px;">',
        unsafe_allow_html=True,
    )


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
            try:
                # Nova crida al model:  client.models.generate_content()
                # - model: nom del model Gemini
                # - contents: el missatge de l'usuari
                # - config: inclou la instrucció de sistema amb el coneixement dels vídeos
                response = client.models.generate_content(
                    model="gemini-2.5-flash",
                    contents=prompt,
                    config=chat_config,
                )
                answer = response.text
                st.markdown(answer)
                st.session_state.gem_messages.append({"role": "assistant", "content": answer})

            except Exception as e:
                err = str(e)
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
