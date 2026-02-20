import streamlit as st
import google.generativeai as genai
import time
import tempfile

st.set_page_config(page_title="Golf Coach Pro: Video AI", page_icon="⛳")

st.title("⛳ Entrenador de Golf: Anàlisi de Swing")

# Sidebar per API i Pujada de Vídeo
with st.sidebar:
    api_key = st.text_input("Gemini API Key", type="password")
    uploaded_file = st.file_uploader("Puja el teu swing (MP4, MOV)", type=['mp4', 'mov', 'avi'])

if api_key:
    genai.configure(api_key=api_key)
    
    # Model configurat per a anàlisi visual
    model = genai.GenerativeModel(
        model_name="gemini-2.5-flash", # Flash és ideal per a velocitat en vídeo
        system_instruction="Ets un expert en biomecànica de golf. Analitza el vídeo fotograma a fotograma. "
                           "Fixa't en el grip, l'alineació, el backswing i el follow-through. "
                           "Dóna consells concrets per corregir errors visuals."
    )

    if uploaded_file:
        st.video(uploaded_file)
        
        if st.button("Analitzar Swing"):
            with st.spinner("L'IA està estudiant el teu moviment..."):
                # Crear un fitxer temporal per pujar-lo a l'API de Google
                with tempfile.NamedTemporaryFile(delete=False, suffix='.mp4') as tmp:
                    tmp.write(uploaded_file.read())
                    video_path = tmp.name

                # Pujar el fitxer a l'API de Gemini
                golf_video = genai.upload_file(path=video_path)
                
                # Esperar que el vídeo estigui processat pel servidor
                while golf_video.state.name == "PROCESSING":
                    time.sleep(2)
                    golf_video = genai.get_file(golf_video.name)

                # Generar l'anàlisi
                prompt = "Analitza aquest swing de golf. Quins són els 3 errors principals i com puc corregir-los?"
                response = model.generate_content([prompt, golf_video])
                
                st.markdown("### 📊 Informe de l'Entrenador")
                st.write(response.text)
                
                # Netejar el fitxer de l'API (opcional)
                genai.delete_file(golf_video.name)

else:
    st.info("Introdueix la teva API Key per activar l'anàlisi.")