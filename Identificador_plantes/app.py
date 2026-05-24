import streamlit as st
from google import genai
from google.genai import types
from PIL import Image
import io
import json
import os
import base64
import time
from pydantic import BaseModel, Field
from typing import Optional

# ─── Page Configuration ───────────────────────────────────────────────────────
st.set_page_config(
    page_title="PlantaVision – Identificació de Plantes",
    page_icon="🌿",
    layout="wide",
    initial_sidebar_state="collapsed",
)

# ─── Load Custom CSS ──────────────────────────────────────────────────────────
def load_css():
    css_path = os.path.join(os.path.dirname(__file__), "style.css")
    with open(css_path, "r", encoding="utf-8") as f:
        st.markdown(f"<style>{f.read()}</style>", unsafe_allow_html=True)

load_css()

# ─── Gemini Configuration ─────────────────────────────────────────────────────
def configure_gemini(api_key: str):
    return genai.Client(api_key=api_key)

# ─── Pydantic Schema for Structured Output ────────────────────────────────────
class PlantIdentification(BaseModel):
    identificat: bool = Field(description="Indica si s'ha pogut identificar una planta, flor o arbre en la imatge.")
    missatge: Optional[str] = Field(None, description="Missatge explicatiu en català si no s'ha identificat cap planta.")
    nom_cientific: Optional[str] = Field(None, description="Nom científic oficial de la planta.")
    nom_popular_catala: Optional[str] = Field(None, description="Nom popular o comú en català.")
    nom_popular_castella: Optional[str] = Field(None, description="Nom popular o comú en castellà.")
    nom_popular_angles: Optional[str] = Field(None, description="Nom popular o comú en anglès.")
    familia: Optional[str] = Field(None, description="Família botànica de la planta.")
    origen: Optional[str] = Field(None, description="Procedència i origen geogràfic original en català.")
    distribucio: Optional[str] = Field(None, description="Llocs actuals on es troba o es distribueix en català.")
    descripcio: Optional[str] = Field(None, description="Descripció botànica física i característica en català.")
    habitat: Optional[str] = Field(None, description="Tipus d'hàbitat idoni per a l'espècie en català.")
    florescencia: Optional[str] = Field(None, description="Època o característiques de la floració en català.")
    usos_medicinals: Optional[str] = Field(None, description="Usos medicinals o terapèutics de la planta en català.")
    usos_culinaris: Optional[str] = Field(None, description="Usos culinaris o gastronòmics de la planta en català.")
    altres_usos: Optional[str] = Field(None, description="Altres usos (ornamental, fusta, industrial, etc.) en català.")
    curiositats: Optional[str] = Field(None, description="Curiositats, història o anècdotes interessants en català.")
    estat_conservacio: Optional[str] = Field(None, description="Estat de conservació de l'espècie en català.")
    toxicitat: Optional[str] = Field(None, description="Nivell de toxicitat per a humans o animals de companyia en català.")
    confianca: Optional[str] = Field(None, description="Nivell de confiança en la identificació: 'alta', 'mitjana' o 'baixa'.")

# ─── Plant Identification Prompt ──────────────────────────────────────────────
IDENTIFICATION_PROMPT = """
Analitza aquesta imatge i identifica la planta, flor o arbre que apareix.
Emplena tots els camps del format de sortida requerit.
Respon sempre en català per a tots els camps de text descriptius.
Si no hi ha cap planta, flor o arbre a la imatge, indica-ho al camp 'identificat' com a fals i descriu-ho al camp 'missatge'.
"""

def identify_plant(client, image: Image.Image) -> dict:
    """Send image to Gemini and parse the plant identification response using Structured Outputs."""
    response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents=[image, IDENTIFICATION_PROMPT],
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=PlantIdentification,
            temperature=0.2,
        )
    )

    # response.text is guaranteed by the API to be a valid JSON adhering strictly to our Pydantic schema
    return json.loads(response.text)


# ─── UI Helpers ───────────────────────────────────────────────────────────────
def get_image_b64(path: str) -> str:
    with open(path, "rb") as f:
        return base64.b64encode(f.read()).decode()

def confidence_badge(level: str) -> str:
    colors = {"alta": "#2ecc71", "mitjana": "#f39c12", "baixa": "#e74c3c"}
    labels = {"alta": "Alta Confiança", "mitjana": "Confiança Mitjana", "baixa": "Baixa Confiança"}
    color = colors.get(level, "#95a5a6")
    label = labels.get(level, level)
    return f'<span class="badge" style="background:{color}">{label}</span>'

def info_card(icon: str, title: str, content: str, card_class: str = "") -> str:
    if not content or content.strip() in ("", "N/A", "No disponible", "No aplicable", "-"):
        return ""
    return f"""
    <div class="info-card {card_class}">
        <div class="card-header">
            <span class="card-icon">{icon}</span>
            <h3 class="card-title">{title}</h3>
        </div>
        <p class="card-content">{content}</p>
    </div>
    """

def toxicity_alert(toxicitat: str) -> str:
    if not toxicitat or toxicitat.strip() in ("", "N/A", "-"):
        return ""
    text_lower = toxicitat.lower()
    if any(w in text_lower for w in ["tòxic", "toxic", "perill", "verinós", "verinos"]):
        icon, cls = "☠️", "alert-danger"
    elif any(w in text_lower for w in ["irritant", "al·lèrg", "allergi", "precaució"]):
        icon, cls = "⚠️", "alert-warning"
    else:
        icon, cls = "✅", "alert-safe"
    return f'<div class="toxicity-alert {cls}">{icon} <strong>Toxicitat:</strong> {toxicitat}</div>'


# ─── Main Application ─────────────────────────────────────────────────────────
def main():
    # ── Hero Section ──────────────────────────────────────────────────────────
    hero_path = os.path.join(os.path.dirname(__file__), "assets", "plant_hero.png")
    if os.path.exists(hero_path):
        b64 = get_image_b64(hero_path)
        st.markdown(
            f"""
            <div class="hero-section" style="background-image: url('data:image/png;base64,{b64}');">
                <div class="hero-overlay">
                    <div class="hero-content">
                        <div class="hero-icon">🌿</div>
                        <h1 class="hero-title">PlantaVision</h1>
                        <p class="hero-subtitle">Identificació Intel·ligent de Plantes</p>
                        <p class="hero-desc">Puja una foto de qualsevol planta, flor o arbre i descobreix la seva identitat, origen i propietats</p>
                    </div>
                </div>
            </div>
            """,
            unsafe_allow_html=True,
        )
    else:
        st.markdown(
            """
            <div class="hero-section-simple">
                <div class="hero-icon">🌿</div>
                <h1 class="hero-title">PlantaVision</h1>
                <p class="hero-subtitle">Identificació Intel·ligent de Plantes</p>
            </div>
            """,
            unsafe_allow_html=True,
        )

    # ── API Key Input ─────────────────────────────────────────────────────────
    st.markdown('<div class="main-container">', unsafe_allow_html=True)

    api_key = os.environ.get("GEMINI_API_KEY", "")
    if not api_key:
        st.markdown('<div class="api-section">', unsafe_allow_html=True)
        st.markdown(
            '<p class="section-label">🔑 Clau API de Google Gemini</p>',
            unsafe_allow_html=True,
        )
        api_key = st.text_input(
            "API Key",
            type="password",
            placeholder="Enganxa la teva clau API de Google AI Studio...",
            label_visibility="collapsed",
        )
        st.markdown(
            '<p class="api-hint">Obtén la teva clau gratuïta a <a href="https://aistudio.google.com/app/apikey" target="_blank">Google AI Studio</a></p>',
            unsafe_allow_html=True,
        )
        st.markdown("</div>", unsafe_allow_html=True)

    # ── Upload Section ─────────────────────────────────────────────────────────
    st.markdown('<div class="upload-section">', unsafe_allow_html=True)
    st.markdown(
        '<p class="section-label">📸 Puja la teva foto</p>',
        unsafe_allow_html=True,
    )

    uploaded_file = st.file_uploader(
        "Carrega una imatge",
        type=["jpg", "jpeg", "png", "webp"],
        label_visibility="collapsed",
        help="Formats acceptats: JPG, JPEG, PNG, WEBP",
    )
    st.markdown("</div>", unsafe_allow_html=True)

    if uploaded_file:
        image = Image.open(uploaded_file).convert("RGB")

        # Show preview
        col1, col2, col3 = st.columns([1, 2, 1])
        with col2:
            st.markdown('<div class="image-preview-container">', unsafe_allow_html=True)
            st.image(image, caption="Foto carregada", use_column_width=True)
            st.markdown("</div>", unsafe_allow_html=True)

        # Identify button
        col_a, col_b, col_c = st.columns([1, 2, 1])
        with col_b:
            identify_btn = st.button(
                "🔍 Identificar la Planta",
                use_container_width=True,
                type="primary",
            )

        if identify_btn:
            if not api_key:
                st.markdown(
                    '<div class="error-box">⚠️ Si us plau, introdueix la teva clau API de Google Gemini.</div>',
                    unsafe_allow_html=True,
                )
            else:
                # Identification process with animation
                with st.spinner(""):
                    st.markdown(
                        """
                        <div class="loading-container">
                            <div class="loading-spinner">🌱</div>
                            <p class="loading-text">Analitzant la imatge...</p>
                        </div>
                        """,
                        unsafe_allow_html=True,
                    )
                    try:
                        model = configure_gemini(api_key)
                        result = identify_plant(model, image)
                    except json.JSONDecodeError as e:
                        st.error(f"Error en processar la resposta de l'API: {e}")
                        return
                    except Exception as e:
                        err = str(e)
                        if "API_KEY_INVALID" in err or "invalid" in err.lower():
                            st.markdown(
                                '<div class="error-box">❌ Clau API no vàlida. Comprova la teva clau a Google AI Studio.</div>',
                                unsafe_allow_html=True,
                            )
                        else:
                            st.markdown(
                                f'<div class="error-box">❌ Error en identificar la planta: {err}</div>',
                                unsafe_allow_html=True,
                            )
                        return

                # ── Results ──────────────────────────────────────────────────
                if not result.get("identificat", False):
                    missatge = result.get("missatge", "No s'ha pogut identificar cap planta en aquesta imatge.")
                    st.markdown(
                        f'<div class="not-found-box">🔎 {missatge}</div>',
                        unsafe_allow_html=True,
                    )
                    return

                # Header Result
                confidence = result.get("confianca", "mitjana")
                st.markdown(
                    f"""
                    <div class="result-header">
                        <div class="result-title-section">
                            <h2 class="result-plant-name">{result.get('nom_popular_catala', 'Planta desconeguda')}</h2>
                            <p class="result-scientific"><em>{result.get('nom_cientific', '')}</em></p>
                            <p class="result-family">Família: <strong>{result.get('familia', 'N/A')}</strong></p>
                            <div class="names-row">
                                <span class="name-tag">🇪🇸 {result.get('nom_popular_castella', '')}</span>
                                <span class="name-tag">🇬🇧 {result.get('nom_popular_angles', '')}</span>
                            </div>
                        </div>
                        <div class="result-badge-section">
                            {confidence_badge(confidence)}
                        </div>
                    </div>
                    """,
                    unsafe_allow_html=True,
                )

                # Toxicity Alert
                tox = toxicity_alert(result.get("toxicitat", ""))
                if tox:
                    st.markdown(tox, unsafe_allow_html=True)

                # Description
                if result.get("descripcio"):
                    st.markdown(
                        f'<div class="description-box"><p>{result["descripcio"]}</p></div>',
                        unsafe_allow_html=True,
                    )

                # Cards Grid
                st.markdown('<div class="cards-grid">', unsafe_allow_html=True)

                cards_data = [
                    ("🌍", "Origen", result.get("origen", ""), "card-origin"),
                    ("📍", "Distribució Geogràfica", result.get("distribucio", ""), "card-distribution"),
                    ("🌲", "Hàbitat", result.get("habitat", ""), "card-habitat"),
                    ("🌸", "Florescència", result.get("florescencia", ""), "card-flower"),
                    ("💊", "Usos Medicinals", result.get("usos_medicinals", ""), "card-medical"),
                    ("🍽️", "Usos Culinaris", result.get("usos_culinaris", ""), "card-culinary"),
                    ("🔨", "Altres Usos", result.get("altres_usos", ""), "card-other"),
                    ("💡", "Curiositats", result.get("curiositats", ""), "card-curiosity"),
                    ("🛡️", "Estat de Conservació", result.get("estat_conservacio", ""), "card-conservation"),
                ]

                cards_html = ""
                for icon, title, content, cls in cards_data:
                    card = info_card(icon, title, content, cls)
                    if card:
                        cards_html += card

                st.markdown(cards_html + "</div>", unsafe_allow_html=True)

                # Footer
                st.markdown(
                    """
                    <div class="result-footer">
                        <p>✨ Identificació realitzada per <strong>Google Gemini AI</strong> · PlantaVision</p>
                    </div>
                    """,
                    unsafe_allow_html=True,
                )

    else:
        # Empty state
        st.markdown(
            """
            <div class="empty-state">
                <div class="empty-icon">🌱</div>
                <h3>Puja una foto per començar</h3>
                <p>Acceptem fotos de plantes, flors, arbres, herbes i qualsevol espècie vegetal</p>
                <div class="features-row">
                    <div class="feature-item">🔬 Nom científic</div>
                    <div class="feature-item">🌍 Origen i distribució</div>
                    <div class="feature-item">💊 Usos medicinals</div>
                    <div class="feature-item">🍽️ Usos culinaris</div>
                    <div class="feature-item">💡 Curiositats</div>
                    <div class="feature-item">🛡️ Estat de conservació</div>
                </div>
            </div>
            """,
            unsafe_allow_html=True,
        )

    st.markdown("</div>", unsafe_allow_html=True)  # close main-container

    # Footer
    st.markdown(
        """
        <div class="app-footer">
            <p>🌿 PlantaVision · Powered by Google Gemini AI · Identificació Intel·ligent de Plantes</p>
        </div>
        """,
        unsafe_allow_html=True,
    )


if __name__ == "__main__":
    main()
