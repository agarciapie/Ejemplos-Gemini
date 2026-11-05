/**
 * CaddieCat GPS — Aplicació Web de Telèmetre per a Golf i Pitch & Putt de Catalunya
 * - Cartografia d'alta resolució: Ortofotos ICGC (Catalunya) + Esri World Imagery
 * - Integració automàtica amb OpenStreetMap (Overpass API) per extreure Tees, Greens i Forats
 * - Mode Editor integrat sobre satèl·lit amb persistència a localStorage i Export/Import JSON
 */

// ==========================================
// 1. ESTAT GLOBAL DE L'APLICACIÓ
// ==========================================
const state = {
  currentCourse: null,
  currentHoleNumber: 1,
  selectedTeeId: null,
  viewMode: "hole", // 'hole' (vista forat orientat) | 'course' (vista general 18 forats)
  satelliteProvider: "ICGC", // 'ICGC' | 'ESRI'
  editorActive: false,
  editorClickMode: "tee", // 'tee' | 'green'
  targetPosition: null, // { lat, lng } del punter mòbil 🎯
  holesData: [], // Array d'objectes { number, par, tee: {lat,lng}, green: {lat,lng}, greenRadius, source }
  osmCache: {}
};

let map = null;
let teeMarker = null;
let greenMarker = null;
let targetMarker = null;
let targetPillEl = null;
let courseOverviewMarkers = [];

const STORAGE_KEY_PREFIX = "caddiecat_course_v7_";

// ==========================================
// 2. UTILITATS GEODÈSIQUES (Càlculs exactes en metres)
// ==========================================
const GeoUtils = {
  toRad(deg) {
    return (deg * Math.PI) / 180;
  },
  toDeg(rad) {
    return (rad * 180) / Math.PI;
  },

  // Distància Haversine en metres entre dos punts {lat, lng}
  distanceMeters(p1, p2) {
    if (!p1 || !p2) return 0;
    const R = 6371000; // Radi de la Terra en metres
    const dLat = this.toRad(p2.lat - p1.lat);
    const dLng = this.toRad(p2.lng - p1.lng);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(p1.lat)) *
        Math.cos(this.toRad(p2.lat)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  },

  // Rumb (bearing) en graus (0 = Nord, 90 = Est, etc.) de p1 a p2
  bearingDegrees(p1, p2) {
    const lat1 = this.toRad(p1.lat);
    const lat2 = this.toRad(p2.lat);
    const dLng = this.toRad(p2.lng - p1.lng);
    const y = Math.sin(dLng) * Math.cos(lat2);
    const x =
      Math.cos(lat1) * Math.sin(lat2) -
      Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
    const brng = this.toDeg(Math.atan2(y, x));
    return (brng + 360) % 360;
  },

  // Punt intermedi entre dos punts (fraction 0..1)
  interpolate(p1, p2, fraction = 0.55) {
    return {
      lat: p1.lat + (p2.lat - p1.lat) * fraction,
      lng: p1.lng + (p2.lng - p1.lng) * fraction
    };
  },

  // Desplaça un punt {lat, lng} una distància en metres en una direcció (bearingDegrees)
  destinationPoint(point, distanceMeters, bearingDeg) {
    const R = 6371000;
    const d = distanceMeters / R;
    const brng = this.toRad(bearingDeg);
    const lat1 = this.toRad(point.lat);
    const lng1 = this.toRad(point.lng);

    const lat2 = Math.asin(
      Math.sin(lat1) * Math.cos(d) +
        Math.cos(lat1) * Math.sin(d) * Math.cos(brng)
    );
    const lng2 =
      lng1 +
      Math.atan2(
        Math.sin(brng) * Math.sin(d) * Math.cos(lat1),
        Math.cos(d) - Math.sin(lat1) * Math.sin(lat2)
      );

    return {
      lat: this.toDeg(lat2),
      lng: this.toDeg(lng2)
    };
  },

  // Genera un polígon circular (GeoJSON) per dibuixar el contorn del Green
  createCirclePolygon(center, radiusMeters, points = 32) {
    const coords = [];
    for (let i = 0; i <= points; i++) {
      const angle = (i * 360) / points;
      const pt = this.destinationPoint(center, radiusMeters, angle);
      coords.push([pt.lng, pt.lat]);
    }
    return {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [coords]
      }
    };
  }
};

// ==========================================
// 3. INICIALITZACIÓ DEL MAPA (MapLibre GL + Ortofoto ICGC / Esri)
// ==========================================
function initMap() {
  const defaultCourse = COURSES_DATA[0];

  map = new maplibregl.Map({
    container: "map",
    style: {
      version: 8,
      sources: {
        // Ortofoto d'alta resolució de l'Institut Cartogràfic i Geològic de Catalunya (ICGC)
        "icgc-ortho": {
          type: "raster",
          tiles: [
            "https://geoserveis.icgc.cat/icc_mapesmultimodal/noutm/wmts/orto/GRID3857/{z}/{x}/{y}.jpeg"
          ],
          tileSize: 256,
          maxzoom: 20,
          attribution: "© ICGC Catalunya Ortofoto"
        },
        // Fallback i complement internacional (Andorra / Món): Esri World Imagery
        "esri-world": {
          type: "raster",
          tiles: [
            "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          ],
          tileSize: 256,
          maxzoom: 19,
          attribution: "© Esri World Imagery"
        }
      },
      layers: [
        {
          id: "esri-layer",
          type: "raster",
          source: "esri-world",
          minzoom: 0,
          maxzoom: 22
        },
        {
          id: "icgc-layer",
          type: "raster",
          source: "icgc-ortho",
          minzoom: 0,
          maxzoom: 22
        }
      ]
    },
    center: [defaultCourse.lng, defaultCourse.lat],
    zoom: 17.5,
    pitch: 0,
    bearing: 0,
    maxZoom: 21
  });

  map.on("load", () => {
    setupMapLayers();
    loadCourse(defaultCourse.id);
  });

  // Clic al mapa quan el Mode Editor està actiu o per moure el Punter Mòbil ràpidament
  map.on("click", (e) => {
    const clickedPt = { lat: e.lngLat.lat, lng: e.lngLat.lng };

    if (state.editorActive) {
      applyEditorClick(clickedPt);
    } else if (state.viewMode === "hole") {
      // En fer clic sobre el carrer o búnquer, movem el punter mòbil a aquell punt
      state.targetPosition = clickedPt;
      updateHoleVisualization(false);
    }
  });
}

// Configura les capes vectorials (Línia Tee->Punter->Green, Cercle de Green, Recorregut)
function setupMapLayers() {
  // Font per al polígon del Green
  map.addSource("green-area-source", {
    type: "geojson",
    data: { type: "FeatureCollection", features: [] }
  });

  map.addLayer({
    id: "green-area-fill",
    type: "fill",
    source: "green-area-source",
    paint: {
      "fill-color": "#10b981",
      "fill-opacity": 0.28
    }
  });

  map.addLayer({
    id: "green-area-outline",
    type: "line",
    source: "green-area-source",
    paint: {
      "line-color": "#34d399",
      "line-width": 2,
      "line-dasharray": [2, 2]
    }
  });

  // Font per a les línies de tots els forats en Vista General
  map.addSource("course-overview-source", {
    type: "geojson",
    data: { type: "FeatureCollection", features: [] }
  });

  map.addLayer({
    id: "course-overview-lines",
    type: "line",
    source: "course-overview-source",
    paint: {
      "line-color": "#38bdf8",
      "line-width": 2.5,
      "line-opacity": 0.75
    }
  });

  // Font per a la línia del telèmetre: Tee -> Punter -> Green
  map.addSource("rangefinder-line-source", {
    type: "geojson",
    data: { type: "FeatureCollection", features: [] }
  });

  // Línia directa de referència Tee -> Green (fina i subtil)
  map.addLayer({
    id: "direct-tee-green-line",
    type: "line",
    source: "rangefinder-line-source",
    filter: ["==", ["get", "segment"], "direct"],
    paint: {
      "line-color": "#ffffff",
      "line-opacity": 0.3,
      "line-width": 1.5,
      "line-dasharray": [4, 4]
    }
  });

  // Segment 1: Tee -> Punter Mòbil (Groc ambre brillant)
  map.addLayer({
    id: "tee-to-target-line",
    type: "line",
    source: "rangefinder-line-source",
    filter: ["==", ["get", "segment"], "tee-target"],
    paint: {
      "line-color": "#fbbf24",
      "line-width": 3.5
    }
  });

  // Segment 2: Punter Mòbil -> Bandera Green (Verd maragda discontinu)
  map.addLayer({
    id: "target-to-green-line",
    type: "line",
    source: "rangefinder-line-source",
    filter: ["==", ["get", "segment"], "target-green"],
    paint: {
      "line-color": "#34d399",
      "line-width": 3,
      "line-dasharray": [2, 2]
    }
  });
}

// ==========================================
// 4. INTEGRACIÓ OPENSTREETMAP (API DIRECTA 0.6 + OVERPASS) + LOCALSTORAGE
// ==========================================

// Consulta automàtica a OpenStreetMap per extreure els forats (`golf=hole`, `golf=tee`, `golf=green`, `golf=fairway`)
async function fetchCourseHolesFromOSM(course) {
  const banner = document.getElementById("osmLoadingBanner");
  const bannerText = document.getElementById("osmBannerText");
  banner.classList.remove("hidden");
  bannerText.textContent = `Consultant OpenStreetMap per a ${course.name}...`;

  // 1. Consulta ràpida a l'API principal d'OpenStreetMap (/api/0.6/map.json) — No depèn d'Overpass i respon en <300ms
  try {
    const d = course.type === "Golf" ? 0.014 : 0.007;
    const bbox = `${(course.lng - d).toFixed(5)},${(course.lat - d).toFixed(5)},${(course.lng + d).toFixed(5)},${(course.lat + d).toFixed(5)}`;
    const directUrl = `https://api.openstreetmap.org/api/0.6/map.json?bbox=${bbox}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);
    const response = await fetch(directUrl, {
      headers: { Accept: "application/json" },
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      const parsedHoles = parseOSMGolfElements(data.elements, course);
      banner.classList.add("hidden");
      return parsedHoles;
    }
  } catch (err) {
    console.warn("Avís en consulta directa OSM API 0.6:", err);
  }

  // 2. Fallback a Overpass API si cal
  const radius = course.type === "Golf" ? 1300 : 650;
  const query = `
    [out:json][timeout:8];
    (
      way["golf"="hole"](around:${radius},${course.lat},${course.lng});
      node["golf"="tee"](around:${radius},${course.lat},${course.lng});
      way["golf"="tee"](around:${radius},${course.lat},${course.lng});
      node["golf"="green"](around:${radius},${course.lat},${course.lng});
      way["golf"="green"](around:${radius},${course.lat},${course.lng});
      way["golf"="fairway"](around:${radius},${course.lat},${course.lng});
    );
    out body geom;
  `;

  const endpoints = [
    "https://overpass-api.de/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter"
  ];

  for (const endpoint of endpoints) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      const response = await fetch(endpoint, {
        method: "POST",
        body: "data=" + encodeURIComponent(query),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!response.ok) continue;
      const data = await response.json();

      const parsedHoles = parseOSMGolfElements(data.elements, course);
      banner.classList.add("hidden");
      return parsedHoles;
    } catch (err) {
      console.warn(`Avís en consulta OSM (${endpoint}):`, err);
    }
  }

  banner.classList.add("hidden");
  return null;
}

// Converteix els elements retornats per OpenStreetMap (tant /api/0.6/map.json com Overpass) en l'estructura dels forats
function parseOSMGolfElements(elements, course) {
  if (!elements || elements.length === 0) return null;

  const isPP = course.type === "Pitch & Putt";
  const maxDistCenter = isPP ? 700 : 1800;

  // Índex de nodes per resoldre les geometries de /api/0.6/map.json
  const nodeMap = new Map();
  elements.forEach((el) => {
    if (el.type === "node" && typeof el.lat === "number" && typeof el.lon === "number") {
      nodeMap.set(el.id, { lat: el.lat, lng: el.lon });
    }
  });

  function getWayPoints(way) {
    if (way.geometry && way.geometry.length >= 2) {
      return way.geometry.map((pt) => ({ lat: pt.lat, lng: pt.lon }));
    }
    if (way.nodes && way.nodes.length >= 2) {
      return way.nodes.map((nid) => nodeMap.get(nid)).filter(Boolean);
    }
    return [];
  }

  const holesMap = new Map();

  // 1. Extracció de línies `golf=hole`
  elements.forEach((el) => {
    if (el.type === "way" && el.tags && el.tags.golf === "hole") {
      const pts = getWayPoints(el);
      if (pts.length >= 2) {
        const firstPt = pts[0];
        const lastPt = pts[pts.length - 1];
        const length = GeoUtils.distanceMeters(firstPt, lastPt);
        const distToCourse = GeoUtils.distanceMeters({ lat: course.lat, lng: course.lng }, firstPt);

        if (distToCourse <= maxDistCenter && !(isPP && length > 165)) {
          let refNum = parseInt(el.tags.ref || el.tags.name, 10);
          if (isNaN(refNum) || refNum < 1 || refNum > course.holesCount || holesMap.has(refNum)) {
            for (let c = 1; c <= course.holesCount; c++) {
              if (!holesMap.has(c)) {
                refNum = c;
                break;
              }
            }
          }
          if (refNum >= 1 && refNum <= course.holesCount && !holesMap.has(refNum)) {
            const par = parseInt(el.tags.par, 10) || (isPP ? 3 : length < 210 ? 3 : length > 430 ? 5 : 4);
            holesMap.set(refNum, {
              number: refNum,
              par: par,
              tee: { lat: firstPt.lat, lng: firstPt.lng },
              green: { lat: lastPt.lat, lng: lastPt.lng },
              greenRadius: isPP ? 8 : 13,
              source: "OSM"
            });
          }
        }
      }
    }
  });

  if (holesMap.size === 0) return null;

  // Completem els forats (si és un camp de 9 forats a doble volta o parcialment mapejat)
  const existingList = Array.from(holesMap.values()).sort((a, b) => a.number - b.number);
  const finalHoles = [];
  for (let i = 1; i <= course.holesCount; i++) {
    if (holesMap.has(i)) {
      finalHoles.push(holesMap.get(i));
    } else {
      const baseH = existingList[(i - 1) % existingList.length];
      const offsetTee = GeoUtils.destinationPoint(baseH.tee, 3, 90);
      finalHoles.push({
        number: i,
        par: baseH.par,
        tee: { lat: offsetTee.lat, lng: offsetTee.lng },
        green: { ...baseH.green },
        greenRadius: baseH.greenRadius,
        source: "OSM"
      });
    }
  }

  return {
    holes: finalHoles,
    osmFoundCount: holesMap.size
  };
}

// Genera l'estructura dels 18 forats centrada al camp quan un camp no té forats a OSM
function generateDefaultCourseLayout(course) {
  const holes = [];
  const count = course.holesCount || 18;
  const isPP = course.type === "Pitch & Putt";
  const holeLength = isPP ? 65 : 250; // metres

  const teePt = GeoUtils.destinationPoint({ lat: course.lat, lng: course.lng }, -holeLength / 2, 0);
  const greenPt = GeoUtils.destinationPoint({ lat: course.lat, lng: course.lng }, holeLength / 2, 0);

  for (let i = 1; i <= count; i++) {
    holes.push({
      number: i,
      par: isPP ? 3 : 4,
      tee: { ...teePt },
      green: { ...greenPt },
      greenRadius: isPP ? 8 : 13,
      unmapped: true,
      source: "Pendent de marcar sobre satèl·lit"
    });
  }
  return holes;
}

// Notificació visual que confirma el desat a la pantalla
function showSaveToast(message = "✅ Canvis desats correctament!", duration = 2200) {
  const toast = document.getElementById("saveToast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.remove("hidden");
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.classList.add("hidden");
  }, duration);
}

// Sincronitza amb la base de dades al núvol de Supabase
async function saveCourseToCloud(courseId, holes, showToast = true) {
  if (!supabaseClient) return;
  try {
    const courseName = state.currentCourse ? state.currentCourse.name : "";
    const { error } = await supabaseClient
      .from("course_holes")
      .upsert(
        {
          course_id: courseId,
          course_name: courseName,
          holes: holes,
          updated_at: new Date().toISOString()
        },
        { onConflict: "course_id" }
      );

    if (error) {
      console.error("Error en sincronitzar amb Supabase:", error);
      if (showToast) {
        showSaveToast(`⚠️ Error Supabase: ${error.message || "No s'ha pogut desar"}`, 4500);
      }
    } else {
      console.log(`☁️ Dades del camp [${courseId}] sincronitzades amb Supabase.`);
      if (showToast) {
        showSaveToast(`☁️ Canvis desats a Supabase correctament!`, 2200);
      }
      const statusBadge = document.getElementById("osmStatusBadge");
      if (statusBadge && state.currentCourse && state.currentCourse.id === courseId) {
        statusBadge.textContent = "☁️ Núvol Compartit (Supabase)";
        statusBadge.className = "osm-status-badge custom";
      }
    }
  } catch (err) {
    console.error("Excepció en connectar amb Supabase:", err);
    if (showToast) {
      showSaveToast(`⚠️ Error de connexió al núvol: ${err.message || err}`, 4500);
    }
  }
}

// Recupera els forats desats al núvol per a un camp
async function fetchCourseFromCloud(courseId) {
  if (!supabaseClient) return null;
  try {
    const { data, error } = await supabaseClient
      .from("course_holes")
      .select("holes, updated_at")
      .eq("course_id", courseId)
      .maybeSingle();

    if (error) {
      console.warn("Avís en consultar Supabase:", error.message);
      return null;
    }
    if (data && Array.isArray(data.holes) && data.holes.length > 0 && !data.holes[0].unmapped) {
      return data.holes;
    }
    return null;
  } catch (err) {
    console.warn("Excepció en consultar Supabase:", err);
    return null;
  }
}

// Guarda els canvis de l'usuari tant al navegador com al núvol
function saveCourseToLocalStorage(courseId, holes, showToast = true) {
  try {
    // 1. Guardat local immediat (funciona sempre, fins i tot offline)
    localStorage.setItem(STORAGE_KEY_PREFIX + courseId, JSON.stringify(holes));

    // 2. Guardat compartit al núvol (Supabase)
    if (supabaseClient) {
      saveCourseToCloud(courseId, holes, showToast);
    } else if (showToast) {
      showSaveToast(`✅ Canvis del camp desats correctament!`);
    }
  } catch (e) {
    console.error("Error desant a localStorage:", e);
  }
}

function getCourseFromLocalStorage(courseId) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PREFIX + courseId);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

// ==========================================
// 5. CÀRREGA D'UN CAMP I RENDERITZAT DE LA INTERFÍCIE
// ==========================================
async function loadCourse(courseId, forceOSMSync = false) {
  const course = COURSES_DATA.find((c) => c.id === courseId);
  if (!course) return;

  state.currentCourse = course;
  state.currentHoleNumber = 1;
  state.selectedTeeId = course.teesAvailable[0].id;

  // Tanquem sempre el panell d'Editor en canviar de camp perquè NO salti sol sense permís
  state.editorActive = false;
  document.getElementById("btnToggleEditor").classList.remove("active");
  document.getElementById("editorPanel").classList.add("hidden");

  // Actualitza capçalera
  const badgeEl = document.getElementById("currentCourseBadge");
  badgeEl.textContent = course.type === "Pitch & Putt" ? "P&P" : "GOLF";
  badgeEl.className = "badge-type " + (course.type === "Golf" ? "golf" : "");

  document.getElementById("currentCourseName").textContent = course.name;
  document.getElementById("currentCourseSub").textContent = `${course.municipality} (${course.province}) · ${course.holesCount} forats`;

  const statusBadge = document.getElementById("osmStatusBadge");

  // 1. Primer intentem carregar les coordenades compartides des del núvol (Supabase)
  let cloudHoles = null;
  if (!forceOSMSync && supabaseClient) {
    cloudHoles = await fetchCourseFromCloud(course.id);
  }

  // 2. Comprovem si l'usuari té una còpia desada localment (memòria cau del navegador)
  const savedLocal = !forceOSMSync ? getCourseFromLocalStorage(course.id) : null;

  if (cloudHoles) {
    state.holesData = cloudHoles;
    // Actualitzem la memòria cau local per si es queda sense cobertura al camp
    try { localStorage.setItem(STORAGE_KEY_PREFIX + course.id, JSON.stringify(cloudHoles)); } catch (_) {}
    statusBadge.textContent = "☁️ Núvol Compartit (Supabase)";
    statusBadge.className = "osm-status-badge custom";
  } else if (savedLocal && savedLocal.length > 0 && !savedLocal[0].unmapped) {
    state.holesData = savedLocal;
    statusBadge.textContent = "✏️ Editat / Desat Localment";
    statusBadge.className = "osm-status-badge custom";
  } else if (course.holes && course.holes.length > 0 && !forceOSMSync) {
    // 3. Si el camp ja porta coordenades reals d'OpenStreetMap o targeta verificada precarregades
    state.holesData = JSON.parse(JSON.stringify(course.holes));
    statusBadge.textContent = course.osmVerified
      ? `📡 OpenStreetMap (${course.holes.length} forats reals)`
      : "✅ Coordenades Oficials Verificades";
    statusBadge.className = "osm-status-badge";
  } else {
    // 4. Consultem en directe l'API d'OpenStreetMap
    const osmResult = await fetchCourseHolesFromOSM(course);
    if (osmResult && osmResult.osmFoundCount > 0) {
      state.holesData = osmResult.holes;
      statusBadge.textContent = `📡 OpenStreetMap (${osmResult.osmFoundCount}/${course.holesCount} forats reals)`;
      statusBadge.className = "osm-status-badge";
    } else if (course.holes && course.holes.length > 0) {
      state.holesData = JSON.parse(JSON.stringify(course.holes));
      statusBadge.textContent = "✅ Coordenades Verificades";
      statusBadge.className = "osm-status-badge";
    } else {
      // 5. Si aquest camp encara no té els forats dibuixats a OpenStreetMap:
      // Centrem l'ortofoto satèl·lit sobre el camp sense obrir l'Editor automàticament.
      state.holesData = generateDefaultCourseLayout(course);
      statusBadge.textContent = "🛰️ Sense forats a OSM · Prem «✏️ Editor» si vols marcar-los";
      statusBadge.className = "osm-status-badge custom";
    }
  }

  renderTeeSelector();
  renderHoleNavigatorStrip();
  selectHole(1, true);
}

// Construeix els botons de barres de sortida (Tees)
function renderTeeSelector() {
  const container = document.getElementById("teeSelectorContainer");
  container.innerHTML = "";

  state.currentCourse.teesAvailable.forEach((tee) => {
    const btn = document.createElement("button");
    btn.className = "tee-chip" + (tee.id === state.selectedTeeId ? " active" : "");
    btn.innerHTML = `
      <span class="dot" style="background:${tee.color}"></span>
      <span>${tee.name}</span>
    `;
    btn.addEventListener("click", () => {
      state.selectedTeeId = tee.id;
      renderTeeSelector();
      updateHoleVisualization(false);
    });
    container.appendChild(btn);
  });
}

// Construeix la tira inferior de forats (1..18)
function renderHoleNavigatorStrip() {
  const strip = document.getElementById("holeStripContainer");
  strip.innerHTML = "";

  state.holesData.forEach((hole) => {
    const btn = document.createElement("button");
    btn.className = "hole-num-btn" + (hole.number === state.currentHoleNumber ? " active" : "");
    btn.textContent = hole.number;
    btn.addEventListener("click", () => {
      selectHole(hole.number, true);
    });
    strip.appendChild(btn);
  });
}

// Selecciona un forat concret i centra/orienta el mapa
function selectHole(holeNumber, flyToHole = true) {
  const count = state.holesData.length;
  if (holeNumber < 1) holeNumber = count;
  if (holeNumber > count) holeNumber = 1;

  state.currentHoleNumber = holeNumber;
  const hole = getCurrentHole();

  // Actualitza textos de la interfície
  document.getElementById("holeNumberDisplay").textContent = hole.number;
  const hcpText = hole.hcp ? ` · Hcp ${hole.hcp}` : "";
  const offText = hole.officialMeters ? ` · Targeta: ${hole.officialMeters}m` : "";
  document.getElementById("holeParDisplay").textContent = `Par ${hole.par || 3}${hcpText}${offText}`;
  document.getElementById("editorHoleNum").textContent = hole.number;
  document.getElementById("selectHolePar").value = String(hole.par || 3);

  const statusBadge = document.getElementById("osmStatusBadge");
  if (hole.description) {
    statusBadge.textContent = `📋 ${hole.description}`;
    statusBadge.className = "osm-status-badge";
  }

  // Ressalta el botó actiu a la barra inferior
  const buttons = document.querySelectorAll(".hole-num-btn");
  buttons.forEach((btn, idx) => {
    btn.classList.toggle("active", idx + 1 === holeNumber);
    if (idx + 1 === holeNumber) {
      btn.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  });

  // Posiciona el punter mòbil 🎯 a 55% del camí entre el Tee i el Green
  const effectiveTee = getEffectiveTeePosition(hole);
  state.targetPosition = GeoUtils.interpolate(effectiveTee, hole.green, 0.55);

  updateHoleVisualization(flyToHole);
}

function getCurrentHole() {
  return (
    state.holesData.find((h) => h.number === state.currentHoleNumber) ||
    state.holesData[0]
  );
}

// Calcula la posició exacta de la sortida segons el Tee seleccionat (Llarga/FCPP, Curta/EPPA, etc.)
function getEffectiveTeePosition(hole) {
  const teeMeta =
    state.currentCourse.teesAvailable.find((t) => t.id === state.selectedTeeId) ||
    state.currentCourse.teesAvailable[0];

  if (!teeMeta) {
    return { ...hole.tee };
  }

  // Si és la sortida curta EPPA i el forat té definida una distància EPPA específica (ex: Oller del Mas Forat 2: 115m -> 55m EPPA)
  if (teeMeta.isEppa && hole.eppaMeters && hole.officialMeters && hole.eppaMeters < hole.officialMeters) {
    const advanceMeters = hole.officialMeters - hole.eppaMeters;
    const bearingTeeToGreen = GeoUtils.bearingDegrees(hole.tee, hole.green);
    return GeoUtils.destinationPoint(hole.tee, advanceMeters, bearingTeeToGreen);
  }

  if (!teeMeta.offsetMeters) {
    return { ...hole.tee };
  }

  // Movem el punt de sortida al llarg de l'eix Green -> Tee segons l'offset de la barra
  const bearingTeeToGreen = GeoUtils.bearingDegrees(hole.tee, hole.green);
  // Un offset negatiu (ex: sortida groga/vermella més avançada) apropa el tee al green
  return GeoUtils.destinationPoint(hole.tee, -teeMeta.offsetMeters, bearingTeeToGreen);
}

// ==========================================
// 6. DIBUIX DEL FORAT, MARCADORS I PUNTER MÒBIL AL MAPA
// ==========================================
function updateHoleVisualization(animateCamera = false) {
  if (!map || !map.isStyleLoaded()) return;

  const hole = getCurrentHole();
  if (!hole) return;

  // Si el forat encara no està cartografiat sobre el camp, no dibuixem línies o marcadors falsos al mig del camp
  if (hole.unmapped) {
    map.getSource("green-area-source").setData({
      type: "FeatureCollection",
      features: []
    });
    map.getSource("rangefinder-line-source").setData({
      type: "FeatureCollection",
      features: []
    });
    if (teeMarker) { teeMarker.remove(); teeMarker = null; }
    if (greenMarker) { greenMarker.remove(); greenMarker = null; }
    if (targetMarker) { targetMarker.remove(); targetMarker = null; }

    const elTeeTarget = document.getElementById("distTeeToTarget");
    if (elTeeTarget) elTeeTarget.innerHTML = `--<small>m</small>`;
    const elTargetGreen = document.getElementById("distTargetToGreen");
    if (elTargetGreen) elTargetGreen.innerHTML = `--<small>m</small>`;
    document.getElementById("distGreenFront").textContent = `--m`;
    document.getElementById("distGreenCenter").textContent = `--m`;
    document.getElementById("distGreenBack").textContent = `--m`;

    const statusBadge = document.getElementById("osmStatusBadge");
    statusBadge.textContent = "🛰️ Forat pendent de marcar a OSM · Prem «✏️ Editar Forats» per situar-lo";
    statusBadge.className = "osm-status-badge custom";

    updateCourseOverviewLayer();

    if (animateCamera) {
      orientCameraToHole(null, null);
    }
    return;
  }

  const effectiveTee = getEffectiveTeePosition(hole);
  const greenCenter = hole.green;
  const greenRadius = hole.greenRadius || (state.currentCourse.type === "Pitch & Putt" ? 9 : 13);

  if (!state.targetPosition) {
    state.targetPosition = GeoUtils.interpolate(effectiveTee, greenCenter, 0.55);
  }

  // 1. Actualitza el polígon del Green
  const greenPolygon = GeoUtils.createCirclePolygon(greenCenter, greenRadius);
  map.getSource("green-area-source").setData({
    type: "FeatureCollection",
    features: [greenPolygon]
  });

  // 2. Actualitza les línies del telèmetre (Tee -> Punter -> Green)
  const rangefinderFeatures = [
    {
      type: "Feature",
      properties: { segment: "direct" },
      geometry: {
        type: "LineString",
        coordinates: [
          [effectiveTee.lng, effectiveTee.lat],
          [greenCenter.lng, greenCenter.lat]
        ]
      }
    },
    {
      type: "Feature",
      properties: { segment: "tee-target" },
      geometry: {
        type: "LineString",
        coordinates: [
          [effectiveTee.lng, effectiveTee.lat],
          [state.targetPosition.lng, state.targetPosition.lat]
        ]
      }
    },
    {
      type: "Feature",
      properties: { segment: "target-green" },
      geometry: {
        type: "LineString",
        coordinates: [
          [state.targetPosition.lng, state.targetPosition.lat],
          [greenCenter.lng, greenCenter.lat]
        ]
      }
    }
  ];

  map.getSource("rangefinder-line-source").setData({
    type: "FeatureCollection",
    features: rangefinderFeatures
  });

  // 3. Crea o actualitza els marcadors (Tee, Green i Punter Mòbil 🎯)
  updateDOMMarkers(effectiveTee, greenCenter);

  // 4. Calcula i mostra totes les distàncies en metres
  updateDistancesHUD(effectiveTee, state.targetPosition, greenCenter, greenRadius);

  // 5. Dibuixa la vista general si estem en mode Camp
  updateCourseOverviewLayer();

  // 6. Orienta i enfoca la càmera
  if (animateCamera) {
    if (state.viewMode === "hole") {
      orientCameraToHole(effectiveTee, greenCenter);
    } else {
      fitCameraToEntireCourse();
    }
  }
}

function updateDOMMarkers(effectiveTee, greenCenter) {
  const teeMeta =
    state.currentCourse.teesAvailable.find((t) => t.id === state.selectedTeeId) ||
    state.currentCourse.teesAvailable[0];

  // Marcador de TEE
  if (!teeMarker) {
    const el = document.createElement("div");
    el.className = "marker-tee";
    el.textContent = "T";
    el.title = "Tee de sortida (Arrossega per ajustar)";
    teeMarker = new maplibregl.Marker({ element: el, draggable: true })
      .setLngLat([effectiveTee.lng, effectiveTee.lat])
      .addTo(map);

    teeMarker.on("drag", () => {
      const lngLat = teeMarker.getLngLat();
      const hole = getCurrentHole();
      hole.tee = { lat: lngLat.lat, lng: lngLat.lng };
      updateHoleVisualization(false);
    });

    teeMarker.on("dragend", () => {
      saveCourseToLocalStorage(state.currentCourse.id, state.holesData);
      markAsCustomEdited();
    });
  } else {
    teeMarker.setLngLat([effectiveTee.lng, effectiveTee.lat]);
  }
  teeMarker.getElement().style.backgroundColor = teeMeta.color;
  teeMarker.getElement().style.color = teeMeta.textColor;

  // Marcador de GREEN (Bandera)
  if (!greenMarker) {
    const el = document.createElement("div");
    el.className = "marker-green";
    el.textContent = "⛳";
    el.title = "Centre de Green (Arrossega per ajustar)";
    greenMarker = new maplibregl.Marker({ element: el, draggable: true })
      .setLngLat([greenCenter.lng, greenCenter.lat])
      .addTo(map);

    greenMarker.on("drag", () => {
      const lngLat = greenMarker.getLngLat();
      const hole = getCurrentHole();
      hole.green = { lat: lngLat.lat, lng: lngLat.lng };
      updateHoleVisualization(false);
    });

    greenMarker.on("dragend", () => {
      saveCourseToLocalStorage(state.currentCourse.id, state.holesData);
      markAsCustomEdited();
    });
  } else {
    greenMarker.setLngLat([greenCenter.lng, greenCenter.lat]);
  }

  // Marcador de PUNTER MÒBIL (Target Crosshair 🎯)
  if (!targetMarker) {
    const el = document.createElement("div");
    el.className = "marker-target";
    el.innerHTML = `
      <div class="target-floating-pill" id="targetFloatingPill">--m</div>
      <div class="target-ring">
        <div class="target-center-dot"></div>
      </div>
    `;
    targetPillEl = el.querySelector("#targetFloatingPill");

    targetMarker = new maplibregl.Marker({ element: el, draggable: true })
      .setLngLat([state.targetPosition.lng, state.targetPosition.lat])
      .addTo(map);

    targetMarker.on("drag", () => {
      const lngLat = targetMarker.getLngLat();
      state.targetPosition = { lat: lngLat.lat, lng: lngLat.lng };
      updateHoleVisualization(false);
    });
  } else {
    targetMarker.setLngLat([state.targetPosition.lng, state.targetPosition.lat]);
  }
}

// Calcula totes les distàncies en temps real i actualitza els panells
function updateDistancesHUD(teePt, targetPt, greenPt, greenRadius) {
  const distTeeTarget = Math.round(GeoUtils.distanceMeters(teePt, targetPt));
  const distTargetGreen = Math.round(GeoUtils.distanceMeters(targetPt, greenPt));
  const distCenter = Math.round(GeoUtils.distanceMeters(teePt, greenPt));
  const distFront = Math.max(1, Math.round(distCenter - greenRadius));
  const distBack = Math.round(distCenter + greenRadius);

  const elTeeTarget = document.getElementById("distTeeToTarget");
  if (elTeeTarget) elTeeTarget.innerHTML = `${distTeeTarget}<small>m</small>`;
  const elTargetGreen = document.getElementById("distTargetToGreen");
  if (elTargetGreen) elTargetGreen.innerHTML = `${distTargetGreen}<small>m</small>`;

  document.getElementById("distGreenFront").textContent = `${distFront}m`;
  document.getElementById("distGreenCenter").textContent = `${distCenter}m`;
  document.getElementById("distGreenBack").textContent = `${distBack}m`;

  if (targetPillEl) {
    targetPillEl.textContent = `🎯 ${distTeeTarget}m | ⛳ ${distTargetGreen}m`;
  }
}

// Orienta el mapa perquè el Tee estigui a la part inferior i el Green a la part superior
function orientCameraToHole(teePt, greenPt) {
  const hole = getCurrentHole();

  // Si el forat encara no està mapejat a OSM, mostrem la vista aèria general del camp en orientació Nord
  // perquè l'usuari vegi tot el camp real i pugui fer clic al Tee i al Green fàcilment
  if (hole && hole.unmapped) {
    map.flyTo({
      center: [state.currentCourse.lng, state.currentCourse.lat],
      zoom: state.currentCourse.type === "Pitch & Putt" ? 17.4 : 15.8,
      bearing: 0,
      pitch: 0,
      duration: 900,
      essential: true
    });
    return;
  }

  const bearing = GeoUtils.bearingDegrees(teePt, greenPt);
  const midPt = GeoUtils.interpolate(teePt, greenPt, 0.48);
  const dist = GeoUtils.distanceMeters(teePt, greenPt);

  // Ajustem el nivell de zoom automàticament segons la llargada del forat
  let targetZoom = 18.6;
  if (dist > 350) targetZoom = 16.4;
  else if (dist > 200) targetZoom = 17.0;
  else if (dist > 110) targetZoom = 17.8;
  else if (dist > 75) targetZoom = 18.3;

  map.flyTo({
    center: [midPt.lng, midPt.lat],
    zoom: targetZoom,
    bearing: bearing,
    pitch: 0,
    duration: 900,
    essential: true
  });
}

// Mostra tots els 18 forats en vista general del camp
function updateCourseOverviewLayer() {
  // Netegem marcadors d'etiquetes anteriors
  courseOverviewMarkers.forEach((m) => m.remove());
  courseOverviewMarkers = [];

  if (state.viewMode !== "course") {
    map.getSource("course-overview-source").setData({
      type: "FeatureCollection",
      features: []
    });
    return;
  }

  const features = [];
  state.holesData.forEach((h) => {
    if (h.unmapped) return; // No dibuixem línies falses per als forats no mapejats
    features.push({
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: [
          [h.tee.lng, h.tee.lat],
          [h.green.lng, h.green.lat]
        ]
      }
    });

    const mid = GeoUtils.interpolate(h.tee, h.green, 0.5);
    const dist = Math.round(GeoUtils.distanceMeters(h.tee, h.green));
    const badge = document.createElement("div");
    badge.className = "course-hole-badge" + (h.number === state.currentHoleNumber ? " active" : "");
    badge.textContent = `F${h.number} · ${dist}m`;
    badge.title = `Obrir Forat ${h.number} (${dist}m)`;
    badge.addEventListener("click", (e) => {
      e.stopPropagation();
      setViewMode("hole");
      selectHole(h.number, true);
    });

    const marker = new maplibregl.Marker({ element: badge })
      .setLngLat([mid.lng, mid.lat])
      .addTo(map);
    courseOverviewMarkers.push(marker);
  });

  map.getSource("course-overview-source").setData({
    type: "FeatureCollection",
    features
  });
}

function fitCameraToEntireCourse() {
  if (!state.holesData.length) return;
  const bounds = new maplibregl.LngLatBounds();
  state.holesData.forEach((h) => {
    bounds.extend([h.tee.lng, h.tee.lat]);
    bounds.extend([h.green.lng, h.green.lat]);
  });

  map.fitBounds(bounds, {
    padding: { top: 70, bottom: 160, left: 50, right: 70 },
    bearing: 0,
    duration: 900
  });
}

function setViewMode(mode) {
  state.viewMode = mode;
  document.getElementById("btnViewHole").classList.toggle("active", mode === "hole");
  document.getElementById("btnViewCourse").classList.toggle("active", mode === "course");
  updateHoleVisualization(true);
}

// ==========================================
// 7. MODE EDITOR DE FORATS (Per a camps incomplets a OSM)
// ==========================================
function applyEditorClick(clickedPt) {
  const hole = getCurrentHole();
  if (!hole) return;

  if (state.editorClickMode === "tee") {
    hole.tee = clickedPt;
    hole.unmapped = false;
    // Passem automàticament a marcar el Green per fer-ho molt ràpid
    setEditorClickMode("green");
  } else {
    hole.green = clickedPt;
    hole.unmapped = false;
    // Recalculem el punter al mig del nou forat
    state.targetPosition = GeoUtils.interpolate(hole.tee, hole.green, 0.55);
    setEditorClickMode("tee");
  }

  saveCourseToLocalStorage(state.currentCourse.id, state.holesData);
  markAsCustomEdited();
  updateHoleVisualization(false);
}

function setEditorClickMode(mode) {
  state.editorClickMode = mode;
  document.getElementById("btnSetTeeMode").classList.toggle("active", mode === "tee");
  document.getElementById("btnSetGreenMode").classList.toggle("active", mode === "green");
}

function markAsCustomEdited() {
  const statusBadge = document.getElementById("osmStatusBadge");
  if (supabaseClient) {
    statusBadge.textContent = "☁️ Desat al Núvol (Supabase)";
  } else {
    statusBadge.textContent = "✏️ Editat i Desat (Local)";
  }
  statusBadge.className = "osm-status-badge custom";
}

// ==========================================
// 8. MODAL DE SELECCIÓ DE CAMP (FCPP i FCGolf)
// ==========================================
let currentCategoryFilter = "ALL";

function renderCourseModalList() {
  const searchQuery = document.getElementById("courseSearchInput").value.trim().toLowerCase();
  const listContainer = document.getElementById("courseListContainer");
  listContainer.innerHTML = "";

  const countAll = COURSES_DATA.length;
  const countPP = COURSES_DATA.filter((c) => c.type === "Pitch & Putt").length;
  const countGolf = COURSES_DATA.filter((c) => c.type === "Golf").length;
  const countVerified = COURSES_DATA.filter((c) => c.holes && c.holes.length > 0).length;

  document.getElementById("countAll").textContent = countAll;
  document.getElementById("countPP").textContent = countPP;
  document.getElementById("countGolf").textContent = countGolf;
  const countVerEl = document.getElementById("countVerified");
  if (countVerEl) countVerEl.textContent = countVerified;

  const filtered = COURSES_DATA.filter((c) => {
    let matchesCategory = false;
    if (currentCategoryFilter === "ALL") {
      matchesCategory = true;
    } else if (currentCategoryFilter === "VERIFIED") {
      matchesCategory = !!(c.holes && c.holes.length > 0);
    } else {
      matchesCategory = c.type === currentCategoryFilter;
    }
    const matchesText =
      c.name.toLowerCase().includes(searchQuery) ||
      c.municipality.toLowerCase().includes(searchQuery) ||
      c.province.toLowerCase().includes(searchQuery);
    return matchesCategory && matchesText;
  }).sort((a, b) => {
    const aHas = (a.holes && a.holes.length > 0) ? 1 : 0;
    const bHas = (b.holes && b.holes.length > 0) ? 1 : 0;
    return bHas - aHas;
  });

  filtered.forEach((course) => {
    const item = document.createElement("div");
    const isSelected = state.currentCourse && state.currentCourse.id === course.id;
    item.className = "course-item" + (isSelected ? " selected" : "");

    const savedLocal = getCourseFromLocalStorage(course.id);
    const hasSavedLocal = !!(savedLocal && savedLocal.length > 0 && !savedLocal[0].unmapped);
    const statusText = hasSavedLocal
      ? "✏️ Personalitzat"
      : (course.holes && course.holes.length > 0)
      ? `⭐ ${course.holes.length} Forats Verificats`
      : "🛰️ Satèl·lit Lliure (Sense OSM)";

    item.innerHTML = `
      <div class="course-item-info">
        <div class="course-item-title">
          <span class="badge-type ${course.type === "Golf" ? "golf" : ""}">${
      course.type === "Pitch & Putt" ? "P&P" : "GOLF"
    }</span>
          <span>${course.name}</span>
        </div>
        <div class="course-item-meta">
          📍 ${course.municipality} (${course.province}) · ${course.holesCount} forats · ${course.federation}
        </div>
      </div>
      <div class="course-item-right">
        ${statusText}
      </div>
    `;

    item.addEventListener("click", () => {
      document.getElementById("courseModal").classList.add("hidden");
      loadCourse(course.id);
    });

    listContainer.appendChild(item);
  });
}

// ==========================================
// 9. ESDEVENIMENTS DE LA INTERFÍCIE D'USUARI
// ==========================================
function setupUIEvents() {
  // Obrir/Tancar Modal de Camps
  document.getElementById("openCourseModalBtn").addEventListener("click", () => {
    renderCourseModalList();
    document.getElementById("courseModal").classList.remove("hidden");
    document.getElementById("courseSearchInput").focus();
  });

  document.getElementById("closeCourseModalBtn").addEventListener("click", () => {
    document.getElementById("courseModal").classList.add("hidden");
  });

  document.getElementById("courseSearchInput").addEventListener("input", () => {
    renderCourseModalList();
  });

  document.querySelectorAll(".filter-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".filter-tab").forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      currentCategoryFilter = tab.dataset.filter;
      renderCourseModalList();
    });
  });

  // Navegació Forat Anterior / Següent
  document.getElementById("btnPrevHole").addEventListener("click", () => {
    selectHole(state.currentHoleNumber - 1, true);
  });

  document.getElementById("btnNextHole").addEventListener("click", () => {
    selectHole(state.currentHoleNumber + 1, true);
  });

  // Canvi de Vista: Forat vs Camp Complet
  document.getElementById("btnViewHole").addEventListener("click", () => setViewMode("hole"));
  document.getElementById("btnViewCourse").addEventListener("click", () => setViewMode("course"));

  // Botons flotants del mapa
  document.getElementById("btnResetTarget").addEventListener("click", () => {
    const hole = getCurrentHole();
    const effectiveTee = getEffectiveTeePosition(hole);
    state.targetPosition = GeoUtils.interpolate(effectiveTee, hole.green, 0.55);
    updateHoleVisualization(false);
  });

  document.getElementById("btnOrientHole").addEventListener("click", () => {
    const hole = getCurrentHole();
    const effectiveTee = getEffectiveTeePosition(hole);
    orientCameraToHole(effectiveTee, hole.green);
  });

  document.getElementById("btnSatelliteSource").addEventListener("click", () => {
    state.satelliteProvider = state.satelliteProvider === "ICGC" ? "ESRI" : "ICGC";
    const vis = state.satelliteProvider === "ICGC" ? "visible" : "none";
    map.setLayoutProperty("icgc-layer", "visibility", vis);
    document.getElementById("satSourceTag").textContent = state.satelliteProvider;
  });

  document.getElementById("btnSyncOSM").addEventListener("click", () => {
    if (state.currentCourse) {
      loadCourse(state.currentCourse.id, true);
    }
  });

  // Mode Editor
  const editorBtn = document.getElementById("btnToggleEditor");
  const editorPanel = document.getElementById("editorPanel");

  editorBtn.addEventListener("click", () => {
    state.editorActive = !state.editorActive;
    editorBtn.classList.toggle("active", state.editorActive);
    editorPanel.classList.toggle("hidden", !state.editorActive);
  });

  const btnSaveAndClose = document.getElementById("btnSaveAndCloseEditor");
  if (btnSaveAndClose) {
    btnSaveAndClose.addEventListener("click", () => {
      saveCourseToLocalStorage(state.currentCourse.id, state.holesData, false);
      markAsCustomEdited();
      showSaveToast(`✅ Forat ${state.currentHoleNumber} desat correctament!`);
      state.editorActive = false;
      editorBtn.classList.remove("active");
      editorPanel.classList.add("hidden");
    });
  }

  document.getElementById("btnCloseEditor").addEventListener("click", () => {
    saveCourseToLocalStorage(state.currentCourse.id, state.holesData, false);
    showSaveToast(`✅ Forat ${state.currentHoleNumber} desat!`);
    state.editorActive = false;
    editorBtn.classList.remove("active");
    editorPanel.classList.add("hidden");
  });

  document.getElementById("btnSetTeeMode").addEventListener("click", () => setEditorClickMode("tee"));
  document.getElementById("btnSetGreenMode").addEventListener("click", () => setEditorClickMode("green"));

  document.getElementById("selectHolePar").addEventListener("change", (e) => {
    const hole = getCurrentHole();
    hole.par = parseInt(e.target.value, 10) || 3;
    document.getElementById("holeParDisplay").textContent = `Par ${hole.par}`;
    saveCourseToLocalStorage(state.currentCourse.id, state.holesData);
  });

  document.getElementById("btnAutoGenerateGrid").addEventListener("click", () => {
    const center = map.getCenter();
    const tempCourse = {
      ...state.currentCourse,
      lat: center.lat,
      lng: center.lng
    };
    state.holesData = generateDefaultCourseLayout(tempCourse);
    saveCourseToLocalStorage(state.currentCourse.id, state.holesData);
    markAsCustomEdited();
    selectHole(1, true);
  });

  // Exportar i Importar JSON de coordenades del camp
  document.getElementById("btnExportJSON").addEventListener("click", () => {
    const exportObj = {
      courseId: state.currentCourse.id,
      courseName: state.currentCourse.name,
      exportedAt: new Date().toISOString(),
      holes: state.holesData
    };
    const blob = new Blob([JSON.stringify(exportObj, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${state.currentCourse.id}_forats.json`;
    a.click();
    URL.revokeObjectURL(url);
  });

  document.getElementById("btnImportJSON").addEventListener("click", () => {
    document.getElementById("fileImportInput").click();
  });

  document.getElementById("fileImportInput").addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target.result);
        const holesArray = Array.isArray(parsed) ? parsed : parsed.holes;
        if (Array.isArray(holesArray) && holesArray.length > 0) {
          state.holesData = holesArray;
          saveCourseToLocalStorage(state.currentCourse.id, state.holesData);
          markAsCustomEdited();
          renderHoleNavigatorStrip();
          selectHole(1, true);
        }
      } catch (err) {
        alert("El fitxer JSON no té un format vàlid.");
      }
    };
    reader.readAsText(file);
  });
}

// Arrencada
window.addEventListener("DOMContentLoaded", () => {
  setupUIEvents();
  initMap();
});
