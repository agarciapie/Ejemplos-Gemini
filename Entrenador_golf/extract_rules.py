"""
extract_rules.py
================
Extreu el text del document PDF de normativa de Pitch&Putt
i el guarda a rules.txt per ser inclòs a CoachGolfGem.py.

Ús:
  1. Copia el PDF al mateix directori amb el nom: normativa_pp.pdf
  2. Executa:  python extract_rules.py
  3. Es crearà el fitxer rules.txt amb el text extret
  4. Executa:  python build_gem.py   per regenerar CoachGolfGem.py
"""

import os
from pypdf import PdfReader

# ── CONFIGURACIÓ ──────────────────────────────────────────────────────────────
# Canvia aquest nom si el teu PDF té un nom diferent
PDF_FILE = "normativa_pp.pdf"
OUTPUT_FILE = "rules.txt"

# ── EXTRACCIÓ ─────────────────────────────────────────────────────────────────

pdf_path = os.path.join(os.path.dirname(__file__), PDF_FILE)

if not os.path.exists(pdf_path):
    print(f"❌ No s'ha trobat el fitxer: {PDF_FILE}")
    print(f"   Copia el PDF al directori i assegura't que es diu '{PDF_FILE}'")
    exit(1)

print(f"📄 Llegint {PDF_FILE}...")

reader = PdfReader(pdf_path)
pages_text = []

for i, page in enumerate(reader.pages):
    text = page.extract_text()
    if text and text.strip():
        pages_text.append(text.strip())
    print(f"   Pàgina {i+1}/{len(reader.pages)} processada")

full_text = "\n\n".join(pages_text)

# Neteja bàsica del text extret
full_text = full_text.replace("\x00", "")   # Elimina caràcters nuls
full_text = "\n".join(                       # Elimina línies en blanc múltiples
    line for line in full_text.splitlines()
    if line.strip() or True
)

# Guardem el resultat
with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    f.write(full_text)

print(f"\n✅ Text extret correctament!")
print(f"   Pàgines processades: {len(reader.pages)}")
print(f"   Caràcters extrets:   {len(full_text):,}")
print(f"   Fitxer guardat a:    {OUTPUT_FILE}")
print(f"\n👉 Ara executa:  python build_gem.py")
