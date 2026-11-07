<!--
================================================================================
  CaddieCat GPS — Telèmetre i Guia de Golf i Pitch & Putt de Catalunya
================================================================================

  DESCRIPCIÓ GENERAL:
  Aplicació web responsive (PWA) de telèmetre GPS, mesurador de distàncies,
  anàlisi de caigudes de green i targeta de joc per a tots els camps de 
  Pitch & Putt (FCPP) i Golf (FCGolf) de Catalunya.

  FUNCIONALITATS PRINCIPALS:

  1. CARTOGRAFIA I ORTOFOTOS D'ALTA RESOLUCIÓ:
     - Ortofotos oficials d'alta definició de l'ICGC (Catalunya).
     - Cobertura satèl·lit complementària amb Esri World Imagery (botó 🛰️).

  2. TELÈMETRE GPS INTEL·LIGENT (MESURA EN METRES EXACTES):
     - Distàncies geodèsiques Haversine del Tee al Green (Inici, Centre ⛳ i Final).
     - Punter Mòbil Interactiu (🎯 Crosshair): mesura de distàncies a búnquers,
       doglegs, llacs o zones d'aterratge («Tee ➔ Punter» i «Punter ➔ Green»).

  3. ORIENTACIÓ DINÀMICA DEL FORAT:
     - Botó 🧭: Rota el satèl·lit de manera que el Tee quedi a baix i el Green a dalt.
     - Mode «🎯 Forat» i Mode «🗺️ Camp» (perspectiva dels 18 forats).

  4. GREEN READING BOOK — CAIGUDES AMB LIDAR ICGC A 1 METRE (Botó 📐):
     - Malla 3x3 de fletxes de caiguda que indiquen cap a on trenca la bola per gravetat.
     - Escala de color segons la intensitat: 🟢 Suau, 🟡 Moderada, 🟠 Forta, 🔴 Molt forta.
     - Anelles de distància concèntriques (2m, 4m, 6m, 8m).
     - Fletxa animada de trajectòria del cop des del punt d'entrada fins a la bandera.
     - Brúixola Nord (▲ N), xapa d'entrada (🏌️ Entrada ➔) i consell tàctic en català.

  5. TARGETA DE DISTÀNCIES I HÀNDICAPS — SCORECARD (Botó 📋):
     - Taula completa dels 18 forats amb Par, Hàndicap (HCP) i distàncies per a cada Tee.
     - Subtotals de 1a Volta (OUT 1-9), 2a Volta (IN 10-18) i Total Camp.
     - Clic a qualsevol forat per volar directament al mapa satèl·lit.
     - Estadístiques: mitjana de metres, forat més llarg, més curt i més difícil (Hcp 1).

  6. SELECCIÓ DE TEES OFICIALS:
     - Barres de competició (FCPP), curtes (EPPA), socials o de colors amb recàlcul instantani.

  7. INTEGRACIÓ AMB OPENSTREETMAP (OSM) I MODE EDITOR DE FORATS:
     - Sincronització amb Overpass API per carregar dades cartogràfiques reals.
     - Editor interactiu (✏️) per situar Tees i Greens lliurement sobre l'ortofoto.
     - Eines d'exportació i importació de coordenades en format JSON.

  8. PERSISTÈNCIA AL NÚVOL (SUPABASE) I FUNCIONAMENT OFFLINE:
     - Base de dades al núvol PostgreSQL (Supabase) per sincronitzar canvis entre dispositius.
     - Memòria cau local (`localStorage`) que garanteix el funcionament sense connexió al camp.
     - Disseny optimitzat per a mòbils (iOS i Android) i ordinadors.
================================================================================
-->