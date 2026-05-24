# 🌿 PlantaVision – Identificació Intel·ligent de Plantes

PlantaVision és una aplicació web moderna dissenyada amb **Python** i **Streamlit** que utilitza models de visió avançada de **Google Gemini** per identificar de forma instantània qualsevol planta, flor, arbre o herba a partir d'una foto.

## ✨ Característiques

- **Identificació Completa**: Proporciona el nom científic, nom popular (català, castellà, anglès) i família botànica.
- **Origen i Hàbitat**: Descobreix la procedència, la distribució geogràfica i el tipus d'hàbitat idoni per a l'espècie.
- **Propietats i Usos**: Analitza els usos medicinals, culinaris i altres aplicacions pràctiques.
- **Seguretat**: Alerta de toxicitat intel·ligent per prevenir perills.
- **Curiositats**: Detalls interessants i històrics de cada espècie.
- **Estètica Premium**: Disseny responsive, modern, fosc, amb glassmorphism i animacions suaus adaptades a la temàtica botànica.

---

## 🚀 Com Executar l'Aplicació

Segueix aquests senzills passos per posar en marxa l'aplicació al teu ordinador local (Windows):

### 1. Recomanació d'Espai de Treball
Et recomanem establir la següent ruta com el teu espai de treball actiu:
`C:\Users\agapi\.gemini\antigravity\scratch\plant-identifier`

### 2. Instal·lació de Dependències
Obre el teu terminal de PowerShell i navega fins al directori del projecte:

```powershell
cd C:\Users\agapi\.gemini\antigravity\scratch\plant-identifier
```

Instal·la els paquets necessaris utilitzant `pip`:

```powershell
pip install -r requirements.txt
```

### 3. Iniciar el Servidor de Desenvolupament
Per executar PlantaVision localment:

```powershell
streamlit run app.py
```

L'aplicació s'obrirà automàticament al teu navegador web predeterminat a l'adreça `http://localhost:8501`.

---

## 🔑 Clau API de Google Gemini

L'aplicació necessita una clau API per funcionar. Pots:
1. Obtenir una clau API **gratuïta** a [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Introduir-la directament a la interfície de l'aplicació web quan estigui en funcionament.
3. O bé, configurar-la com a variable d'entorn abans d'iniciar Streamlit:
   ```powershell
   $env:GEMINI_API_KEY="LA_TEVA_CLAU_API"
   ```

Disfruta explorant i identificant la naturalesa amb **PlantaVision**! 🌿
