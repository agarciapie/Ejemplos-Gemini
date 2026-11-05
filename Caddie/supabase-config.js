// ==============================================================
// CONFIGURACIÓ DE SUPABASE (Persistència compartida al núvol)
// ==============================================================
// Nota: La URL ha de ser la URL base del projecte (SENSE '/rest/v1/' al final).
// Ex: "https://dxyyxjcinogiehsppfhf.supabase.co"

const SUPABASE_URL = "https://dxyyxjcinogiehsppfhf.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4eXl4amNpbm9naWVoc3BwZmhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM2NDc2OTEsImV4cCI6MjEwOTIyMzY5MX0.qNJmGUMBsMRwzsgRY-rlbLW3eHRB7mDiSsy-BEpWBY4";

// Inicialitzador del client de Supabase
let supabaseClient = null;

try {
  if (
    typeof window !== "undefined" &&
    window.supabase &&
    SUPABASE_URL &&
    !SUPABASE_URL.includes("EL_TEU_PROJECTE") &&
    !SUPABASE_ANON_KEY.includes("LA_TEVA_CLAU")
  ) {
    // Netegem automàticament qualsevol '/rest/v1' o barra final per evitar errors de ruta
    const cleanUrl = SUPABASE_URL.trim().replace(/\/rest\/v1\/?$/i, "").replace(/\/+$/, "");
    supabaseClient = window.supabase.createClient(cleanUrl, SUPABASE_ANON_KEY.trim());
    console.log("☁️ Connectat correctament a Supabase amb URL:", cleanUrl);
  } else {
    console.info("ℹ️ Supabase pendent de configurar amb les teves claus. S'utilitzarà el magatzem local (localStorage).");
  }
} catch (err) {
  console.warn("Avís en connectar amb Supabase:", err);
}
