import json
import os

# Carregar transcripcions dels vídeos de YouTube
d = json.load(open('transcripts.json', encoding='utf-8'))

# Carregar normativa de Pitch&Putt (des de rules.txt, generat per extract_rules.py)
rules_text = ""
rules_file = os.path.join(os.path.dirname(__file__), 'rules.txt')
if os.path.exists(rules_file):
    with open(rules_file, 'r', encoding='utf-8') as f:
        rules_text = f.read().strip()
    print(f'Normativa carregada: {len(rules_text):,} caràcters')
else:
    print('⚠️  rules.txt no trobat. Executa primer: python extract_rules.py')

videos = {
    'Nb4KsqpWv24': 'Video 1',
    '1pP_435kO1s': 'Video 2',
    'pNcnpTgGMmY': 'Video 3',
    'u4mvIC71Ny8': 'Video 4',
    'ED63gIMfbf8': 'Video 5',
    'Joc50kdFE2c': 'Video 6',
    '2PFCogJsaYE': 'Video 7',
    'KhThqqywr7Q': 'Video 8',
    'IWl3qndvGhM': 'Video 9',
    'XoUQnqQGayM': 'Video 10',
    'Ifd5MkFS4sU': 'Video 11',
    'Oe8CcAhtwvc': 'Video 12',
    'IbW8IQjPvac': 'Video 13',
    'LEYR2BEDHFg': 'Video 14',
}

parts = []
for vid_id, label in videos.items():
    if d[vid_id]['status'] == 'ok':
        url = f'https://youtu.be/{vid_id}'
        # Clean text to avoid issues with string delimiters
        text = d[vid_id]['text'].replace('"""', "'''")
        parts.append(f'=== {label} ({url}) ===\n{text}')

# Afegim la normativa de Pitch&Putt com a secció separada del coneixement
if rules_text:
    parts.append(f'=== NORMATIVA PITCH&PUTT ===\n{rules_text}')

knowledge = '\n\n'.join(parts)

SYSTEM_INSTRUCTION = (
    "Ets un entrenador de golf especialitzat en Pitch&Putt. Respons preguntes sobre tecnica de golf "
    "(cops, swing, postura, grip) i sobre la normativa oficial de Pitch&Putt. "
    "Tens dues fonts de coneixement principals: "
    "1) Les transcripcions dels videos de YouTube sobre tecnica de golf. "
    "2) El document oficial de normativa de Pitch&Putt. "
    "Quan responguis sobre tecnica, fes referencia als videos. "
    "Quan responguis sobre normes i regles, fes referencia al document de normativa. "
    "Si la pregunta no esta coberta per cap de les fonts, pots usar el teu coneixement general "
    "de golf pero indica-ho clarament."
)

app_code = '''import streamlit as st
import google.generativeai as genai
import os

# ---------- CONEIXEMENT DELS VIDEOS DE YOUTUBE (auto-generat) ----------
KNOWLEDGE = """ + repr(knowledge) + """

SYSTEM_INSTRUCTION = """ + repr(SYSTEM_INSTRUCTION) + """

# -----------------------------------------------------------------------

st.set_page_config(page_title="Golf Coach Gem", page_icon="⛳")

st.markdown("""
    <style>
    .main { background-color: #f0fdf4; }
    .stButton>button { background-color: #166534; color: white; }
    </style>
    """, unsafe_allow_html=True)

st.title("⛳ Entrenador de Golf (Gem)")
st.subheader("Basat en els teus videos de YouTube")

# Llegir API Key des del fitxer si existeix
default_key = ""
key_file = os.path.join(os.path.dirname(__file__), "API_KEY.txt")
if os.path.exists(key_file):
    with open(key_file, "r") as f:
        default_key = f.read().strip()

API_KEY = st.sidebar.text_input("API Key de Gemini", value=default_key, type="password")

if API_KEY:
    genai.configure(api_key=API_KEY)

    full_system = SYSTEM_INSTRUCTION + "\\n\\n---\\nCONTINGUT DELS VIDEOS:\\n" + KNOWLEDGE

    model = genai.GenerativeModel(
        model_name="gemini-2.5-flash",
        system_instruction=full_system
    )

    if "gem_messages" not in st.session_state:
        st.session_state.gem_messages = []

    for message in st.session_state.gem_messages:
        with st.chat_message(message["role"]):
            st.markdown(message["content"])

    if prompt := st.chat_input("Pregunta al teu entrenador de golf..."):
        st.session_state.gem_messages.append({"role": "user", "content": prompt})
        with st.chat_message("user"):
            st.markdown(prompt)

        with st.chat_message("assistant"):
            try:
                response = model.generate_content(prompt)
                answer = response.text
                st.markdown(answer)
                st.session_state.gem_messages.append({"role": "assistant", "content": answer})
            except Exception as e:
                err = str(e)
                if "429" in err or "quota" in err.lower():
                    st.error("⚠️ Quota esgotada. Espera uns minuts i torna-ho a intentar.")
                else:
                    st.error(f"❌ Error: {err}")

    if st.session_state.gem_messages:
        if st.button("🗑️ Netejar conversa"):
            st.session_state.gem_messages = []
            st.rerun()

else:
    st.warning("Introdueix la teva API Key a la barra lateral per comenar.")
'''

# Use format to safely embed the knowledge and system instruction
final_code = f'''import streamlit as st
import google.generativeai as genai
import os

# ---------- CONEIXEMENT DELS VIDEOS DE YOUTUBE (auto-generat) ----------
KNOWLEDGE = {repr(knowledge)}

SYSTEM_INSTRUCTION = {repr(SYSTEM_INSTRUCTION)}

# -----------------------------------------------------------------------

st.set_page_config(page_title="Golf Coach Gem", page_icon="\u26f3")

st.markdown("""
    <style>
    .main {{ background-color: #f0fdf4; }}
    .stButton>button {{ background-color: #166534; color: white; }}
    </style>
    """, unsafe_allow_html=True)

st.title("\u26f3 Entrenador de Golf (Gem)")
st.subheader("Basat en els teus videos de YouTube")

default_key = ""
key_file = os.path.join(os.path.dirname(__file__), "API_KEY.txt")
if os.path.exists(key_file):
    with open(key_file, "r") as f:
        default_key = f.read().strip()

API_KEY = st.sidebar.text_input("API Key de Gemini", value=default_key, type="password")

if API_KEY:
    genai.configure(api_key=API_KEY)

    full_system = SYSTEM_INSTRUCTION + "\\n\\n---\\nCONTINGUT DELS VIDEOS:\\n" + KNOWLEDGE

    model = genai.GenerativeModel(
        model_name="gemini-2.5-flash",
        system_instruction=full_system
    )

    if "gem_messages" not in st.session_state:
        st.session_state.gem_messages = []

    for message in st.session_state.gem_messages:
        with st.chat_message(message["role"]):
            st.markdown(message["content"])

    if prompt := st.chat_input("Pregunta al teu entrenador de golf..."):
        st.session_state.gem_messages.append({{"role": "user", "content": prompt}})
        with st.chat_message("user"):
            st.markdown(prompt)

        with st.chat_message("assistant"):
            try:
                response = model.generate_content(prompt)
                answer = response.text
                st.markdown(answer)
                st.session_state.gem_messages.append({{"role": "assistant", "content": answer}})
            except Exception as e:
                err = str(e)
                if "429" in err or "quota" in err.lower():
                    st.error("\u26a0\ufe0f Quota esgotada. Espera uns minuts i torna-ho a intentar.")
                else:
                    st.error(f"\u274c Error: {{err}}")

    if st.session_state.gem_messages:
        if st.button("\U0001f5d1\ufe0f Netejar conversa"):
            st.session_state.gem_messages = []
            st.rerun()

else:
    st.warning("Introdueix la teva API Key a la barra lateral per comenar.")
'''

with open('CoachGolfGem.py', 'w', encoding='utf-8') as f:
    f.write(final_code)

print(f'CoachGolfGem.py generat correctament! ({len(final_code):,} bytes)')
