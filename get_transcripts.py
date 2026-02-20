from youtube_transcript_api import YouTubeTranscriptApi
import json

video_ids = [
    "Nb4KsqpWv24",
    "1pP_435kO1s",
    "pNcnpTgGMmY",
    "u4mvIC71Ny8",
    "ED63gIMfbf8",
    "Joc50kdFE2c",
    "2PFCogJsaYE",
    "KhThqqywr7Q",
    "IWl3qndvGhM",
    "XoUQnqQGayM",
    "Ifd5MkFS4sU",
    "Oe8CcAhtwvc",
    "IbW8IQjPvac",
    "LEYR2BEDHFg"
]

ytt = YouTubeTranscriptApi()
results = {}

for vid_id in video_ids:
    try:
        # List available transcripts and pick best language
        transcript_list = ytt.list(vid_id)
        transcript = None
        for lang in ['es', 'ca', 'en']:
            try:
                transcript = transcript_list.find_transcript([lang])
                break
            except:
                continue
        if transcript is None:
            # Take whatever is available
            transcript = next(iter(transcript_list))

        entries = transcript.fetch()
        full_text = " ".join([e.text for e in entries])
        results[vid_id] = {"status": "ok", "lang": transcript.language_code, "text": full_text}
        print(f"OK  [{transcript.language_code}] {vid_id}: {len(full_text)} chars")
    except Exception as e:
        # Fallback: try fetch directly
        try:
            entries = ytt.fetch(vid_id)
            full_text = " ".join([e.text for e in entries])
            results[vid_id] = {"status": "ok", "text": full_text}
            print(f"OK  {vid_id}: {len(full_text)} chars")
        except Exception as e2:
            results[vid_id] = {"status": "error", "error": str(e2)}
            print(f"ERR {vid_id}: {e2}")

with open("transcripts.json", "w", encoding="utf-8") as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

ok = sum(1 for v in results.values() if v["status"] == "ok")
print(f"\nFet! {ok}/{len(video_ids)} transcripcions obtingudes. Guardat a transcripts.json")
