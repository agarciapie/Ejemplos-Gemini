import streamlit as st
import google.generativeai as genai
import os

# Configuració de la pàgina
st.set_page_config(page_title="Golf Coach Gem", page_icon="⛳")

# Estils personalitzats (Look & Feel de Golf)
st.markdown("""
    <style>
    .main { background-color: #f0fdf4; }
    .stButton>button { background-color: #166534; color: white; }
    </style>
    """, unsafe_allow_html=True)

st.title("⛳ Entrenador de Golf Pro")
st.subheader("Millora el teu swing amb IA")

# Llegir API Key des del fitxer API_KEY.txt si existeix
default_key = ""
key_file = os.path.join(os.path.dirname(__file__), "API_KEY.txt")
if os.path.exists(key_file):
    with open(key_file, "r") as f:
        default_key = f.read().strip()

API_KEY = st.sidebar.text_input(
    "Introdueix la teva API Key de Gemini",
    value=default_key,
    type="password"
)

SYSTEM_INSTRUCTION = (
    "Ets un entrenador de golf professional de l'entorn PGA. "
    "Ofereixes consells tècnics precisos sobre el swing, "
    "posició (stance), grip i psicologia del joc. "
    "Sigues motivador però molt tècnic i analític."
)

if API_KEY:
    genai.configure(api_key=API_KEY)

    model = genai.GenerativeModel(
        model_name="gemini-2.5-flash",
        system_instruction=SYSTEM_INSTRUCTION
    )

    # Historial de xat
    if "messages" not in st.session_state:
        st.session_state.messages = []

    # Mostrar missatges anteriors
    for message in st.session_state.messages:
        with st.chat_message(message["role"]):
            st.markdown(message["content"])

    # Input de l'usuari
    if prompt := st.chat_input("Pregunta sobre la teva tècnica (ex: Com evito l'slice?)"):
        st.session_state.messages.append({"role": "user", "content": prompt})
        with st.chat_message("user"):
            st.markdown(prompt)

        with st.chat_message("assistant"):
            try:
                response = model.generate_content(prompt)
                answer = response.text
                st.markdown(answer)
                st.session_state.messages.append({"role": "assistant", "content": answer})
            except Exception as e:
                err = str(e)
                if "429" in err or "quota" in err.lower() or "exhausted" in err.lower():
                    st.error(
                        "⚠️ **Quota de l'API esgotada (error 429).**\n\n"
                        "Has superat el límit de peticions gratuïtes de Gemini. Pots:\n"
                        "- Esperar uns minuts i tornar-ho a intentar\n"
                        "- Activar la facturació a [Google AI Studio](https://aistudio.google.com)\n"
                        "- Comprovar el teu ús a [ai.dev/rate-limit](https://ai.dev/rate-limit)"
                    )
                else:
                    st.error(f"❌ Error de l'API: {err}")
else:
    st.warning("Si us plau, introdueix la teva API Key a la barra lateral per començar la lliçó.")