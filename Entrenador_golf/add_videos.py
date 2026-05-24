"""
add_videos.py
=============
Aplicació Streamlit per afegir nous vídeos de YouTube al Golf Coach Pro.

Execució:
    streamlit run add_videos.py

Procés automatitzat:
  1. Descarrega les transcripcions dels nous vídeos
  2. Actualitza transcripts.json
  3. Actualitza get_transcripts.py
  4. Actualitza build_gem.py
  5. Regenera coach_config.json (executa build_gem.py)
"""

import json
import os
import re
import subprocess
import sys

import streamlit as st

# ── CONFIGURACIÓ ──────────────────────────────────────────────────────────────

st.set_page_config(
    page_title="Gestor de Vídeos – Golf Coach Pro",
    page_icon="🎬",
    layout="centered",
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# ── CSS ───────────────────────────────────────────────────────────────────────

st.markdown("""
<style>
.main { background-color: #f0fdf4; }
[data-testid="stAppViewContainer"] { background-color: #f0fdf4; }
h1, h2, h3 { color: #14532d; }
.stButton>button {
    background-color: #166534; color: white; border-radius: 8px;
    font-weight: bold; padding: 0.5rem 1.5rem;
}
.stButton>button:hover { background-color: #15803d; }
.step-ok {
    background: #f0fdf4; border-left: 4px solid #16a34a;
    padding: 0.6rem 1rem; margin: 0.4rem 0;
    border-radius: 0 8px 8px 0; font-family: monospace;
}
.step-err {
    background: #fff1f2; border-left: 4px solid #dc2626;
    padding: 0.6rem 1rem; margin: 0.4rem 0;
    border-radius: 0 8px 8px 0; font-family: monospace;
}
</style>
""", unsafe_allow_html=True)

# ── FUNCIONS DE NEGOCI ────────────────────────────────────────────────────────

def get_existing_transcripts() -> dict:
    """Retorna el contingut actual de transcripts.json, o {} si no existeix."""
    path = os.path.join(BASE_DIR, "transcripts.json")
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    return {}


def fetch_transcript(vid_id: str) -> dict:
    """Descarrega la transcripció d'un vídeo de YouTube."""
    try:
        from youtube_transcript_api import YouTubeTranscriptApi
        ytt = YouTubeTranscriptApi()
        try:
            transcript_list = ytt.list(vid_id)
            transcript = None
            for lang in ["es", "ca", "en"]:
                try:
                    transcript = transcript_list.find_transcript([lang])
                    break
                except Exception:
                    continue
            if transcript is None:
                transcript = next(iter(transcript_list))
            entries = transcript.fetch()
            full_text = " ".join([e.text for e in entries])
            return {"status": "ok", "lang": transcript.language_code, "text": full_text}
        except Exception:
            # Fallback directe
            entries = ytt.fetch(vid_id)
            full_text = " ".join([e.text for e in entries])
            return {"status": "ok", "text": full_text}
    except Exception as e:
        return {"status": "error", "error": str(e)}


def update_transcripts_json(new_results: dict) -> None:
    """Fusiona noves transcripcions a transcripts.json."""
    path = os.path.join(BASE_DIR, "transcripts.json")
    existing = get_existing_transcripts()
    existing.update(new_results)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(existing, f, ensure_ascii=False, indent=2)


def _insert_before_closing(lines: list, start_marker: str, close_char: str, new_lines: list) -> list:
    """
    Troba el bloc que comença amb start_marker i insereix new_lines
    just abans de la línia que conté únicament close_char.
    Retorna les línies modificades.
    """
    start_idx = None
    end_idx = None
    for i, line in enumerate(lines):
        if start_marker in line:
            start_idx = i
        if start_idx is not None and i > start_idx and line.strip() == close_char:
            end_idx = i
            break
    if start_idx is None or end_idx is None:
        return lines

    # Assegurar que la línia anterior acaba en coma
    prev = lines[end_idx - 1].rstrip("\n\r")
    if prev.strip() and not prev.rstrip().endswith(","):
        lines[end_idx - 1] = prev.rstrip() + ",\n"

    # Inserir les noves línies
    for j, nl in enumerate(new_lines):
        lines.insert(end_idx + j, nl)

    return lines


def update_get_transcripts_py(new_ids: list) -> int:
    """Afegeix IDs a la llista video_ids de get_transcripts.py. Retorna quants s'han afegit."""
    filepath = os.path.join(BASE_DIR, "get_transcripts.py")
    if not os.path.exists(filepath):
        return 0
    with open(filepath, "r", encoding="utf-8") as f:
        lines = f.readlines()

    # Detectar IDs actuals dins el bloc
    start_idx = next((i for i, l in enumerate(lines) if "video_ids = [" in l), None)
    end_idx = next((i for i, l in enumerate(lines) if start_idx and i > start_idx and l.strip() == "]"), None)
    if start_idx is None or end_idx is None:
        return 0

    existing = re.findall(r'"([A-Za-z0-9_-]+)"', "".join(lines[start_idx:end_idx]))
    truly_new = [v for v in new_ids if v not in existing]
    if not truly_new:
        return 0

    new_lines = [f'    "{v}",\n' for v in truly_new]
    lines = _insert_before_closing(lines, "video_ids = [", "]", new_lines)
    with open(filepath, "w", encoding="utf-8") as f:
        f.writelines(lines)
    return len(truly_new)


def update_build_gem_py(new_ids: list) -> int:
    """Afegeix IDs al diccionari 'videos' de build_gem.py. Retorna quants s'han afegit."""
    filepath = os.path.join(BASE_DIR, "build_gem.py")
    if not os.path.exists(filepath):
        return 0
    with open(filepath, "r", encoding="utf-8") as f:
        lines = f.readlines()

    start_idx = next((i for i, l in enumerate(lines) if "videos = {" in l), None)
    end_idx = next((i for i, l in enumerate(lines) if start_idx and i > start_idx and l.strip() == "}"), None)
    if start_idx is None or end_idx is None:
        return 0

    block = "".join(lines[start_idx:end_idx])
    existing_ids = re.findall(r"'([A-Za-z0-9_-]+)':\s*'Video \d+'", block)
    nums = re.findall(r"'Video (\d+)'", block)
    next_num = max([int(n) for n in nums], default=0) + 1

    truly_new = [v for v in new_ids if v not in existing_ids]
    if not truly_new:
        return 0

    new_lines = [f"    '{v}': 'Video {next_num + i}',\n" for i, v in enumerate(truly_new)]
    lines = _insert_before_closing(lines, "videos = {", "}", new_lines)
    with open(filepath, "w", encoding="utf-8") as f:
        f.writelines(lines)
    return len(truly_new)


def run_build_gem() -> tuple[int, str]:
    """Executa build_gem.py i retorna (codi_retorn, sortida)."""
    result = subprocess.run(
        [sys.executable, os.path.join(BASE_DIR, "build_gem.py")],
        capture_output=True,
        text=True,
        cwd=BASE_DIR,
    )
    return result.returncode, result.stdout + result.stderr


# ── INTERFÍCIE ────────────────────────────────────────────────────────────────

st.title("🎬 Gestor de Vídeos")
st.caption("Afegeix nous vídeos de YouTube al coneixement del Golf Coach Pro.")
st.markdown("---")

# Estat actual
existing = get_existing_transcripts()
ok_count = sum(1 for v in existing.values() if v.get("status") == "ok")
err_count = len(existing) - ok_count

col1, col2, col3 = st.columns(3)
col1.metric("📹 Vídeos OK", ok_count)
col2.metric("❌ Errors", err_count)
col3.metric("📄 Total", len(existing))

if existing:
    with st.expander("📋 Veure vídeos existents"):
        for vid_id, info in existing.items():
            icon = "✅" if info.get("status") == "ok" else "❌"
            lang = info.get("lang", "")
            label = f"{icon} `{vid_id}`" + (f"  `[{lang}]`" if lang else "")
            chars = len(info.get("text", ""))
            if chars:
                label += f"  — {chars:,} caràcters"
            st.markdown(label)

st.markdown("---")
st.subheader("➕ Afegir nous vídeos")
st.markdown(
    "Introdueix els **IDs de YouTube** dels vídeos que vols afegir, un per línia.  \n"
    "L'ID és la part final de la URL: `youtube.com/watch?v=`**`XXXXXXXXXX`**"
)

new_ids_input = st.text_area(
    "IDs de YouTube:",
    placeholder="Nb4KsqpWv24\nLEYR2BEDHFg\n...",
    height=150,
)

if st.button("🚀 Iniciar procés", type="primary"):

    # ── Validació dels IDs ────────────────────────────────────────────────────
    raw_ids = [line.strip() for line in new_ids_input.strip().splitlines() if line.strip()]
    valid_ids = [v for v in raw_ids if re.match(r"^[A-Za-z0-9_-]{6,20}$", v)]
    invalid_ids = [v for v in raw_ids if v not in valid_ids]

    if not raw_ids:
        st.error("❌ Introdueix almenys un ID de vídeo.")
        st.stop()
    if invalid_ids:
        st.warning(f"⚠️ IDs ignorats (format incorrecte): `{'`, `'.join(invalid_ids)}`")
    if not valid_ids:
        st.error("❌ Cap ID vàlid.")
        st.stop()

    # IDs que ja existeixen OK
    already_ok = [v for v in valid_ids if existing.get(v, {}).get("status") == "ok"]
    to_process = [v for v in valid_ids if v not in already_ok]

    if already_ok:
        st.info(f"ℹ️ Ja existents (s'ometen): `{'`, `'.join(already_ok)}`")
    if not to_process:
        st.success("✅ Tots els vídeos indicats ja estan al sistema!")
        st.stop()

    st.markdown(f"**Processant {len(to_process)} vídeo(s) nous...**")
    st.markdown("---")

    # ── PAS 1: Descàrrega de transcripcions ──────────────────────────────────
    st.markdown("### Pas 1 — Descàrrega de transcripcions")
    fetch_results = {}
    for vid_id in to_process:
        with st.spinner(f"Descarregant `{vid_id}`..."):
            result = fetch_transcript(vid_id)
            fetch_results[vid_id] = result
        if result["status"] == "ok":
            lang = result.get("lang", "?")
            chars = len(result.get("text", ""))
            st.markdown(
                f'<div class="step-ok">✅ <b>{vid_id}</b> [{lang}] — {chars:,} caràcters</div>',
                unsafe_allow_html=True,
            )
        else:
            st.markdown(
                f'<div class="step-err">❌ <b>{vid_id}</b> — {result["error"]}</div>',
                unsafe_allow_html=True,
            )

    ok_results = {k: v for k, v in fetch_results.items() if v["status"] == "ok"}
    if not ok_results:
        st.error("❌ No s'ha pogut obtenir cap transcripció. Comprova els IDs i que els vídeos tinguin subtítols activats.")
        st.stop()

    ok_ids = list(ok_results.keys())

    # ── PAS 2: Actualitzar transcripts.json ───────────────────────────────────
    st.markdown("### Pas 2 — transcripts.json")
    update_transcripts_json(ok_results)
    st.markdown(
        f'<div class="step-ok">✅ transcripts.json actualitzat (+{len(ok_results)} transcripció(ns))</div>',
        unsafe_allow_html=True,
    )

    # ── PAS 3: Actualitzar get_transcripts.py ─────────────────────────────────
    st.markdown("### Pas 3 — get_transcripts.py")
    n3 = update_get_transcripts_py(ok_ids)
    st.markdown(
        f'<div class="step-ok">✅ get_transcripts.py actualitzat (+{n3} ID(s))</div>',
        unsafe_allow_html=True,
    )

    # ── PAS 4: Actualitzar build_gem.py ───────────────────────────────────────
    st.markdown("### Pas 4 — build_gem.py")
    n4 = update_build_gem_py(ok_ids)
    st.markdown(
        f'<div class="step-ok">✅ build_gem.py actualitzat (+{n4} vídeo(s))</div>',
        unsafe_allow_html=True,
    )

    # ── PAS 5: Regenerar coach_config.json ────────────────────────────────────
    st.markdown("### Pas 5 — Regeneració de coach_config.json")
    with st.spinner("Executant build_gem.py..."):
        returncode, output = run_build_gem()

    if returncode == 0:
        st.markdown(
            '<div class="step-ok">✅ coach_config.json regenerat correctament!</div>',
            unsafe_allow_html=True,
        )
        with st.expander("Veure sortida de build_gem.py"):
            st.code(output)
    else:
        st.markdown(
            '<div class="step-err">❌ Error en executar build_gem.py</div>',
            unsafe_allow_html=True,
        )
        st.code(output)
        st.stop()

    # ── RESUM FINAL ───────────────────────────────────────────────────────────
    st.markdown("---")
    st.balloons()
    n_err = len(to_process) - len(ok_results)
    msg = f"### 🎉 Procés completat!\n\n"
    msg += f"- ✅ **{len(ok_results)}** vídeo(s) afegit(s) correctament\n"
    if n_err:
        msg += f"- ❌ **{n_err}** vídeo(s) han fallat (sense subtítols o ID incorrecte)\n"
    msg += "\n**Reinicia `CoachGolfPro.py` per aplicar els canvis:**\n```\nstreamlit run CoachGolfPro.py\n```"
    st.success(msg)
