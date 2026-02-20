"""
CoachGolfPro.py
===============
Aplicació Streamlit que actua com a entrenador de golf intel·ligent, combinant:
  1. Chat amb coneixement dels vídeos de YouTube (de CoachGolfGem.py)
  2. Anàlisi visual de swing pujant un vídeo (de CoachGolfVideo.py)

Requereix:
  - Python 3.9+
  - Paquets: streamlit, google-generativeai
  - Fitxer API_KEY.txt amb la clau de l'API de Gemini (o st.secrets["GEMINI_API_KEY"])
  - CoachGolfGem.py al mateix directori (conté el coneixement dels vídeos)

Execució:
  streamlit run CoachGolfPro.py
"""

# ── IMPORTACIONS ───────────────────────────────────────────────────────────────
# Llibreries estàndard de Python i de tercers necessàries per l'aplicació.

import streamlit as st          # Framework web per crear la interfície d'usuari
import google.generativeai as genai  # SDK de Google per accedir als models Gemini
import os                       # Operacions amb el sistema de fitxers (rutes, existència, etc.)
import time                     # Pausar l'execució mentre el servidor processa el vídeo
import tempfile                 # Crear fitxers temporals per al vídeo pujat
import re                       # Expressions regulars per extreure text de CoachGolfGem.py
import ast                      # Avaluació segura de literals Python (sense executar codi)


# ── CÀRREGA DEL CONEIXEMENT (KNOWLEDGE) ───────────────────────────────────────
# CoachGolfGem.py conté les transcripcions dels 14 vídeos de YouTube i la
# instrucció del sistema (SYSTEM_INSTRUCTION) com a constants Python hardcodejades.
#
# IMPORTANT: No importem CoachGolfGem.py com a mòdul perquè conté crides a
# Streamlit (st.set_page_config, st.title...) que causarien un error si
# s'executessin fora de context. En canvi, llegim el fitxer com a text pla
# i extraiem les constants amb expressions regulars + ast.literal_eval,
# que interpreta el literal Python de forma segura sense executar res més.

def _load_gem_data():
    """
    Llegeix KNOWLEDGE i SYSTEM_INSTRUCTION des de CoachGolfGem.py com a text.

    Returns:
        tuple: (knowledge: str, system_instruction: str)
               Retorna strings buits si el fitxer no existeix o hi ha error.
    """
    gem_path = os.path.join(os.path.dirname(__file__), "CoachGolfGem.py")
    knowledge = ""
    system_instruction = ""
    try:
        # Llegim tot el codi font de CoachGolfGem.py com a text pla
        with open(gem_path, "r", encoding="utf-8") as f:
            source = f.read()

        # Expressió regular que cerca el bloc:  KNOWLEDGE = '...' o KNOWLEDGE = "..."
        # re.MULTILINE: ^ i $ coincideixen amb inicis/finals de línia
        # re.DOTALL: el punt (.) coincideix també amb salts de línia
        # (?=^\w|\Z): atura la cerca quan troba una nova variable o el final del fitxer
        m = re.search(r"^KNOWLEDGE\s*=\s*(.+?)(?=^\w|\Z)", source,
                      re.MULTILINE | re.DOTALL)
        if m:
            # ast.literal_eval converteix el text del literal Python en un objecte Python
            # sense risc d'executar codi arbitrari (a diferència de eval())
            knowledge = ast.literal_eval(m.group(1).strip())

        # Cerca identical per a SYSTEM_INSTRUCTION
        m2 = re.search(r"^SYSTEM_INSTRUCTION\s*=\s*(.+?)(?=^\w|\Z)", source,
                       re.MULTILINE | re.DOTALL)
        if m2:
            system_instruction = ast.literal_eval(m2.group(1).strip())

    except Exception:
        # Si el fitxer no existeix o hi ha un error d'anàlisi,
        # continuem amb strings buits (l'app funcionarà sense base de coneixement)
        pass

    return knowledge, system_instruction

# S'executa una sola vegada en arrencar l'app (no en cada interacció de l'usuari)
KNOWLEDGE, SYSTEM_INSTRUCTION = _load_gem_data()


# ── CONFIGURACIÓ DE LA PÀGINA ─────────────────────────────────────────────────
# Aquesta crida SEMPRE ha de ser la primera funció de Streamlit que s'executa.
# Defineix el títol de la pestanya del navegador, la icona i el layout.

st.set_page_config(
    page_title="Golf Coach Pro",   # Títol que apareix a la pestanya del navegador
    page_icon="⛳",                 # Favicon de la pestanya
    layout="wide",                 # Aprofita tot l'ample de la pantalla
)

# CSS personalitzat injectat directament al HTML de la pàgina.
# - .main: fons verd molt clar per a la zona de contingut principal
# - [data-testid="stSidebar"]: fons verd fosc per al menú lateral
# - .stButton>button: estil dels botons (verd fosc, text blanc, cantonades arrodonides)
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
# La clau s'obté en ordre de prioritat:
#   1. st.secrets["GEMINI_API_KEY"]: fitxer .streamlit/secrets.toml (ideal per a
#      desplegaments a Streamlit Cloud o entorns de servidor segurs)
#   2. API_KEY.txt: fitxer de text al mateix directori (ús local/desenvolupament)
#
# En cap cas es mostra un camp d'entrada a la interfície, de manera que
# els usuaris finals mai veuen ni poden modificar la clau.

API_KEY = ""

# Intent 1: llegir des de st.secrets (Streamlit Cloud / secrets.toml)
try:
    API_KEY = st.secrets["GEMINI_API_KEY"]
except Exception:
    # st.secrets llança KeyError si la clau no existeix, o FileNotFoundError
    # si el fitxer secrets.toml no existeix. Ignoriem i provem el pla B.
    pass

# Intent 2 (pla B): llegir des de API_KEY.txt si st.secrets no ha funcionat
if not API_KEY:
    key_file = os.path.join(os.path.dirname(__file__), "API_KEY.txt")
    if os.path.exists(key_file):
        with open(key_file, "r") as f:
            API_KEY = f.read().strip()  # .strip() elimina espais i salts de línia


# ── MENÚ LATERAL (NAVEGACIÓ) ──────────────────────────────────────────────────
# st.sidebar és el panell lateral de Streamlit.
# st.radio crea un selector de botó d'opció; el valor seleccionat es guarda
# a la variable `seccio` i condiciona quin bloc de codi s'executa més avall.

with st.sidebar:
    st.markdown("## ⛳ Golf Coach Pro")
    st.markdown("---")

    # L'usuari tria entre les dues funcionalitats principals de l'app
    seccio = st.radio(
        "Selecciona una opció:",
        ["💬 Consulta al entrenador", "🎥 Anàlisi de vídeo"],
        index=0,   # Per defecte, la primera opció (chat amb l'entrenador)
    )

    st.markdown("---")
    # Peu del menú lateral amb informació sobre la font del coneixement
    st.markdown(
        "<small>Entrenador basat en vídeos de YouTube + anàlisi d'IA de Gemini</small>",
        unsafe_allow_html=True,
    )


# ── VALIDACIÓ DE LA API KEY ───────────────────────────────────────────────────
# Si no s'ha pogut obtenir la clau per cap dels mètodes anteriors,
# mostrem un missatge d'error i aturem l'execució de l'app amb st.stop().
# Res del codi posterior s'executarà.

if not API_KEY:
    st.error("❌ No s'ha trobat la API Key. Contacta l'administrador de l'aplicació.")
    st.stop()   # Atura l'execució: l'usuari veu l'error però l'app no peta

# Configurem el SDK de Google Generative AI amb la clau carregada.
# Totes les crides posteriors a genai.GenerativeModel() usaran aquesta clau.
genai.configure(api_key=API_KEY)


# ══════════════════════════════════════════════════════════════════════════════
# SECCIÓ 1: CONSULTA AL ENTRENADOR (CHAT AMB BASE DE CONEIXEMENT)
# ══════════════════════════════════════════════════════════════════════════════
# Aquesta secció implementa un xat de text amb un model Gemini que té com a
# context les transcripcions dels 14 vídeos de golf de YouTube.
#
# Flux:
#   1. Es combinen SYSTEM_INSTRUCTION + KNOWLEDGE en un únic text de sistema
#   2. Es crea un model GenerativeModel amb aquest context
#   3. Streamlit mostra l'historial de la conversa des de session_state
#   4. L'usuari escriu una pregunta → es genera una resposta → es mostra i guarda

if seccio == "💬 Consulta al entrenador":

    st.title("💬 Consulta al Entrenador de Golf")
    st.caption("Fes preguntes sobre tècnica, swing, postura, grip... Basat en els vídeos del canal.")

    # Construïm la instrucció completa del sistema:
    # - SYSTEM_INSTRUCTION: defineix el rol i la personalitat de l'entrenador
    # - KNOWLEDGE: les transcripcions dels 14 vídeos (base de coneixement)
    # El model Gemini rebrà tot això com a "system prompt" invisible per a l'usuari
    full_system = (
        SYSTEM_INSTRUCTION
        + "\n\n---\nCONTINGUT DELS VIDEOS:\n"
        + KNOWLEDGE
    )

    # Creem el model de chat amb la instrucció de sistema completa.
    # gemini-2.5-flash és el model recomanat: ràpid i amb gran finestra de context
    # (necessari per encabir les transcripcions de 14 vídeos + conversa)
    model_chat = genai.GenerativeModel(
        model_name="gemini-2.5-flash",
        system_instruction=full_system,
    )

    # st.session_state és el mecanisme de Streamlit per persistir dades
    # entre rerenderitzacions de la pàgina (cada interacció relança l'script).
    # Guardem l'historial de missatges com una llista de dicts:
    #   [{"role": "user", "content": "..."}, {"role": "assistant", "content": "..."}, ...]
    if "gem_messages" not in st.session_state:
        st.session_state.gem_messages = []

    # Mostrem tots els missatges anteriors de la conversa
    for message in st.session_state.gem_messages:
        with st.chat_message(message["role"]):   # "user" → avatar d'usuari, "assistant" → icona de bot
            st.markdown(message["content"])

    # st.chat_input mostra un camp de text fix a la part inferior de la pàgina.
    # L'operador := (walrus) assigna el valor i comprova si és no buit en una sola línia.
    if prompt := st.chat_input("Pregunta al teu entrenador de golf..."):

        # Guardem la pregunta de l'usuari a l'historial i la mostrem
        st.session_state.gem_messages.append({"role": "user", "content": prompt})
        with st.chat_message("user"):
            st.markdown(prompt)

        # Generem la resposta del model i la mostrem
        with st.chat_message("assistant"):
            try:
                # Enviem la pregunta al model (el system_instruction ja conté el context)
                response = model_chat.generate_content(prompt)
                answer = response.text

                st.markdown(answer)

                # Guardem la resposta a l'historial per mostrar-la en futures rerenderitzacions
                st.session_state.gem_messages.append({"role": "assistant", "content": answer})

            except Exception as e:
                err = str(e)
                # Gestió d'errors específics:
                # - Error 429: quota de l'API esgotada (límit de peticions per minut/dia)
                # - Altres errors: missatge genèric amb el detall de l'error
                if "429" in err or "quota" in err.lower():
                    st.error("⚠️ Quota esgotada. Espera uns minuts i torna-ho a intentar.")
                else:
                    st.error(f"❌ Error: {err}")

    # Botó per esborrar l'historial de la conversa.
    # Només apareix si hi ha missatges (evitem mostrar el botó quan el chat és buit).
    # st.rerun() força una rerenderització immediata per actualitzar la pantalla.
    if st.session_state.gem_messages:
        if st.button("🗑️ Netejar conversa"):
            st.session_state.gem_messages = []
            st.rerun()


# ══════════════════════════════════════════════════════════════════════════════
# SECCIÓ 2: ANÀLISI DE VÍDEO DE SWING
# ══════════════════════════════════════════════════════════════════════════════
# Aquesta secció permet pujar un vídeo del swing de golf i obtenir una anàlisi
# detallada de la tècnica usant les capacitats multimodals de Gemini.
#
# Flux:
#   1. L'usuari puja un fitxer de vídeo (MP4, MOV, AVI)
#   2. El vídeo es guarda en un fitxer temporal al disc local
#   3. Es puja a la Files API de Google Gemini (emmagatzematge temporal al núvol)
#   4. S'espera que el servidor de Google processi el vídeo (estat "PROCESSING")
#   5. Es genera l'anàlisi combinant el prompt de text + el vídeo processat
#   6. Es mostren els resultats i s'eliminen els fitxers temporals

elif seccio == "🎥 Anàlisi de vídeo":

    st.title("🎥 Anàlisi de Swing per Vídeo")
    st.caption("Puja un vídeo del teu swing i l'IA analitzarà el teu moviment.")

    # Model configurat específicament per a anàlisi visual de golf.
    # La instrucció de sistema defineix el rol d'expert en biomecànica
    # i indica quins aspectes del swing cal analitzar.
    model_video = genai.GenerativeModel(
        model_name="gemini-2.5-flash",
        system_instruction=(
            "Ets un expert en biomecànica de golf. Analitza el vídeo fotograma a fotograma. "
            "Fixa't en el grip, l'alineació, el backswing i el follow-through. "
            "Dóna consells concrets per corregir errors visuals."
        ),
    )

    # Widget de pujada de fitxers. Accepta formats de vídeo habituals.
    # Quan l'usuari selecciona un fitxer, `uploaded_file` conté l'objecte UploadedFile;
    # si no n'ha seleccionat cap, és None.
    uploaded_file = st.file_uploader(
        "📁 Puja el teu swing (MP4, MOV, AVI)",
        type=["mp4", "mov", "avi"],
    )

    if uploaded_file:
        # Previsualització del vídeo directament a la pàgina web
        st.video(uploaded_file)

        # Camp de text editable amb el prompt predeterminat.
        # L'usuari pot personalitzar la pregunta al model abans d'analitzar.
        prompt_video = st.text_area(
            "Instruccions addicionals per a l'entrenador (opcional):",
            value="Analitza aquest swing de golf. Quins són els 3 errors principals i com puc corregir-los?",
            height=80,
        )

        if st.button("🔍 Analitzar Swing"):
            # st.spinner mostra un indicador de càrrega mentre processa
            with st.spinner("L'IA està estudiant el teu moviment... (pot trigar uns segons)"):
                try:
                    # PAS 1: Guardar el vídeo en un fitxer temporal al disc local.
                    # tempfile.NamedTemporaryFile crea un fitxer temporal amb un nom únic.
                    # delete=False evita que s'elimini automàticament en tancar-lo
                    # (el necessitem per pujar-lo a l'API de Google).
                    with tempfile.NamedTemporaryFile(delete=False, suffix=".mp4") as tmp:
                        tmp.write(uploaded_file.read())  # Escrivim el contingut del fitxer pujat
                        video_path = tmp.name            # Guardem la ruta per usar-la després

                    # PAS 2: Pujar el vídeo a la Files API de Google Gemini.
                    # Google processa el vídeo als seus servidors i retorna una referència
                    # (golf_video) que podrem passar directament al model.
                    golf_video = genai.upload_file(path=video_path)

                    # PAS 3: Esperar que Google acabi de processar el vídeo.
                    # El processament pot trigar uns segons. Comprovem l'estat cada 2 segons.
                    # Quan l'estat deixa de ser "PROCESSING", el vídeo està llest.
                    while golf_video.state.name == "PROCESSING":
                        time.sleep(2)
                        golf_video = genai.get_file(golf_video.name)  # Actualitzem l'estat

                    # PAS 4: Generar l'anàlisi del swing.
                    # Passem una llista amb el prompt de text I el vídeo processat.
                    # Gemini analitza els dos junts gràcies a les seves capacitats multimodals.
                    response = model_video.generate_content([prompt_video, golf_video])

                    # Mostrem el resultat de l'anàlisi formatat com a Markdown
                    st.markdown("### 📊 Informe de l'Entrenador")
                    st.markdown(response.text)

                    # NETEJA: Eliminar el vídeo del servidor de Google.
                    # Els fitxers pujats a la Files API s'eliminen automàticament al cap
                    # de 48h, però és bona pràctica eliminar-los immediatament per seguretat.
                    try:
                        genai.delete_file(golf_video.name)
                    except Exception:
                        pass  # Si falla, no és crític (s'eliminarà sol)

                    # NETEJA: Eliminar el fitxer temporal del disc local.
                    try:
                        os.remove(video_path)
                    except Exception:
                        pass  # Si falla (p.ex. fitxer en ús), no aturem l'app

                except Exception as e:
                    err = str(e)
                    # Gestió d'errors:
                    # - Error 429: quota de l'API esgotada
                    # - Altres errors: missatge genèric (pot incloure errors de xarxa,
                    #   format de vídeo no suportat, etc.)
                    if "429" in err or "quota" in err.lower():
                        st.error("⚠️ Quota esgotada. Espera uns minuts i torna-ho a intentar.")
                    else:
                        st.error(f"❌ Error en l'anàlisi: {err}")

    else:
        # Missatge informatiu mentre no hi ha cap vídeo pujat
        st.info("👆 Puja un vídeo per començar l'anàlisi.")
