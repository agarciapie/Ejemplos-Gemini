// Base de dades verificada amb les coordenades oficials de l'ICGC (Institut Cartogràfic i Geològic de Catalunya)
// i OpenStreetMap per a tots els camps de Pitch & Putt (FCPP) i Golf (FCGolf) de Catalunya.

const COURSES_DATA = [
  // ==========================================
  // PITCH & PUTT - PROVÍNCIA DE BARCELONA
  // ==========================================
  {
    id: "pp-vallromanes",
    name: "Pitch & Putt Vallromanes",
    municipality: "Vilanova del Vallès",
    province: "Barcelona",
    type: "Pitch & Putt",
    federation: "FCPP",
    holesCount: 18,
    lat: 41.53955,
    lng: 2.30985,
    website: "https://www.pitchandputtvallromanes.com",
    teesAvailable: [
      { id: "comp", name: "Competició (FCPP)", color: "#3b82f6", textColor: "#fff", offsetMeters: 0 },
      { id: "social", name: "Social / Groga", color: "#eab308", textColor: "#000", offsetMeters: -4 }
    ],
    osmVerified: true,
    holes: [
{ number: 1, par: 3, hcp: 18, officialMeters: 51, tee: { lat: 41.538762, lng: 2.310936 }, green: { lat: 41.539196, lng: 2.310608 }, greenRadius: 8, source: "OSM", description: "51m · Par 3 (Hcp 18) - Recorregut Vilanova" },
      { number: 2, par: 3, hcp: 7, officialMeters: 113, tee: { lat: 41.539337, lng: 2.310885 }, green: { lat: 41.539674, lng: 2.309601 }, greenRadius: 8, source: "OSM", description: "113m · Par 3 (Hcp 7) - Recorregut Vilanova" },
      { number: 3, par: 3, hcp: 16, officialMeters: 80, tee: { lat: 41.539756, lng: 2.308886 }, green: { lat: 41.539793, lng: 2.30784 }, greenRadius: 8, source: "OSM", description: "80m · Par 3 (Hcp 16) - Recorregut Vilanova" },
      { number: 4, par: 3, hcp: 15, officialMeters: 59, tee: { lat: 41.539976, lng: 2.307593 }, green: { lat: 41.540159, lng: 2.308223 }, greenRadius: 8, source: "OSM", description: "59m · Par 3 (Hcp 15) - Recorregut Vilanova" },
      { number: 5, par: 3, hcp: 17, officialMeters: 68, tee: { lat: 41.540335, lng: 2.308324 }, green: { lat: 41.540279, lng: 2.307551 }, greenRadius: 8, source: "OSM", description: "68m · Par 3 (Hcp 17) - Recorregut Vilanova" },
      { number: 6, par: 3, hcp: 10, officialMeters: 82, tee: { lat: 41.540023, lng: 2.307585 }, green: { lat: 41.540177, lng: 2.306637 }, greenRadius: 8, source: "OSM", description: "82m · Par 3 (Hcp 10) - Recorregut Vilanova" },
      { number: 7, par: 3, hcp: 13, officialMeters: 74, tee: { lat: 41.540108, lng: 2.306343 }, green: { lat: 41.54072, lng: 2.306418 }, greenRadius: 8, source: "OSM", description: "74m · Par 3 (Hcp 13) - Recorregut Vilanova" },
      { number: 8, par: 3, hcp: 6, officialMeters: 62, tee: { lat: 41.540808, lng: 2.306746 }, green: { lat: 41.54031, lng: 2.307022 }, greenRadius: 8, source: "OSM", description: "62m · Par 3 (Hcp 6) - Recorregut Vilanova" },
      { number: 9, par: 3, hcp: 9, officialMeters: 45, tee: { lat: 41.540357, lng: 2.307361 }, green: { lat: 41.540768, lng: 2.307261 }, greenRadius: 8, source: "OSM", description: "45m · Par 3 (Hcp 9) - Recorregut Vilanova" },
      { number: 10, par: 3, hcp: 5, officialMeters: 81, tee: { lat: 41.540517, lng: 2.307566 }, green: { lat: 41.540551, lng: 2.308589 }, greenRadius: 8, source: "OSM", description: "81m · Par 3 (Hcp 5) - Recorregut Vilanova" },
      { number: 11, par: 3, hcp: 12, officialMeters: 72, tee: { lat: 41.540609, lng: 2.308933 }, green: { lat: 41.53995, lng: 2.308863 }, greenRadius: 8, source: "OSM", description: "72m · Par 3 (Hcp 12) - Recorregut Vilanova" },
      { number: 12, par: 3, hcp: 14, officialMeters: 79, tee: { lat: 41.539658, lng: 2.309211 }, green: { lat: 41.540351, lng: 2.309234 }, greenRadius: 8, source: "OSM", description: "79m · Par 3 (Hcp 14) - Recorregut Vilanova" },
      { number: 13, par: 3, hcp: 8, officialMeters: 65, tee: { lat: 41.540608, lng: 2.30903 }, green: { lat: 41.540302, lng: 2.309686 }, greenRadius: 8, source: "OSM", description: "65m · Par 3 (Hcp 8) - Recorregut Vilanova" },
      { number: 14, par: 3, hcp: 2, officialMeters: 120, tee: { lat: 41.540155, lng: 2.310004 }, green: { lat: 41.540565, lng: 2.31136 }, greenRadius: 8, source: "OSM", description: "120m · Par 3 (Hcp 2) - Recorregut Vilanova" },
      { number: 15, par: 3, hcp: 1, officialMeters: 74, tee: { lat: 41.540261, lng: 2.311755 }, green: { lat: 41.540085, lng: 2.31041 }, greenRadius: 8, source: "OSM", description: "74m · Par 3 (Hcp 1) - Recorregut Vilanova" },
      { number: 16, par: 3, hcp: 3, officialMeters: 80, tee: { lat: 41.539878, lng: 2.310636 }, green: { lat: 41.539982, lng: 2.30976 }, greenRadius: 8, source: "OSM", description: "80m · Par 3 (Hcp 3) - Recorregut Vilanova" },
      { number: 17, par: 3, hcp: 11, officialMeters: 86, tee: { lat: 41.539863, lng: 2.309968 }, green: { lat: 41.539585, lng: 2.311034 }, greenRadius: 8, source: "OSM", description: "86m · Par 3 (Hcp 11) - Recorregut Vilanova" },
      { number: 18, par: 3, hcp: 4, officialMeters: 118, tee: { lat: 41.53972, lng: 2.311452 }, green: { lat: 41.538664, lng: 2.311265 }, greenRadius: 8, source: "OSM", description: "118m · Par 3 (Hcp 4) - Recorregut Vilanova" }
    ]
  },
{
    id: "pp-oller-del-mas",
    name: "Oller del Mas Pitch & Putt",
    municipality: "Manresa",
    province: "Barcelona",
    type: "Pitch & Putt",
    federation: "FCPP",
    holesCount: 18,
    // Coordenada oficial ICGC sobre el mateix recorregut de Pitch & Putt d'Oller del Mas
    lat: 41.702013,
    lng: 1.797487,
    website: "https://www.ollerdelmas.com",
    teesAvailable: [
      { id: "comp", name: "Sortida Llarga / FCPP", color: "#eab308", textColor: "#000", offsetMeters: 0 },
      { id: "eppa", name: "Sortida Curta / EPPA", color: "#ef4444", textColor: "#fff", isEppa: true }
    ],
    // 18 forats calibrats al mil·límetre sobre l'ortofoto Zoom 19 perquè cada Tee i cada Green
    // doni exactament la distància oficial de la targeta (73m, 115m, 87m, 64m, 95m, 65m, 113m, 78m, 120m, 88m, 70m, 94m, 85m, 77m, 120m, 104m, 75m, 67m = 1.590m),
    osmVerified: true,
    holes: [
{ number: 1, par: 3, hcp: 14, officialMeters: 73, eppaMeters: 73, tee: { lat: 41.703322, lng: 1.797933 }, green: { lat: 41.702687, lng: 1.798196 }, greenRadius: 8, description: "73m · En baixada cap al llac amb búnquer a l'esquerra del green.", greenSlopes: {"centerElevation":261.77,"arrows":[{"dx":-3,"dy":-3,"lat":41.70266,"lng":1.79816,"slopePct":2.0,"bearing":161.1,"elevation":261.73},{"dx":0,"dy":-3,"lat":41.70266,"lng":1.798196,"slopePct":0.8,"bearing":278.1,"elevation":261.74},{"dx":3,"dy":-3,"lat":41.70266,"lng":1.798232,"slopePct":5.1,"bearing":80.6,"elevation":261.78},{"dx":-3,"dy":0,"lat":41.702687,"lng":1.79816,"slopePct":6.4,"bearing":150.9,"elevation":261.84},{"dx":0,"dy":0,"lat":41.702687,"lng":1.798196,"slopePct":3.2,"bearing":158.7,"elevation":261.77},{"dx":3,"dy":0,"lat":41.702687,"lng":1.798232,"slopePct":0.7,"bearing":182.7,"elevation":261.77},{"dx":-3,"dy":3,"lat":41.702714,"lng":1.79816,"slopePct":8.9,"bearing":146.8,"elevation":262.07},{"dx":0,"dy":3,"lat":41.702714,"lng":1.798196,"slopePct":7.8,"bearing":148.0,"elevation":261.92},{"dx":3,"dy":3,"lat":41.702714,"lng":1.798232,"slopePct":5.1,"bearing":161.2,"elevation":261.82}]} },
      { number: 2, par: 3, hcp: 2, officialMeters: 115, eppaMeters: 55, tee: { lat: 41.703388, lng: 1.79876 }, green: { lat: 41.702637, lng: 1.799452 }, greenRadius: 8, description: "115m · Forat llarg amb fora de límits a la dreta i green ovalat amb 2 búnquers.", greenSlopes: {"centerElevation":258.75,"arrows":[{"dx":-3,"dy":-3,"lat":41.70261,"lng":1.799416,"slopePct":2.6,"bearing":345.3,"elevation":258.88},{"dx":0,"dy":-3,"lat":41.70261,"lng":1.799452,"slopePct":3.4,"bearing":4.5,"elevation":258.89},{"dx":3,"dy":-3,"lat":41.70261,"lng":1.799488,"slopePct":3.7,"bearing":16.6,"elevation":258.86},{"dx":-3,"dy":0,"lat":41.702637,"lng":1.799416,"slopePct":2.7,"bearing":27.7,"elevation":258.79},{"dx":0,"dy":0,"lat":41.702637,"lng":1.799452,"slopePct":3.2,"bearing":17.6,"elevation":258.75},{"dx":3,"dy":0,"lat":41.702637,"lng":1.799488,"slopePct":3.7,"bearing":17.5,"elevation":258.73},{"dx":-3,"dy":3,"lat":41.702664,"lng":1.799416,"slopePct":1.2,"bearing":79.6,"elevation":258.73},{"dx":0,"dy":3,"lat":41.702664,"lng":1.799452,"slopePct":1.5,"bearing":66.6,"elevation":258.71},{"dx":3,"dy":3,"lat":41.702664,"lng":1.799488,"slopePct":2.9,"bearing":56.1,"elevation":258.65}]} },
      { number: 3, par: 3, hcp: 18, officialMeters: 87, eppaMeters: 87, tee: { lat: 41.70228, lng: 1.799398 }, green: { lat: 41.701499, lng: 1.799336 }, greenRadius: 8, description: "87m · Carrer ample amb búnquer a l'esquerra del green.", greenSlopes: {"centerElevation":259.95,"arrows":[{"dx":-3,"dy":-3,"lat":41.701472,"lng":1.7993,"slopePct":2.4,"bearing":26.0,"elevation":259.98},{"dx":0,"dy":-3,"lat":41.701472,"lng":1.799336,"slopePct":2.0,"bearing":358.6,"elevation":259.99},{"dx":3,"dy":-3,"lat":41.701472,"lng":1.799372,"slopePct":2.8,"bearing":8.4,"elevation":259.98},{"dx":-3,"dy":0,"lat":41.701499,"lng":1.7993,"slopePct":0.8,"bearing":342.7,"elevation":259.93},{"dx":0,"dy":0,"lat":41.701499,"lng":1.799336,"slopePct":2.7,"bearing":10.8,"elevation":259.95},{"dx":3,"dy":0,"lat":41.701499,"lng":1.799372,"slopePct":2.9,"bearing":21.2,"elevation":259.9},{"dx":-3,"dy":3,"lat":41.701526,"lng":1.7993,"slopePct":6.0,"bearing":322.7,"elevation":259.93},{"dx":0,"dy":3,"lat":41.701526,"lng":1.799336,"slopePct":4.0,"bearing":27.4,"elevation":259.83},{"dx":3,"dy":3,"lat":41.701526,"lng":1.799372,"slopePct":3.1,"bearing":11.1,"elevation":259.82}]} },
      { number: 4, par: 3, hcp: 12, officialMeters: 64, eppaMeters: 64, tee: { lat: 41.701425, lng: 1.799148 }, green: { lat: 41.701595, lng: 1.798411 }, greenRadius: 8, description: "64m · Entre arbres amb búnquer davant del green.", greenSlopes: {"centerElevation":261.63,"arrows":[{"dx":-3,"dy":-3,"lat":41.701568,"lng":1.798375,"slopePct":4.0,"bearing":11.9,"elevation":261.61},{"dx":0,"dy":-3,"lat":41.701568,"lng":1.798411,"slopePct":1.2,"bearing":223.3,"elevation":261.61},{"dx":3,"dy":-3,"lat":41.701568,"lng":1.798447,"slopePct":2.4,"bearing":215.0,"elevation":261.66},{"dx":-3,"dy":0,"lat":41.701595,"lng":1.798375,"slopePct":8.5,"bearing":327.2,"elevation":261.44},{"dx":0,"dy":0,"lat":41.701595,"lng":1.798411,"slopePct":5.1,"bearing":281.2,"elevation":261.63},{"dx":3,"dy":0,"lat":41.701595,"lng":1.798447,"slopePct":4.5,"bearing":205.2,"elevation":261.74},{"dx":-3,"dy":3,"lat":41.701622,"lng":1.798375,"slopePct":11.7,"bearing":317.4,"elevation":261.18},{"dx":0,"dy":3,"lat":41.701622,"lng":1.798411,"slopePct":13.0,"bearing":291.4,"elevation":261.55},{"dx":3,"dy":3,"lat":41.701622,"lng":1.798447,"slopePct":1.6,"bearing":70.6,"elevation":261.9}]} },
      { number: 5, par: 3, hcp: 10, officialMeters: 95, eppaMeters: 50, tee: { lat: 41.701315, lng: 1.798451 }, green: { lat: 41.700474, lng: 1.798255 }, greenRadius: 8, description: "95m · Sortida des del bosc amb búnquer davanter dret i paret de pedra al fons.", greenSlopes: {"centerElevation":269.37,"arrows":[{"dx":-3,"dy":-3,"lat":41.700447,"lng":1.798219,"slopePct":1.2,"bearing":51.3,"elevation":269.43},{"dx":0,"dy":-3,"lat":41.700447,"lng":1.798255,"slopePct":2.1,"bearing":89.1,"elevation":269.37},{"dx":3,"dy":-3,"lat":41.700447,"lng":1.798291,"slopePct":2.2,"bearing":76.4,"elevation":269.3},{"dx":-3,"dy":0,"lat":41.700474,"lng":1.798219,"slopePct":2.4,"bearing":7.1,"elevation":269.39},{"dx":0,"dy":0,"lat":41.700474,"lng":1.798255,"slopePct":5.6,"bearing":18.7,"elevation":269.37},{"dx":3,"dy":0,"lat":41.700474,"lng":1.798291,"slopePct":10.4,"bearing":28.5,"elevation":269.28},{"dx":-3,"dy":3,"lat":41.700501,"lng":1.798219,"slopePct":6.4,"bearing":56.7,"elevation":269.28},{"dx":0,"dy":3,"lat":41.700501,"lng":1.798255,"slopePct":11.6,"bearing":49.8,"elevation":269.05},{"dx":3,"dy":3,"lat":41.700501,"lng":1.798291,"slopePct":12.4,"bearing":35.1,"elevation":268.75}]} },
      { number: 6, par: 3, hcp: 16, officialMeters: 65, eppaMeters: 65, tee: { lat: 41.700384, lng: 1.798183 }, green: { lat: 41.699923, lng: 1.797834 }, greenRadius: 8, description: "65m · Green petit i allargat al sud del camp.", greenSlopes: {"centerElevation":269.9,"arrows":[{"dx":-3,"dy":-3,"lat":41.699896,"lng":1.797798,"slopePct":6.2,"bearing":37.6,"elevation":270.42},{"dx":0,"dy":-3,"lat":41.699896,"lng":1.797834,"slopePct":8.2,"bearing":56.7,"elevation":270.23},{"dx":3,"dy":-3,"lat":41.699896,"lng":1.79787,"slopePct":6.9,"bearing":78.0,"elevation":270.01},{"dx":-3,"dy":0,"lat":41.699923,"lng":1.797798,"slopePct":8.1,"bearing":37.0,"elevation":270.05},{"dx":0,"dy":0,"lat":41.699923,"lng":1.797834,"slopePct":5.8,"bearing":22.0,"elevation":269.9},{"dx":3,"dy":0,"lat":41.699923,"lng":1.79787,"slopePct":4.3,"bearing":36.4,"elevation":269.92},{"dx":-3,"dy":3,"lat":41.69995,"lng":1.797798,"slopePct":6.5,"bearing":87.9,"elevation":270.03},{"dx":0,"dy":3,"lat":41.69995,"lng":1.797834,"slopePct":3.8,"bearing":89.5,"elevation":269.91},{"dx":3,"dy":3,"lat":41.69995,"lng":1.79787,"slopePct":3.8,"bearing":57.4,"elevation":269.8}]} },
      { number: 7, par: 3, hcp: 8, officialMeters: 113, eppaMeters: 54, tee: { lat: 41.700985, lng: 1.798102 }, green: { lat: 41.702006, lng: 1.798236 }, greenRadius: 8, description: "113m · Forat llarg en direcció al llac! Búnquer a la dreta i compte de no passar-se cap al llac.", greenSlopes: {"centerElevation":261.98,"arrows":[{"dx":-3,"dy":-3,"lat":41.701979,"lng":1.7982,"slopePct":4.8,"bearing":327.5,"elevation":261.75},{"dx":0,"dy":-3,"lat":41.701979,"lng":1.798236,"slopePct":3.1,"bearing":198.6,"elevation":261.78},{"dx":3,"dy":-3,"lat":41.701979,"lng":1.798272,"slopePct":9.7,"bearing":212.3,"elevation":261.81},{"dx":-3,"dy":0,"lat":41.702006,"lng":1.7982,"slopePct":11.7,"bearing":230.0,"elevation":261.57},{"dx":0,"dy":0,"lat":41.702006,"lng":1.798236,"slopePct":14.2,"bearing":236.0,"elevation":261.98},{"dx":3,"dy":0,"lat":41.702006,"lng":1.798272,"slopePct":7.8,"bearing":230.7,"elevation":262.28},{"dx":-3,"dy":3,"lat":41.702033,"lng":1.7982,"slopePct":16.2,"bearing":226.4,"elevation":262.2},{"dx":0,"dy":3,"lat":41.702033,"lng":1.798236,"slopePct":6.8,"bearing":13.5,"elevation":262.25},{"dx":3,"dy":3,"lat":41.702033,"lng":1.798272,"slopePct":38.0,"bearing":28.0,"elevation":262.11}]} },
      { number: 8, par: 3, hcp: 6, officialMeters: 78, eppaMeters: 78, tee: { lat: 41.701966, lng: 1.798371 }, green: { lat: 41.702647, lng: 1.798719 }, greenRadius: 8, description: "78m · Cal superar el llac! Tir de gran precisió des de la riba sud fins al green nord.", greenSlopes: {"centerElevation":261.35,"arrows":[{"dx":-3,"dy":-3,"lat":41.70262,"lng":1.798683,"slopePct":0.8,"bearing":15.5,"elevation":261.21},{"dx":0,"dy":-3,"lat":41.70262,"lng":1.798719,"slopePct":6.9,"bearing":135.5,"elevation":261.2},{"dx":3,"dy":-3,"lat":41.70262,"lng":1.798755,"slopePct":14.0,"bearing":127.1,"elevation":260.92},{"dx":-3,"dy":0,"lat":41.702647,"lng":1.798683,"slopePct":3.5,"bearing":165.2,"elevation":261.39},{"dx":0,"dy":0,"lat":41.702647,"lng":1.798719,"slopePct":3.0,"bearing":169.3,"elevation":261.35},{"dx":3,"dy":0,"lat":41.702647,"lng":1.798755,"slopePct":13.3,"bearing":117.8,"elevation":261.36},{"dx":-3,"dy":3,"lat":41.702674,"lng":1.798683,"slopePct":1.1,"bearing":114.3,"elevation":261.42},{"dx":0,"dy":3,"lat":41.702674,"lng":1.798719,"slopePct":2.2,"bearing":112.0,"elevation":261.38},{"dx":3,"dy":3,"lat":41.702674,"lng":1.798755,"slopePct":9.2,"bearing":99.8,"elevation":261.29}]} },
      { number: 9, par: 3, hcp: 4, officialMeters: 120, eppaMeters: 56, tee: { lat: 41.703207, lng: 1.7977 }, green: { lat: 41.702146, lng: 1.79778 }, greenRadius: 8, description: "120m · Carrer ample en baixada amb la xarxa del camp de pràctiques a l'esquerra.", greenSlopes: {"centerElevation":262.14,"arrows":[{"dx":-3,"dy":-3,"lat":41.702119,"lng":1.797744,"slopePct":4.1,"bearing":73.0,"elevation":262.29},{"dx":0,"dy":-3,"lat":41.702119,"lng":1.79778,"slopePct":4.1,"bearing":71.1,"elevation":262.17},{"dx":3,"dy":-3,"lat":41.702119,"lng":1.797816,"slopePct":4.4,"bearing":72.1,"elevation":262.06},{"dx":-3,"dy":0,"lat":41.702146,"lng":1.797744,"slopePct":4.9,"bearing":106.0,"elevation":262.28},{"dx":0,"dy":0,"lat":41.702146,"lng":1.79778,"slopePct":4.6,"bearing":105.2,"elevation":262.14},{"dx":3,"dy":0,"lat":41.702146,"lng":1.797816,"slopePct":4.7,"bearing":96.5,"elevation":262.01},{"dx":-3,"dy":3,"lat":41.702173,"lng":1.797744,"slopePct":4.1,"bearing":113.4,"elevation":262.37},{"dx":0,"dy":3,"lat":41.702173,"lng":1.79778,"slopePct":5.0,"bearing":110.8,"elevation":262.24},{"dx":3,"dy":3,"lat":41.702173,"lng":1.797816,"slopePct":5.8,"bearing":108.6,"elevation":262.09}]} },
      { number: 10, par: 3, hcp: 7, officialMeters: 88, eppaMeters: 88, tee: { lat: 41.702106, lng: 1.79778 }, green: { lat: 41.701636, lng: 1.796957 }, greenRadius: 8, description: "88m · Comença estret i s'eixampla cap al green amb búnquers a dreta i esquerra.", greenSlopes: {"centerElevation":265.86,"arrows":[{"dx":-3,"dy":-3,"lat":41.701609,"lng":1.796921,"slopePct":6.3,"bearing":66.1,"elevation":266.09},{"dx":0,"dy":-3,"lat":41.701609,"lng":1.796957,"slopePct":5.1,"bearing":47.4,"elevation":265.96},{"dx":3,"dy":-3,"lat":41.701609,"lng":1.796993,"slopePct":5.8,"bearing":45.1,"elevation":265.86},{"dx":-3,"dy":0,"lat":41.701636,"lng":1.796921,"slopePct":5.0,"bearing":38.1,"elevation":266.0},{"dx":0,"dy":0,"lat":41.701636,"lng":1.796957,"slopePct":5.2,"bearing":62.4,"elevation":265.86},{"dx":3,"dy":0,"lat":41.701636,"lng":1.796993,"slopePct":6.1,"bearing":47.6,"elevation":265.72},{"dx":-3,"dy":3,"lat":41.701663,"lng":1.796921,"slopePct":9.6,"bearing":68.4,"elevation":265.85},{"dx":0,"dy":3,"lat":41.701663,"lng":1.796957,"slopePct":4.8,"bearing":54.8,"elevation":265.81},{"dx":3,"dy":3,"lat":41.701663,"lng":1.796993,"slopePct":7.2,"bearing":56.1,"elevation":265.62}]} },
      { number: 11, par: 3, hcp: 17, officialMeters: 70, eppaMeters: 70, tee: { lat: 41.701756, lng: 1.79707 }, green: { lat: 41.701165, lng: 1.796887 }, greenRadius: 8, description: "70m · Forat curt amb búnquer a la part dreta del green.", greenSlopes: {"centerElevation":267.43,"arrows":[{"dx":-3,"dy":-3,"lat":41.701138,"lng":1.796851,"slopePct":5.5,"bearing":71.9,"elevation":267.59},{"dx":0,"dy":-3,"lat":41.701138,"lng":1.796887,"slopePct":3.7,"bearing":56.2,"elevation":267.48},{"dx":3,"dy":-3,"lat":41.701138,"lng":1.796923,"slopePct":4.3,"bearing":40.6,"elevation":267.4},{"dx":-3,"dy":0,"lat":41.701165,"lng":1.796851,"slopePct":6.7,"bearing":56.7,"elevation":267.56},{"dx":0,"dy":0,"lat":41.701165,"lng":1.796887,"slopePct":5.9,"bearing":49.3,"elevation":267.43},{"dx":3,"dy":0,"lat":41.701165,"lng":1.796923,"slopePct":6.8,"bearing":48.5,"elevation":267.29},{"dx":-3,"dy":3,"lat":41.701192,"lng":1.796851,"slopePct":10.0,"bearing":105.8,"elevation":267.37},{"dx":0,"dy":3,"lat":41.701192,"lng":1.796887,"slopePct":7.9,"bearing":29.5,"elevation":267.25},{"dx":3,"dy":3,"lat":41.701192,"lng":1.796923,"slopePct":8.1,"bearing":39.5,"elevation":267.13}]} },
      { number: 12, par: 3, hcp: 9, officialMeters: 94, eppaMeters: 51, tee: { lat: 41.701585, lng: 1.79711 }, green: { lat: 41.700784, lng: 1.79711 }, greenRadius: 8, description: "94m · Carrer en pujada cap al green amb desnivell pronunciat.", greenSlopes: {"centerElevation":268.14,"arrows":[{"dx":-3,"dy":-3,"lat":41.700757,"lng":1.797074,"slopePct":2.5,"bearing":160.5,"elevation":268.36},{"dx":0,"dy":-3,"lat":41.700757,"lng":1.79711,"slopePct":7.3,"bearing":81.3,"elevation":268.24},{"dx":3,"dy":-3,"lat":41.700757,"lng":1.797146,"slopePct":9.9,"bearing":75.0,"elevation":267.93},{"dx":-3,"dy":0,"lat":41.700784,"lng":1.797074,"slopePct":6.1,"bearing":40.9,"elevation":268.45},{"dx":0,"dy":0,"lat":41.700784,"lng":1.79711,"slopePct":12.7,"bearing":55.4,"elevation":268.14},{"dx":3,"dy":0,"lat":41.700784,"lng":1.797146,"slopePct":14.8,"bearing":36.2,"elevation":267.82},{"dx":-3,"dy":3,"lat":41.700811,"lng":1.797074,"slopePct":14.7,"bearing":23.5,"elevation":268.08},{"dx":0,"dy":3,"lat":41.700811,"lng":1.79711,"slopePct":16.7,"bearing":60.4,"elevation":267.81},{"dx":3,"dy":3,"lat":41.700811,"lng":1.797146,"slopePct":12.9,"bearing":74.0,"elevation":267.21}]} },
      { number: 13, par: 3, hcp: 13, officialMeters: 85, eppaMeters: 85, tee: { lat: 41.701345, lng: 1.796842 }, green: { lat: 41.700584, lng: 1.796587 }, greenRadius: 8, description: "85m · Fora de límits a l'esquerra del camp i green amb 2 búnquers.", greenSlopes: {"centerElevation":276.87,"arrows":[{"dx":-3,"dy":-3,"lat":41.700557,"lng":1.796551,"slopePct":2.7,"bearing":65.2,"elevation":276.92},{"dx":0,"dy":-3,"lat":41.700557,"lng":1.796587,"slopePct":3.7,"bearing":68.3,"elevation":276.9},{"dx":3,"dy":-3,"lat":41.700557,"lng":1.796623,"slopePct":5.4,"bearing":74.1,"elevation":276.71},{"dx":-3,"dy":0,"lat":41.700584,"lng":1.796551,"slopePct":2.2,"bearing":49.9,"elevation":276.89},{"dx":0,"dy":0,"lat":41.700584,"lng":1.796587,"slopePct":3.3,"bearing":70.9,"elevation":276.87},{"dx":3,"dy":0,"lat":41.700584,"lng":1.796623,"slopePct":4.8,"bearing":106.7,"elevation":276.71},{"dx":-3,"dy":3,"lat":41.700611,"lng":1.796551,"slopePct":4.8,"bearing":13.0,"elevation":276.83},{"dx":0,"dy":3,"lat":41.700611,"lng":1.796587,"slopePct":5.5,"bearing":6.3,"elevation":276.84},{"dx":3,"dy":3,"lat":41.700611,"lng":1.796623,"slopePct":12.9,"bearing":42.2,"elevation":276.8}]} },
      { number: 14, par: 3, hcp: 11, officialMeters: 77, eppaMeters: 77, tee: { lat: 41.700414, lng: 1.796761 }, green: { lat: 41.699763, lng: 1.79711 }, greenRadius: 8, description: "77m · Forat ample en lleugera pujada amb búnquers al green.", greenSlopes: {"centerElevation":273.61,"arrows":[{"dx":-3,"dy":-3,"lat":41.699736,"lng":1.797074,"slopePct":8.1,"bearing":51.7,"elevation":274.14},{"dx":0,"dy":-3,"lat":41.699736,"lng":1.79711,"slopePct":11.5,"bearing":58.3,"elevation":273.88},{"dx":3,"dy":-3,"lat":41.699736,"lng":1.797146,"slopePct":11.7,"bearing":68.4,"elevation":273.55},{"dx":-3,"dy":0,"lat":41.699763,"lng":1.797074,"slopePct":11.5,"bearing":46.1,"elevation":273.86},{"dx":0,"dy":0,"lat":41.699763,"lng":1.79711,"slopePct":10.1,"bearing":41.1,"elevation":273.61},{"dx":3,"dy":0,"lat":41.699763,"lng":1.797146,"slopePct":9.2,"bearing":61.9,"elevation":273.46},{"dx":-3,"dy":3,"lat":41.69979,"lng":1.797074,"slopePct":10.4,"bearing":51.7,"elevation":273.66},{"dx":0,"dy":3,"lat":41.69979,"lng":1.79711,"slopePct":8.0,"bearing":50.1,"elevation":273.42},{"dx":3,"dy":3,"lat":41.69979,"lng":1.797146,"slopePct":8.6,"bearing":52.7,"elevation":273.29}]} },
      { number: 15, par: 3, hcp: 1, officialMeters: 120, eppaMeters: 56, tee: { lat: 41.700104, lng: 1.797298 }, green: { lat: 41.700975, lng: 1.797746 }, greenRadius: 8, description: "120m · Forat llarg (Hcp 1) amb búnquer a la dreta i estaques vermelles a l'esquerra.", greenSlopes: {"centerElevation":264.69,"arrows":[{"dx":-3,"dy":-3,"lat":41.700948,"lng":1.79771,"slopePct":5.9,"bearing":37.7,"elevation":264.98},{"dx":0,"dy":-3,"lat":41.700948,"lng":1.797746,"slopePct":7.2,"bearing":48.6,"elevation":264.81},{"dx":3,"dy":-3,"lat":41.700948,"lng":1.797782,"slopePct":7.6,"bearing":30.0,"elevation":264.66},{"dx":-3,"dy":0,"lat":41.700975,"lng":1.79771,"slopePct":6.7,"bearing":54.3,"elevation":264.83},{"dx":0,"dy":0,"lat":41.700975,"lng":1.797746,"slopePct":7.3,"bearing":48.1,"elevation":264.69},{"dx":3,"dy":0,"lat":41.700975,"lng":1.797782,"slopePct":7.0,"bearing":49.9,"elevation":264.5},{"dx":-3,"dy":3,"lat":41.701002,"lng":1.79771,"slopePct":6.7,"bearing":67.7,"elevation":264.75},{"dx":0,"dy":3,"lat":41.701002,"lng":1.797746,"slopePct":6.6,"bearing":64.7,"elevation":264.52},{"dx":3,"dy":3,"lat":41.701002,"lng":1.797782,"slopePct":6.4,"bearing":45.7,"elevation":264.39}]} },
      { number: 16, par: 3, hcp: 3, officialMeters: 104, eppaMeters: 49, tee: { lat: 41.701575, lng: 1.798089 }, green: { lat: 41.702086, lng: 1.799076 }, greenRadius: 8, description: "104m · Sortida elevada entre arbres cap al green defensat per búnquer dret i posterior.", greenSlopes: {"centerElevation":259.86,"arrows":[{"dx":-3,"dy":-3,"lat":41.702059,"lng":1.79904,"slopePct":4.9,"bearing":123.1,"elevation":260.03},{"dx":0,"dy":-3,"lat":41.702059,"lng":1.799076,"slopePct":2.6,"bearing":93.3,"elevation":259.83},{"dx":3,"dy":-3,"lat":41.702059,"lng":1.799112,"slopePct":1.5,"bearing":258.6,"elevation":259.87},{"dx":-3,"dy":0,"lat":41.702086,"lng":1.79904,"slopePct":4.3,"bearing":66.8,"elevation":260.08},{"dx":0,"dy":0,"lat":41.702086,"lng":1.799076,"slopePct":5.0,"bearing":69.8,"elevation":259.86},{"dx":3,"dy":0,"lat":41.702086,"lng":1.799112,"slopePct":4.4,"bearing":2.8,"elevation":259.8},{"dx":-3,"dy":3,"lat":41.702113,"lng":1.79904,"slopePct":8.9,"bearing":67.1,"elevation":259.93},{"dx":0,"dy":3,"lat":41.702113,"lng":1.799076,"slopePct":7.2,"bearing":47.1,"elevation":259.73},{"dx":3,"dy":3,"lat":41.702113,"lng":1.799112,"slopePct":8.0,"bearing":24.0,"elevation":259.61}]} },
      { number: 17, par: 3, hcp: 5, officialMeters: 75, eppaMeters: 75, tee: { lat: 41.70204, lng: 1.798827 }, green: { lat: 41.702687, lng: 1.799041 }, greenRadius: 8, description: "75m · Es torna a creuar el llac! Gran búnquer al darrere i búnquer a la dreta.", greenSlopes: {"centerElevation":260.07,"arrows":[{"dx":-3,"dy":-3,"lat":41.70266,"lng":1.799005,"slopePct":11.2,"bearing":339.1,"elevation":260.39},{"dx":0,"dy":-3,"lat":41.70266,"lng":1.799041,"slopePct":13.9,"bearing":358.1,"elevation":260.49},{"dx":3,"dy":-3,"lat":41.70266,"lng":1.799077,"slopePct":19.3,"bearing":36.5,"elevation":260.41},{"dx":-3,"dy":0,"lat":41.702687,"lng":1.799005,"slopePct":8.3,"bearing":356.9,"elevation":260.06},{"dx":0,"dy":0,"lat":41.702687,"lng":1.799041,"slopePct":11.0,"bearing":2.5,"elevation":260.07},{"dx":3,"dy":0,"lat":41.702687,"lng":1.799077,"slopePct":10.5,"bearing":6.0,"elevation":260.03},{"dx":-3,"dy":3,"lat":41.702714,"lng":1.799005,"slopePct":4.5,"bearing":29.1,"elevation":259.89},{"dx":0,"dy":3,"lat":41.702714,"lng":1.799041,"slopePct":5.9,"bearing":17.1,"elevation":259.83},{"dx":3,"dy":3,"lat":41.702714,"lng":1.799077,"slopePct":6.8,"bearing":24.7,"elevation":259.79}]} },
      { number: 18, par: 3, hcp: 15, officialMeters: 67, eppaMeters: 67, tee: { lat: 41.702733, lng: 1.798988 }, green: { lat: 41.703267, lng: 1.798639 }, greenRadius: 8, description: "67m · Final en pujada cap a la Casa Club amb búnquers a l'esquerra i al darrere.", greenSlopes: {"centerElevation":263.94,"arrows":[{"dx":-3,"dy":-3,"lat":41.70324,"lng":1.798603,"slopePct":3.4,"bearing":134.4,"elevation":264.02},{"dx":0,"dy":-3,"lat":41.70324,"lng":1.798639,"slopePct":4.3,"bearing":119.4,"elevation":263.92},{"dx":3,"dy":-3,"lat":41.70324,"lng":1.798675,"slopePct":5.2,"bearing":120.8,"elevation":263.8},{"dx":-3,"dy":0,"lat":41.703267,"lng":1.798603,"slopePct":3.6,"bearing":94.7,"elevation":264.05},{"dx":0,"dy":0,"lat":41.703267,"lng":1.798639,"slopePct":3.6,"bearing":123.4,"elevation":263.94},{"dx":3,"dy":0,"lat":41.703267,"lng":1.798675,"slopePct":4.6,"bearing":152.6,"elevation":263.87},{"dx":-3,"dy":3,"lat":41.703294,"lng":1.798603,"slopePct":5.8,"bearing":128.5,"elevation":264.04},{"dx":0,"dy":3,"lat":41.703294,"lng":1.798639,"slopePct":4.3,"bearing":180.0,"elevation":264.04},{"dx":3,"dy":3,"lat":41.703294,"lng":1.798675,"slopePct":4.5,"bearing":160.0,"elevation":264.04}]} }
    ]
  },
{
    id: "pp-can-cuyas",
    name: "Can Cuyàs Golf i Pitch & Putt",
    municipality: "Sant Feliu de Llobregat",
    province: "Barcelona",
    type: "Pitch & Putt",
    federation: "FCPP",
    holesCount: 18,
    lat: 41.395916,
    lng: 2.045129,
    website: "https://www.cancuyasgolf.com",
    teesAvailable: [
      { id: "comp", name: "Competició (FCPP)", color: "#3b82f6", textColor: "#fff", offsetMeters: 0 },
      { id: "social", name: "Social / Groga", color: "#eab308", textColor: "#000", offsetMeters: -4 }
    ]
  },
{
    id: "pp-accura-teia",
    name: "Pitch & Putt Barcelona-Teià (Àccura)",
    municipality: "Teià",
    province: "Barcelona",
    type: "Pitch & Putt",
    federation: "FCPP",
    holesCount: 18,
    lat: 41.494748,
    lng: 2.333369,
    website: "https://www.accurateia.cat",
    teesAvailable: [
      { id: "comp", name: "Competició (FCPP)", color: "#3b82f6", textColor: "#fff", offsetMeters: 0 },
      { id: "social", name: "Social / Groga", color: "#eab308", textColor: "#000", offsetMeters: -4 }
    ]
  },
{
    id: "pp-badalona",
    name: "Pitch & Putt Badalona (Castell de Godmar)",
    municipality: "Badalona",
    province: "Barcelona",
    type: "Pitch & Putt",
    federation: "FCPP",
    holesCount: 18,
    lat: 41.473548,
    lng: 2.244887,
    website: "https://www.pitchandputtbadalona.com",
    teesAvailable: [
      { id: "comp", name: "Competició (FCPP)", color: "#3b82f6", textColor: "#fff", offsetMeters: 0 },
      { id: "social", name: "Social / Groga", color: "#eab308", textColor: "#000", offsetMeters: -4 }
    ]
  },
{
    id: "pp-canal-olimpic",
    name: "Pitch & Putt Canal Olímpic",
    municipality: "Castelldefels",
    province: "Barcelona",
    type: "Pitch & Putt",
    federation: "FCPP",
    holesCount: 9,
    lat: 41.275732,
    lng: 1.994029,
    website: "https://canalolimpic.cat",
    teesAvailable: [
      { id: "comp", name: "Competició (FCPP)", color: "#3b82f6", textColor: "#fff", offsetMeters: 0 },
      { id: "social", name: "Social / Groga", color: "#eab308", textColor: "#000", offsetMeters: -3 }
    ],
    osmVerified: true,
    holes: [
      { number: 1, par: 3, hcp: 17, officialMeters: 45, tee: { lat: 41.27488, lng: 1.993926 }, green: { lat: 41.275106, lng: 1.994371 }, greenRadius: 8, source: "OSM" },
      { number: 2, par: 3, hcp: 15, officialMeters: 60, tee: { lat: 41.27516, lng: 1.994622 }, green: { lat: 41.275576, lng: 1.994163 }, greenRadius: 8, source: "OSM" },
      { number: 3, par: 3, hcp: 3, officialMeters: 85, tee: { lat: 41.275822, lng: 1.994353 }, green: { lat: 41.276477, lng: 1.993822 }, greenRadius: 8, source: "OSM" },
      { number: 4, par: 3, hcp: 5, officialMeters: 60, tee: { lat: 41.276737, lng: 1.993827 }, green: { lat: 41.277228, lng: 1.993516 }, greenRadius: 8, source: "OSM" },
      { number: 5, par: 3, hcp: 9, officialMeters: 46, tee: { lat: 41.27706, lng: 1.993391 }, green: { lat: 41.276668, lng: 1.993552 }, greenRadius: 8, source: "OSM" },
      { number: 6, par: 3, hcp: 7, officialMeters: 73, tee: { lat: 41.276483, lng: 1.993411 }, green: { lat: 41.275884, lng: 1.993763 }, greenRadius: 8, source: "OSM" },
      { number: 7, par: 3, hcp: 13, officialMeters: 50, tee: { lat: 41.276033, lng: 1.993395 }, green: { lat: 41.275615, lng: 1.993607 }, greenRadius: 8, source: "OSM" },
      { number: 8, par: 3, hcp: 11, officialMeters: 57, tee: { lat: 41.275629, lng: 1.993841 }, green: { lat: 41.275113, lng: 1.993873 }, greenRadius: 8, source: "OSM" },
      { number: 9, par: 3, hcp: 1, officialMeters: 92, tee: { lat: 41.275444, lng: 1.993431 }, green: { lat: 41.274662, lng: 1.99378 }, greenRadius: 8, source: "OSM" }
    ]
  },
{
    id: "pp-can-rafols",
    name: "Golf Pitch & Putt Can Rafel",
    municipality: "Cervelló",
    province: "Barcelona",
    type: "Pitch & Putt",
    federation: "FCPP",
    holesCount: 18,
    lat: 41.406333,
    lng: 1.930989,
    website: "https://www.golfcanrafel.com",
    teesAvailable: [
      { id: "comp", name: "Competició (FCPP)", color: "#3b82f6", textColor: "#fff", offsetMeters: 0 },
      { id: "social", name: "Social / Groga", color: "#eab308", textColor: "#000", offsetMeters: -4 }
    ],
    osmVerified: true,
    holes: [
      { number: 1, par: 3, hcp: 1, officialMeters: 58, tee: { lat: 41.407767, lng: 1.933543 }, green: { lat: 41.407286, lng: 1.933261 }, greenRadius: 8, source: "OSM" },
      { number: 2, par: 3, hcp: 2, officialMeters: 79, tee: { lat: 41.406956, lng: 1.932299 }, green: { lat: 41.406571, lng: 1.931499 }, greenRadius: 8, source: "OSM" },
      { number: 3, par: 3, hcp: 3, officialMeters: 86, tee: { lat: 41.406557, lng: 1.931135 }, green: { lat: 41.406364, lng: 1.930143 }, greenRadius: 8, source: "OSM" },
      { number: 4, par: 3, hcp: 4, officialMeters: 66, tee: { lat: 41.406196, lng: 1.930443 }, green: { lat: 41.406072, lng: 1.929666 }, greenRadius: 8, source: "OSM" },
      { number: 5, par: 3, hcp: 5, officialMeters: 119, tee: { lat: 41.40587, lng: 1.929466 }, green: { lat: 41.406085, lng: 1.930868 }, greenRadius: 8, source: "OSM" },
      { number: 6, par: 3, hcp: 6, officialMeters: 69, tee: { lat: 41.406265, lng: 1.930533 }, green: { lat: 41.4063, lng: 1.931362 }, greenRadius: 8, source: "OSM" },
      { number: 7, par: 3, hcp: 7, officialMeters: 105, tee: { lat: 41.405774, lng: 1.930614 }, green: { lat: 41.406208, lng: 1.931729 }, greenRadius: 8, source: "OSM" },
      { number: 8, par: 3, hcp: 8, officialMeters: 70, tee: { lat: 41.4064, lng: 1.931575 }, green: { lat: 41.406595, lng: 1.932374 }, greenRadius: 8, source: "OSM" },
      { number: 9, par: 3, hcp: 9, officialMeters: 61, tee: { lat: 41.406726, lng: 1.932628 }, green: { lat: 41.406921, lng: 1.933307 }, greenRadius: 8, source: "OSM" },
      { number: 10, par: 3, hcp: 10, officialMeters: 58, tee: { lat: 41.407767, lng: 1.933543 }, green: { lat: 41.407286, lng: 1.933261 }, greenRadius: 8, source: "OSM" },
      { number: 11, par: 3, hcp: 11, officialMeters: 79, tee: { lat: 41.406956, lng: 1.932299 }, green: { lat: 41.406571, lng: 1.931499 }, greenRadius: 8, source: "OSM" },
      { number: 12, par: 3, hcp: 12, officialMeters: 86, tee: { lat: 41.406557, lng: 1.931135 }, green: { lat: 41.406364, lng: 1.930143 }, greenRadius: 8, source: "OSM" },
      { number: 13, par: 3, hcp: 13, officialMeters: 66, tee: { lat: 41.406196, lng: 1.930443 }, green: { lat: 41.406072, lng: 1.929666 }, greenRadius: 8, source: "OSM" },
      { number: 14, par: 3, hcp: 14, officialMeters: 119, tee: { lat: 41.40587, lng: 1.929466 }, green: { lat: 41.406085, lng: 1.930868 }, greenRadius: 8, source: "OSM" },
      { number: 15, par: 3, hcp: 15, officialMeters: 69, tee: { lat: 41.406265, lng: 1.930533 }, green: { lat: 41.4063, lng: 1.931362 }, greenRadius: 8, source: "OSM" },
      { number: 16, par: 3, hcp: 16, officialMeters: 105, tee: { lat: 41.405774, lng: 1.930614 }, green: { lat: 41.406208, lng: 1.931729 }, greenRadius: 8, source: "OSM" },
      { number: 17, par: 3, hcp: 17, officialMeters: 70, tee: { lat: 41.4064, lng: 1.931575 }, green: { lat: 41.406595, lng: 1.932374 }, greenRadius: 8, source: "OSM" },
      { number: 18, par: 3, hcp: 18, officialMeters: 61, tee: { lat: 41.406726, lng: 1.932628 }, green: { lat: 41.406921, lng: 1.933307 }, greenRadius: 8, source: "OSM" }
    ]
  },
{
    id: "pp-can-mascaro",
    name: "Pitch & Putt Can Mascaró",
    municipality: "La Palma de Cervelló",
    province: "Barcelona",
    type: "Pitch & Putt",
    federation: "FCPP",
    holesCount: 18,
    lat: 41.401246,
    lng: 1.980885,
    website: "",
    teesAvailable: [
      { id: "comp", name: "Competició (FCPP)", color: "#3b82f6", textColor: "#fff", offsetMeters: 0 },
      { id: "social", name: "Social / Groga", color: "#eab308", textColor: "#000", offsetMeters: -4 }
    ],
    osmVerified: true,
    holes: [
      { number: 1, par: 3, hcp: 10, officialMeters: 78, tee: { lat: 41.401438, lng: 1.979358 }, green: { lat: 41.401767, lng: 1.978534 }, greenRadius: 8, source: "OSM" },
      { number: 2, par: 3, hcp: 4, officialMeters: 99, tee: { lat: 41.401988, lng: 1.978495 }, green: { lat: 41.402501, lng: 1.977531 }, greenRadius: 8, source: "OSM" },
      { number: 3, par: 3, hcp: 1, officialMeters: 120, tee: { lat: 41.402396, lng: 1.977186 }, green: { lat: 41.401571, lng: 1.978103 }, greenRadius: 8, source: "OSM" },
      { number: 4, par: 3, hcp: 9, officialMeters: 86, tee: { lat: 41.400929, lng: 1.9782 }, green: { lat: 41.401412, lng: 1.977402 }, greenRadius: 8, source: "OSM" },
      { number: 5, par: 3, hcp: 18, officialMeters: 48, tee: { lat: 41.401351, lng: 1.977046 }, green: { lat: 41.401074, lng: 1.977485 }, greenRadius: 8, source: "OSM" },
      { number: 6, par: 3, hcp: 6, officialMeters: 61, tee: { lat: 41.400949, lng: 1.977343 }, green: { lat: 41.40117, lng: 1.976678 }, greenRadius: 8, source: "OSM" },
      { number: 7, par: 3, hcp: 3, officialMeters: 96, tee: { lat: 41.401191, lng: 1.976082 }, green: { lat: 41.401442, lng: 1.974976 }, greenRadius: 8, source: "OSM" },
      { number: 8, par: 3, hcp: 8, officialMeters: 72, tee: { lat: 41.401527, lng: 1.975529 }, green: { lat: 41.401586, lng: 1.97639 }, greenRadius: 8, source: "OSM" },
      { number: 9, par: 3, hcp: 13, officialMeters: 78, tee: { lat: 41.401306, lng: 1.976425 }, green: { lat: 41.401731, lng: 1.977167 }, greenRadius: 8, source: "OSM" },
      { number: 10, par: 3, hcp: 15, officialMeters: 74, tee: { lat: 41.401526, lng: 1.977763 }, green: { lat: 41.402079, lng: 1.977281 }, greenRadius: 8, source: "OSM" },
      { number: 11, par: 3, hcp: 7, officialMeters: 80, tee: { lat: 41.402242, lng: 1.977081 }, green: { lat: 41.401855, lng: 1.97627 }, greenRadius: 8, source: "OSM" },
      { number: 12, par: 3, hcp: 17, officialMeters: 77, tee: { lat: 41.401703, lng: 1.976173 }, green: { lat: 41.401637, lng: 1.975252 }, greenRadius: 8, source: "OSM" },
      { number: 13, par: 3, hcp: 16, officialMeters: 60, tee: { lat: 41.401642, lng: 1.974761 }, green: { lat: 41.401904, lng: 1.975389 }, greenRadius: 8, source: "OSM" },
      { number: 14, par: 3, hcp: 5, officialMeters: 111, tee: { lat: 41.401969, lng: 1.975702 }, green: { lat: 41.402444, lng: 1.976876 }, greenRadius: 8, source: "OSM" },
      { number: 15, par: 3, hcp: 14, officialMeters: 64, tee: { lat: 41.402625, lng: 1.976799 }, green: { lat: 41.402815, lng: 1.976082 }, greenRadius: 8, source: "OSM" },
      { number: 16, par: 3, hcp: 2, officialMeters: 104, tee: { lat: 41.402937, lng: 1.976844 }, green: { lat: 41.402569, lng: 1.977983 }, greenRadius: 8, source: "OSM" },
      { number: 17, par: 3, hcp: 12, officialMeters: 78, tee: { lat: 41.402861, lng: 1.978432 }, green: { lat: 41.402182, lng: 1.978639 }, greenRadius: 8, source: "OSM" },
      { number: 18, par: 3, hcp: 11, officialMeters: 60, tee: { lat: 41.401389, lng: 1.978469 }, green: { lat: 41.401257, lng: 1.979162 }, greenRadius: 8, source: "OSM" }
    ]
  },
{
    id: "pp-roc3",
    name: "Pitch & Putt Roc 3",
    municipality: "Santa Coloma de Cervelló",
    province: "Barcelona",
    type: "Pitch & Putt",
    federation: "FCPP",
    holesCount: 18,
    lat: 41.377902,
    lng: 2.016862,
    website: "",
    teesAvailable: [
      { id: "comp", name: "Competició (FCPP)", color: "#3b82f6", textColor: "#fff", offsetMeters: 0 },
      { id: "social", name: "Social / Groga", color: "#eab308", textColor: "#000", offsetMeters: -4 }
    ]
  },
{
    id: "pp-el-valles",
    name: "El Vallès Golf & Pitch & Putt",
    municipality: "Terrassa",
    province: "Barcelona",
    type: "Pitch & Putt",
    federation: "FCPP",
    holesCount: 18,
    lat: 41.555919,
    lng: 2.063135,
    website: "https://www.elvallesgolf.com",
    teesAvailable: [
      { id: "comp", name: "Competició (FCPP)", color: "#3b82f6", textColor: "#fff", offsetMeters: 0 },
      { id: "social", name: "Social / Groga", color: "#eab308", textColor: "#000", offsetMeters: -4 }
    ],
    osmVerified: true,
    holes: [
      { number: 1, par: 3, hcp: 16, officialMeters: 47, tee: { lat: 41.556348, lng: 2.063067 }, green: { lat: 41.556064, lng: 2.063492 }, greenRadius: 8, source: "OSM" },
      { number: 2, par: 3, hcp: 13, officialMeters: 72, tee: { lat: 41.556155, lng: 2.063769 }, green: { lat: 41.555512, lng: 2.063777 }, greenRadius: 8, source: "OSM" },
      { number: 3, par: 3, hcp: 7, officialMeters: 68, tee: { lat: 41.555385, lng: 2.063585 }, green: { lat: 41.554794, lng: 2.063813 }, greenRadius: 8, source: "OSM" },
      { number: 4, par: 3, hcp: 5, officialMeters: 76, tee: { lat: 41.554614, lng: 2.064213 }, green: { lat: 41.555267, lng: 2.06395 }, greenRadius: 8, source: "OSM" },
      { number: 5, par: 3, hcp: 1, officialMeters: 79, tee: { lat: 41.5554, lng: 2.064145 }, green: { lat: 41.55477, lng: 2.064584 }, greenRadius: 8, source: "OSM" },
      { number: 6, par: 3, hcp: 14, officialMeters: 78, tee: { lat: 41.55446, lng: 2.064728 }, green: { lat: 41.554475, lng: 2.063795 }, greenRadius: 8, source: "OSM" },
      { number: 7, par: 3, hcp: 10, officialMeters: 81, tee: { lat: 41.554445, lng: 2.06347 }, green: { lat: 41.555158, lng: 2.063252 }, greenRadius: 8, source: "OSM" },
      { number: 8, par: 3, hcp: 6, officialMeters: 73, tee: { lat: 41.555427, lng: 2.063478 }, green: { lat: 41.555627, lng: 2.062644 }, greenRadius: 8, source: "OSM" },
      { number: 9, par: 3, hcp: 8, officialMeters: 98, tee: { lat: 41.555695, lng: 2.063448 }, green: { lat: 41.556137, lng: 2.062431 }, greenRadius: 8, source: "OSM" },
      { number: 10, par: 3, hcp: 10, officialMeters: 47, tee: { lat: 41.556348, lng: 2.063067 }, green: { lat: 41.556064, lng: 2.063492 }, greenRadius: 8, source: "OSM" },
      { number: 11, par: 3, hcp: 11, officialMeters: 72, tee: { lat: 41.556155, lng: 2.063769 }, green: { lat: 41.555512, lng: 2.063777 }, greenRadius: 8, source: "OSM" },
      { number: 12, par: 3, hcp: 12, officialMeters: 68, tee: { lat: 41.555385, lng: 2.063585 }, green: { lat: 41.554794, lng: 2.063813 }, greenRadius: 8, source: "OSM" },
      { number: 13, par: 3, hcp: 13, officialMeters: 76, tee: { lat: 41.554614, lng: 2.064213 }, green: { lat: 41.555267, lng: 2.06395 }, greenRadius: 8, source: "OSM" },
      { number: 14, par: 3, hcp: 14, officialMeters: 79, tee: { lat: 41.5554, lng: 2.064145 }, green: { lat: 41.55477, lng: 2.064584 }, greenRadius: 8, source: "OSM" },
      { number: 15, par: 3, hcp: 15, officialMeters: 78, tee: { lat: 41.55446, lng: 2.064728 }, green: { lat: 41.554475, lng: 2.063795 }, greenRadius: 8, source: "OSM" },
      { number: 16, par: 3, hcp: 16, officialMeters: 81, tee: { lat: 41.554445, lng: 2.06347 }, green: { lat: 41.555158, lng: 2.063252 }, greenRadius: 8, source: "OSM" },
      { number: 17, par: 3, hcp: 17, officialMeters: 73, tee: { lat: 41.555427, lng: 2.063478 }, green: { lat: 41.555627, lng: 2.062644 }, greenRadius: 8, source: "OSM" },
      { number: 18, par: 3, hcp: 18, officialMeters: 98, tee: { lat: 41.555695, lng: 2.063448 }, green: { lat: 41.556137, lng: 2.062431 }, greenRadius: 8, source: "OSM" }
    ]
  },
{
    id: "pp-hcp1",
    name: "HCP1 Pitch & Putt (Golf Sant Vicenç)",
    municipality: "Sant Vicenç de Montalt",
    province: "Barcelona",
    type: "Pitch & Putt",
    federation: "FCPP",
    holesCount: 18,
    lat: 41.574261,
    lng: 2.505980,
    website: "https://www.hcp1.es",
    teesAvailable: [
      { id: "comp", name: "Competició (FCPP)", color: "#3b82f6", textColor: "#fff", offsetMeters: 0 },
      { id: "social", name: "Social / Groga", color: "#eab308", textColor: "#000", offsetMeters: -4 }
    ]
  },
{
    id: "pp-sant-cebria",
    name: "Pitch & Putt Sant Cebrià",
    municipality: "Sant Cebrià de Vallalta",
    province: "Barcelona",
    type: "Pitch & Putt",
    federation: "FCPP",
    holesCount: 18,
    lat: 41.611527,
    lng: 2.604304,
    website: "https://www.santcebriapitchandputt.cat",
    teesAvailable: [
      { id: "comp", name: "Competició (FCPP)", color: "#3b82f6", textColor: "#fff", offsetMeters: 0 },
      { id: "social", name: "Social / Groga", color: "#eab308", textColor: "#000", offsetMeters: -4 }
    ]
  },
{
    id: "pp-la-garriga",
    name: "Golf La Garriga Pitch & Putt",
    municipality: "La Garriga",
    province: "Barcelona",
    type: "Pitch & Putt",
    federation: "FCPP",
    holesCount: 18,
    lat: 41.660704,
    lng: 2.282136,
    website: "https://www.golflagarriga.com",
    teesAvailable: [
      { id: "comp", name: "Competició (FCPP)", color: "#3b82f6", textColor: "#fff", offsetMeters: 0 },
      { id: "social", name: "Social / Groga", color: "#eab308", textColor: "#000", offsetMeters: -4 }
    ]
  },
{
    id: "pp-montseny",
    name: "Pitch & Putt Golf Montseny",
    municipality: "Gualba",
    province: "Barcelona",
    type: "Pitch & Putt",
    federation: "FCPP",
    holesCount: 18,
    lat: 41.714913,
    lng: 2.523418,
    website: "",
    teesAvailable: [
      { id: "comp", name: "Competició (FCPP)", color: "#3b82f6", textColor: "#fff", offsetMeters: 0 },
      { id: "social", name: "Social / Groga", color: "#eab308", textColor: "#000", offsetMeters: -4 }
    ]
  },
{
    id: "pp-portal-del-roc",
    name: "Pitch & Putt Portal del Roc",
    municipality: "Vilanova i la Geltrú",
    province: "Barcelona",
    type: "Pitch & Putt",
    federation: "FCPP",
    holesCount: 18,
    lat: 41.243316,
    lng: 1.680006,
    website: "https://www.portaldelroc.com",
    teesAvailable: [
      { id: "comp", name: "Competició (FCPP)", color: "#3b82f6", textColor: "#fff", offsetMeters: 0 },
      { id: "social", name: "Social / Groga", color: "#eab308", textColor: "#000", offsetMeters: -4 }
    ]
  },
{
    id: "pp-mas-gurumbau",
    name: "Golf Pitch & Putt Mas Gurumbau",
    municipality: "Taradell",
    province: "Barcelona",
    type: "Pitch & Putt",
    federation: "FCPP",
    holesCount: 9,
    lat: 41.877742,
    lng: 2.247394,
    website: "",
    teesAvailable: [
      { id: "comp", name: "Competició (FCPP)", color: "#3b82f6", textColor: "#fff", offsetMeters: 0 },
      { id: "social", name: "Social / Groga", color: "#eab308", textColor: "#000", offsetMeters: -4 }
    ]
  },
{
    id: "pp-tennis-mora",
    name: "Pitch & Putt Tennis Móra",
    municipality: "Sant Andreu de Llavaneres",
    province: "Barcelona",
    type: "Pitch & Putt",
    federation: "FCPP",
    holesCount: 9,
    lat: 41.564975,
    lng: 2.497293,
    website: "",
    teesAvailable: [
      { id: "comp", name: "Competició (FCPP)", color: "#3b82f6", textColor: "#fff", offsetMeters: 0 },
      { id: "social", name: "Social / Groga", color: "#eab308", textColor: "#000", offsetMeters: -4 }
    ]
  },
{
    id: "pp-gualta",
    name: "Pitch & Putt Gualta",
    municipality: "Gualta",
    province: "Girona",
    type: "Pitch & Putt",
    federation: "FCPP",
    holesCount: 18,
    lat: 42.035420,
    lng: 3.118742,
    website: "https://www.gualta.com",
    teesAvailable: [
      { id: "comp", name: "Competició (FCPP)", color: "#3b82f6", textColor: "#fff", offsetMeters: 0 },
      { id: "social", name: "Social / Groga", color: "#eab308", textColor: "#000", offsetMeters: -4 }
    ]
  },
{
    id: "pp-franciac",
    name: "Pitch & Putt Franciac Golf",
    municipality: "Caldes de Malavella",
    province: "Girona",
    type: "Pitch & Putt",
    federation: "FCPP",
    holesCount: 18,
    lat: 41.872185,
    lng: 2.770814,
    website: "https://www.pitchandputtfranciac.com",
    teesAvailable: [
      { id: "comp", name: "Competició (FCPP)", color: "#3b82f6", textColor: "#fff", offsetMeters: 0 },
      { id: "social", name: "Social / Groga", color: "#eab308", textColor: "#000", offsetMeters: -4 }
    ]
  },
{
    id: "pp-fornells",
    name: "Pitch & Putt Fornells",
    municipality: "Fornells de la Selva",
    province: "Girona",
    type: "Pitch & Putt",
    federation: "FCPP",
    holesCount: 18,
    lat: 41.927671,
    lng: 2.824376,
    website: "https://www.fornellspark.com",
    teesAvailable: [
      { id: "comp", name: "Competició (FCPP)", color: "#3b82f6", textColor: "#fff", offsetMeters: 0 },
      { id: "social", name: "Social / Groga", color: "#eab308", textColor: "#000", offsetMeters: -4 }
    ]
  },
{
    id: "pp-mas-pages",
    name: "Mas Pagès Pitch & Putt",
    municipality: "Sant Esteve de Guialbes (Vilademuls)",
    province: "Girona",
    type: "Pitch & Putt",
    federation: "FCPP",
    holesCount: 18,
    lat: 42.117785,
    lng: 2.873997,
    website: "https://www.maspages.com",
    teesAvailable: [
      { id: "comp", name: "Competició (FCPP)", color: "#3b82f6", textColor: "#fff", offsetMeters: 0 },
      { id: "social", name: "Social / Groga", color: "#eab308", textColor: "#000", offsetMeters: -4 }
    ]
  },
{
    id: "pp-platja-daro",
    name: "Golf Pitch & Putt Platja d'Aro",
    municipality: "Castell-Platja d'Aro",
    province: "Girona",
    type: "Pitch & Putt",
    federation: "FCPP",
    holesCount: 18,
    lat: 41.818248,
    lng: 3.054100,
    website: "https://www.pitchandputtplatjadaro.com",
    teesAvailable: [
      { id: "comp", name: "Competició (FCPP)", color: "#3b82f6", textColor: "#fff", offsetMeters: 0 },
      { id: "social", name: "Social / Groga", color: "#eab308", textColor: "#000", offsetMeters: -4 }
    ]
  },
{
    id: "pp-mas-torrellas",
    name: "Mas Torrelles Pitch & Putt",
    municipality: "Santa Cristina d'Aro",
    province: "Girona",
    type: "Pitch & Putt",
    federation: "FCPP",
    holesCount: 18,
    lat: 41.814216,
    lng: 3.018303,
    website: "https://www.mastorrellas.com",
    teesAvailable: [
      { id: "comp", name: "Competició (FCPP)", color: "#3b82f6", textColor: "#fff", offsetMeters: 0 },
      { id: "social", name: "Social / Groga", color: "#eab308", textColor: "#000", offsetMeters: -4 }
    ]
  },
{
    id: "pp-mas-tapiolas",
    name: "Pitch & Putt Mas Tapiolas",
    municipality: "Santa Cristina d'Aro",
    province: "Girona",
    type: "Pitch & Putt",
    federation: "FCPP",
    holesCount: 18,
    lat: 41.818054,
    lng: 2.963392,
    website: "",
    teesAvailable: [
      { id: "comp", name: "Competició (FCPP)", color: "#3b82f6", textColor: "#fff", offsetMeters: 0 },
      { id: "social", name: "Social / Groga", color: "#eab308", textColor: "#000", offsetMeters: -4 }
    ]
  },
{
    id: "pp-castello-empuriabrava",
    name: "Pitch & Putt Castelló Empuriabrava",
    municipality: "Castelló d'Empúries",
    province: "Girona",
    type: "Pitch & Putt",
    federation: "FCPP",
    holesCount: 18,
    lat: 42.249209,
    lng: 3.071027,
    website: "",
    teesAvailable: [
      { id: "comp", name: "Competició (FCPP)", color: "#3b82f6", textColor: "#fff", offsetMeters: 0 },
      { id: "social", name: "Social / Groga", color: "#eab308", textColor: "#000", offsetMeters: -4 }
    ],
    osmVerified: true,
    holes: [
      { number: 1, par: 3, hcp: 1, officialMeters: 69, tee: { lat: 42.24998, lng: 3.073521 }, green: { lat: 42.250075, lng: 3.072697 }, greenRadius: 8, source: "OSM" },
      { number: 2, par: 3, hcp: 2, officialMeters: 60, tee: { lat: 42.250266, lng: 3.072815 }, green: { lat: 42.250054, lng: 3.072139 }, greenRadius: 8, source: "OSM" },
      { number: 3, par: 3, hcp: 3, officialMeters: 96, tee: { lat: 42.250169, lng: 3.071838 }, green: { lat: 42.249751, lng: 3.070812 }, greenRadius: 8, source: "OSM" },
      { number: 4, par: 3, hcp: 4, officialMeters: 89, tee: { lat: 42.249925, lng: 3.070757 }, green: { lat: 42.249448, lng: 3.069893 }, greenRadius: 8, source: "OSM" },
      { number: 5, par: 3, hcp: 5, officialMeters: 84, tee: { lat: 42.249737, lng: 3.07003 }, green: { lat: 42.249378, lng: 3.069136 }, greenRadius: 8, source: "OSM" },
      { number: 6, par: 3, hcp: 6, officialMeters: 75, tee: { lat: 42.249372, lng: 3.069017 }, green: { lat: 42.248708, lng: 3.069199 }, greenRadius: 8, source: "OSM" },
      { number: 7, par: 3, hcp: 7, officialMeters: 84, tee: { lat: 42.249184, lng: 3.069552 }, green: { lat: 42.24934, lng: 3.07055 }, greenRadius: 8, source: "OSM" },
      { number: 8, par: 3, hcp: 8, officialMeters: 98, tee: { lat: 42.249474, lng: 3.070779 }, green: { lat: 42.24995, lng: 3.071774 }, greenRadius: 8, source: "OSM" },
      { number: 9, par: 3, hcp: 9, officialMeters: 90, tee: { lat: 42.249623, lng: 3.07141 }, green: { lat: 42.249829, lng: 3.072464 }, greenRadius: 8, source: "OSM" },
      { number: 10, par: 3, hcp: 10, officialMeters: 77, tee: { lat: 42.249768, lng: 3.072766 }, green: { lat: 42.249452, lng: 3.071934 }, greenRadius: 8, source: "OSM" },
      { number: 11, par: 3, hcp: 11, officialMeters: 75, tee: { lat: 42.249514, lng: 3.071239 }, green: { lat: 42.248976, lng: 3.070693 }, greenRadius: 8, source: "OSM" },
      { number: 12, par: 3, hcp: 12, officialMeters: 71, tee: { lat: 42.249132, lng: 3.070386 }, green: { lat: 42.248962, lng: 3.069558 }, greenRadius: 8, source: "OSM" },
      { number: 13, par: 3, hcp: 13, officialMeters: 69, tee: { lat: 42.24998, lng: 3.073521 }, green: { lat: 42.250075, lng: 3.072697 }, greenRadius: 8, source: "OSM" },
      { number: 14, par: 3, hcp: 14, officialMeters: 60, tee: { lat: 42.250266, lng: 3.072815 }, green: { lat: 42.250054, lng: 3.072139 }, greenRadius: 8, source: "OSM" },
      { number: 15, par: 3, hcp: 15, officialMeters: 96, tee: { lat: 42.250169, lng: 3.071838 }, green: { lat: 42.249751, lng: 3.070812 }, greenRadius: 8, source: "OSM" },
      { number: 16, par: 3, hcp: 16, officialMeters: 89, tee: { lat: 42.249925, lng: 3.070757 }, green: { lat: 42.249448, lng: 3.069893 }, greenRadius: 8, source: "OSM" },
      { number: 17, par: 3, hcp: 17, officialMeters: 84, tee: { lat: 42.249737, lng: 3.07003 }, green: { lat: 42.249378, lng: 3.069136 }, greenRadius: 8, source: "OSM" },
      { number: 18, par: 3, hcp: 18, officialMeters: 75, tee: { lat: 42.249372, lng: 3.069017 }, green: { lat: 42.248708, lng: 3.069199 }, greenRadius: 8, source: "OSM" }
    ]
  },
{
    id: "pp-peralada",
    name: "Peralada Pitch & Putt",
    municipality: "Peralada",
    province: "Girona",
    type: "Pitch & Putt",
    federation: "FCPP",
    holesCount: 18,
    lat: 42.315907,
    lng: 3.023076,
    website: "https://www.golfperalada.com",
    teesAvailable: [
      { id: "comp", name: "Competició (FCPP)", color: "#3b82f6", textColor: "#fff", offsetMeters: 0 },
      { id: "social", name: "Social / Groga", color: "#eab308", textColor: "#000", offsetMeters: -4 }
    ]
  },
{
    id: "pp-lloret",
    name: "Golf Lloret Pitch & Putt (Papalús)",
    municipality: "Lloret de Mar",
    province: "Girona",
    type: "Pitch & Putt",
    federation: "FCPP",
    holesCount: 18,
    lat: 41.698523,
    lng: 2.816379,
    website: "",
    teesAvailable: [
      { id: "comp", name: "Competició (FCPP)", color: "#3b82f6", textColor: "#fff", offsetMeters: 0 },
      { id: "social", name: "Social / Groga", color: "#eab308", textColor: "#000", offsetMeters: -4 }
    ]
  },
{
    id: "pp-can-pascual",
    name: "Pitch & Putt Can Pasqual",
    municipality: "Arbúcies",
    province: "Girona",
    type: "Pitch & Putt",
    federation: "FCPP",
    holesCount: 9,
    lat: 41.800887,
    lng: 2.542705,
    website: "",
    teesAvailable: [
      { id: "comp", name: "Competició (FCPP)", color: "#3b82f6", textColor: "#fff", offsetMeters: 0 },
      { id: "social", name: "Social / Groga", color: "#eab308", textColor: "#000", offsetMeters: -4 }
    ]
  },
{
    id: "pp-el-vendrell",
    name: "Pitch & Putt El Vendrell",
    municipality: "El Vendrell",
    province: "Tarragona",
    type: "Pitch & Putt",
    federation: "FCPP",
    holesCount: 18,
    lat: 41.204909,
    lng: 1.549882,
    website: "https://www.pitchandputtvendrell.com",
    teesAvailable: [
      { id: "comp", name: "Competició (FCPP)", color: "#3b82f6", textColor: "#fff", offsetMeters: 0 },
      { id: "social", name: "Social / Groga", color: "#eab308", textColor: "#000", offsetMeters: -4 }
    ]
  },
{
    id: "pp-cambrils",
    name: "Pitch & Putt Cambrils (Mas Gallau)",
    municipality: "Cambrils",
    province: "Tarragona",
    type: "Pitch & Putt",
    federation: "FCPP",
    holesCount: 18,
    lat: 41.088621,
    lng: 1.093825,
    website: "",
    teesAvailable: [
      { id: "comp", name: "Competició (FCPP)", color: "#3b82f6", textColor: "#fff", offsetMeters: 0 },
      { id: "social", name: "Social / Groga", color: "#eab308", textColor: "#000", offsetMeters: -4 }
    ]
  },
{
    id: "pp-costa-daurada",
    name: "Pitch & Putt Costa Daurada",
    municipality: "Tarragona / El Catllar",
    province: "Tarragona",
    type: "Pitch & Putt",
    federation: "FCPP",
    holesCount: 18,
    lat: 41.152399,
    lng: 1.323951,
    website: "https://www.golfcostadaurada.com",
    teesAvailable: [
      { id: "comp", name: "Competició (FCPP)", color: "#3b82f6", textColor: "#fff", offsetMeters: 0 },
      { id: "social", name: "Social / Groga", color: "#eab308", textColor: "#000", offsetMeters: -4 }
    ]
  },
{
    id: "pp-la-figuerola",
    name: "Pitch & Putt La Figuerola",
    municipality: "Vandellòs i l'Hospitalet de l'Infant",
    province: "Tarragona",
    type: "Pitch & Putt",
    federation: "FCPP",
    holesCount: 18,
    lat: 41.030794,
    lng: 0.812333,
    website: "",
    teesAvailable: [
      { id: "comp", name: "Competició (FCPP)", color: "#3b82f6", textColor: "#fff", offsetMeters: 0 },
      { id: "social", name: "Social / Groga", color: "#eab308", textColor: "#000", offsetMeters: -4 }
    ]
  },
{
    id: "pp-lampolla",
    name: "Pitch & Putt L'Ampolla",
    municipality: "L'Ampolla",
    province: "Tarragona",
    type: "Pitch & Putt",
    federation: "FCPP",
    holesCount: 18,
    lat: 40.791066,
    lng: 0.680415,
    website: "",
    teesAvailable: [
      { id: "comp", name: "Competició (FCPP)", color: "#3b82f6", textColor: "#fff", offsetMeters: 0 },
      { id: "social", name: "Social / Groga", color: "#eab308", textColor: "#000", offsetMeters: -4 }
    ]
  },
{
    id: "pp-bellpuig",
    name: "Golf Urgell Pitch & Putt Bellpuig",
    municipality: "Bellpuig",
    province: "Lleida",
    type: "Pitch & Putt",
    federation: "FCPP",
    holesCount: 18,
    lat: 41.646817,
    lng: 1.001162,
    website: "",
    teesAvailable: [
      { id: "comp", name: "Competició (FCPP)", color: "#3b82f6", textColor: "#fff", offsetMeters: 0 },
      { id: "social", name: "Social / Groga", color: "#eab308", textColor: "#000", offsetMeters: -4 }
    ]
  },
{
    id: "pp-bonarea",
    name: "BonÀrea Golf Pitch & Putt",
    municipality: "Massoteres (Guissona)",
    province: "Lleida",
    type: "Pitch & Putt",
    federation: "FCPP",
    holesCount: 18,
    lat: 41.808591,
    lng: 1.316401,
    website: "",
    teesAvailable: [
      { id: "comp", name: "Competició (FCPP)", color: "#3b82f6", textColor: "#fff", offsetMeters: 0 },
      { id: "social", name: "Social / Groga", color: "#eab308", textColor: "#000", offsetMeters: -4 }
    ]
  },
{
    id: "pp-lleida",
    name: "Pitch & Putt Lleida (Torre-serona)",
    municipality: "Torre-serona",
    province: "Lleida",
    type: "Pitch & Putt",
    federation: "FCPP",
    holesCount: 18,
    lat: 41.670051,
    lng: 0.643862,
    website: "",
    teesAvailable: [
      { id: "comp", name: "Competició (FCPP)", color: "#3b82f6", textColor: "#fff", offsetMeters: 0 },
      { id: "social", name: "Social / Groga", color: "#eab308", textColor: "#000", offsetMeters: -4 }
    ],
    osmVerified: true,
    holes: [
      { number: 1, par: 3, hcp: 1, officialMeters: 84, tee: { lat: 41.671501, lng: 0.642027 }, green: { lat: 41.670933, lng: 0.6427 }, greenRadius: 8, source: "OSM" },
      { number: 2, par: 3, hcp: 2, officialMeters: 93, tee: { lat: 41.671117, lng: 0.64293 }, green: { lat: 41.67045, lng: 0.643611 }, greenRadius: 8, source: "OSM" },
      { number: 3, par: 3, hcp: 3, officialMeters: 76, tee: { lat: 41.66989, lng: 0.643739 }, green: { lat: 41.669648, lng: 0.644595 }, greenRadius: 8, source: "OSM" },
      { number: 4, par: 3, hcp: 4, officialMeters: 72, tee: { lat: 41.669491, lng: 0.644795 }, green: { lat: 41.669974, lng: 0.645374 }, greenRadius: 8, source: "OSM" },
      { number: 5, par: 3, hcp: 5, officialMeters: 93, tee: { lat: 41.670207, lng: 0.645722 }, green: { lat: 41.671039, lng: 0.645806 }, greenRadius: 8, source: "OSM" },
      { number: 6, par: 3, hcp: 6, officialMeters: 118, tee: { lat: 41.671299, lng: 0.645251 }, green: { lat: 41.670241, lng: 0.645141 }, greenRadius: 8, source: "OSM" },
      { number: 7, par: 3, hcp: 7, officialMeters: 87, tee: { lat: 41.66987, lng: 0.644787 }, green: { lat: 41.670152, lng: 0.643807 }, greenRadius: 8, source: "OSM" },
      { number: 8, par: 3, hcp: 8, officialMeters: 74, tee: { lat: 41.66993, lng: 0.64335 }, green: { lat: 41.67055, lng: 0.643031 }, greenRadius: 8, source: "OSM" },
      { number: 9, par: 3, hcp: 9, officialMeters: 92, tee: { lat: 41.670559, lng: 0.642745 }, green: { lat: 41.671134, lng: 0.641942 }, greenRadius: 8, source: "OSM" },
      { number: 10, par: 3, hcp: 10, officialMeters: 66, tee: { lat: 41.671568, lng: 0.641715 }, green: { lat: 41.671, lng: 0.641468 }, greenRadius: 8, source: "OSM" },
      { number: 11, par: 3, hcp: 11, officialMeters: 96, tee: { lat: 41.67081, lng: 0.641865 }, green: { lat: 41.670198, lng: 0.642671 }, greenRadius: 8, source: "OSM" },
      { number: 12, par: 3, hcp: 12, officialMeters: 74, tee: { lat: 41.670057, lng: 0.642308 }, green: { lat: 41.669686, lng: 0.643043 }, greenRadius: 8, source: "OSM" },
      { number: 13, par: 3, hcp: 13, officialMeters: 98, tee: { lat: 41.669953, lng: 0.643439 }, green: { lat: 41.669257, lng: 0.644164 }, greenRadius: 8, source: "OSM" },
      { number: 14, par: 3, hcp: 14, officialMeters: 68, tee: { lat: 41.669402, lng: 0.644821 }, green: { lat: 41.66894, lng: 0.644284 }, greenRadius: 8, source: "OSM" },
      { number: 15, par: 3, hcp: 15, officialMeters: 106, tee: { lat: 41.668767, lng: 0.644132 }, green: { lat: 41.669409, lng: 0.643186 }, greenRadius: 8, source: "OSM" },
      { number: 16, par: 3, hcp: 16, officialMeters: 107, tee: { lat: 41.669496, lng: 0.642866 }, green: { lat: 41.670007, lng: 0.641771 }, greenRadius: 8, source: "OSM" },
      { number: 17, par: 3, hcp: 17, officialMeters: 73, tee: { lat: 41.670109, lng: 0.642242 }, green: { lat: 41.670592, lng: 0.64164 }, greenRadius: 8, source: "OSM" },
      { number: 18, par: 3, hcp: 18, officialMeters: 74, tee: { lat: 41.671145, lng: 0.641117 }, green: { lat: 41.67178, lng: 0.641379 }, greenRadius: 8, source: "OSM" }
    ]
  },
{
    id: "pp-xixerella",
    name: "Vall d'Ordino / Xixerella Pitch & Putt",
    municipality: "Erts - La Massana (Andorra)",
    province: "Andorra (Associat FCPP)",
    type: "Pitch & Putt",
    federation: "FCPP",
    holesCount: 18,
    lat: 42.553000,
    lng: 1.489100,
    website: "https://www.xixerellapark.com",
    teesAvailable: [
      { id: "comp", name: "Competició (FCPP)", color: "#3b82f6", textColor: "#fff", offsetMeters: 0 },
      { id: "social", name: "Social / Groga", color: "#eab308", textColor: "#000", offsetMeters: -4 }
    ]
  },
{
    id: "golf-el-prat",
    name: "Real Club de Golf El Prat",
    municipality: "Terrassa",
    province: "Barcelona",
    type: "Golf",
    federation: "FCGolf",
    holesCount: 18,
    lat: 41.572342,
    lng: 2.055587,
    website: "https://www.realclubdegolfelprat.com",
    teesAvailable: [
      { id: "white", name: "Blanques", color: "#f8fafc", textColor: "#0f172a", offsetMeters: 15 },
      { id: "yellow", name: "Grogues", color: "#eab308", textColor: "#000", offsetMeters: 0 },
      { id: "blue", name: "Blaves", color: "#3b82f6", textColor: "#fff", offsetMeters: -18 },
      { id: "red", name: "Vermelles", color: "#ef4444", textColor: "#fff", offsetMeters: -32 }
    ]
  },
{
    id: "golf-sant-cugat",
    name: "Club de Golf Sant Cugat",
    municipality: "Sant Cugat del Vallès",
    province: "Barcelona",
    type: "Golf",
    federation: "FCGolf",
    holesCount: 18,
    lat: 41.461872,
    lng: 2.079503,
    website: "https://www.golfsantcugat.com",
    teesAvailable: [
      { id: "white", name: "Blanques", color: "#f8fafc", textColor: "#0f172a", offsetMeters: 12 },
      { id: "yellow", name: "Grogues", color: "#eab308", textColor: "#000", offsetMeters: 0 },
      { id: "blue", name: "Blaves", color: "#3b82f6", textColor: "#fff", offsetMeters: -15 },
      { id: "red", name: "Vermelles", color: "#ef4444", textColor: "#fff", offsetMeters: -28 }
    ]
  },
{
    id: "golf-vallromanes",
    name: "Club de Golf Vallromanes",
    municipality: "Vallromanes",
    province: "Barcelona",
    type: "Golf",
    federation: "FCGolf",
    holesCount: 18,
    lat: 41.533363,
    lng: 2.285529,
    website: "https://www.clubdegolfvallromanes.com",
    teesAvailable: [
      { id: "white", name: "Blanques", color: "#f8fafc", textColor: "#0f172a", offsetMeters: 15 },
      { id: "yellow", name: "Grogues", color: "#eab308", textColor: "#000", offsetMeters: 0 },
      { id: "blue", name: "Blaves", color: "#3b82f6", textColor: "#fff", offsetMeters: -18 },
      { id: "red", name: "Vermelles", color: "#ef4444", textColor: "#fff", offsetMeters: -32 }
    ],
    osmVerified: true,
    holes: [
      { number: 1, par: 4, hcp: 1, officialMeters: 313, tee: { lat: 41.532337, lng: 2.286041 }, green: { lat: 41.535033, lng: 2.28711 }, greenRadius: 13, source: "OSM" },
      { number: 2, par: 3, hcp: 2, officialMeters: 152, tee: { lat: 41.535319, lng: 2.287307 }, green: { lat: 41.535455, lng: 2.285493 }, greenRadius: 13, source: "OSM" },
      { number: 3, par: 4, hcp: 3, officialMeters: 320, tee: { lat: 41.53624, lng: 2.284796 }, green: { lat: 41.533384, lng: 2.285323 }, greenRadius: 13, source: "OSM" },
      { number: 4, par: 4, hcp: 4, officialMeters: 427, tee: { lat: 41.53279, lng: 2.285286 }, green: { lat: 41.536546, lng: 2.284221 }, greenRadius: 13, source: "OSM" },
      { number: 5, par: 4, hcp: 5, officialMeters: 277, tee: { lat: 41.537046, lng: 2.283913 }, green: { lat: 41.534565, lng: 2.283596 }, greenRadius: 13, source: "OSM" },
      { number: 6, par: 4, hcp: 6, officialMeters: 241, tee: { lat: 41.535408, lng: 2.28313 }, green: { lat: 41.53753, lng: 2.283742 }, greenRadius: 13, source: "OSM" },
      { number: 7, par: 3, hcp: 7, officialMeters: 151, tee: { lat: 41.537774, lng: 2.283895 }, green: { lat: 41.537754, lng: 2.282077 }, greenRadius: 13, source: "OSM" },
      { number: 8, par: 4, hcp: 8, officialMeters: 327, tee: { lat: 41.538182, lng: 2.281519 }, green: { lat: 41.535401, lng: 2.28281 }, greenRadius: 13, source: "OSM" },
      { number: 9, par: 5, hcp: 9, officialMeters: 455, tee: { lat: 41.535713, lng: 2.282164 }, green: { lat: 41.532314, lng: 2.285207 }, greenRadius: 13, source: "OSM" },
      { number: 10, par: 4, hcp: 10, officialMeters: 349, tee: { lat: 41.532109, lng: 2.286015 }, green: { lat: 41.532721, lng: 2.290124 }, greenRadius: 13, source: "OSM" },
      { number: 11, par: 5, hcp: 11, officialMeters: 445, tee: { lat: 41.531897, lng: 2.290145 }, green: { lat: 41.527914, lng: 2.290702 }, greenRadius: 13, source: "OSM" },
      { number: 12, par: 3, hcp: 12, officialMeters: 177, tee: { lat: 41.526733, lng: 2.291106 }, green: { lat: 41.525148, lng: 2.291238 }, greenRadius: 13, source: "OSM" },
      { number: 13, par: 4, hcp: 13, officialMeters: 259, tee: { lat: 41.52464, lng: 2.291528 }, green: { lat: 41.522334, lng: 2.291082 }, greenRadius: 13, source: "OSM" },
      { number: 14, par: 4, hcp: 14, officialMeters: 255, tee: { lat: 41.522457, lng: 2.291537 }, green: { lat: 41.524605, lng: 2.292607 }, greenRadius: 13, source: "OSM" },
      { number: 15, par: 4, hcp: 15, officialMeters: 256, tee: { lat: 41.52518, lng: 2.291867 }, green: { lat: 41.527332, lng: 2.290791 }, greenRadius: 13, source: "OSM" },
      { number: 16, par: 5, hcp: 16, officialMeters: 491, tee: { lat: 41.527223, lng: 2.290264 }, green: { lat: 41.531115, lng: 2.287485 }, greenRadius: 13, source: "OSM" },
      { number: 17, par: 3, hcp: 17, officialMeters: 180, tee: { lat: 41.531501, lng: 2.286873 }, green: { lat: 41.531968, lng: 2.28894 }, greenRadius: 13, source: "OSM" },
      { number: 18, par: 4, hcp: 18, officialMeters: 327, tee: { lat: 41.532368, lng: 2.290177 }, green: { lat: 41.53172, lng: 2.286341 }, greenRadius: 13, source: "OSM" }
    ]
  },
{
    id: "golf-terramar",
    name: "Club de Golf Terramar",
    municipality: "Sitges",
    province: "Barcelona",
    type: "Golf",
    federation: "FCGolf",
    holesCount: 18,
    lat: 41.226552,
    lng: 1.780987,
    website: "https://www.golfterramar.com",
    teesAvailable: [
      { id: "white", name: "Blanques", color: "#f8fafc", textColor: "#0f172a", offsetMeters: 14 },
      { id: "yellow", name: "Grogues", color: "#eab308", textColor: "#000", offsetMeters: 0 },
      { id: "blue", name: "Blaves", color: "#3b82f6", textColor: "#fff", offsetMeters: -16 },
      { id: "red", name: "Vermelles", color: "#ef4444", textColor: "#fff", offsetMeters: -30 }
    ]
  },
{
    id: "golf-llavaneras",
    name: "Club de Golf Llavaneres",
    municipality: "Sant Andreu de Llavaneres",
    province: "Barcelona",
    type: "Golf",
    federation: "FCGolf",
    holesCount: 18,
    lat: 41.562377,
    lng: 2.484468,
    website: "https://www.golfllavaneras.com",
    teesAvailable: [
      { id: "white", name: "Blanques", color: "#f8fafc", textColor: "#0f172a", offsetMeters: 12 },
      { id: "yellow", name: "Grogues", color: "#eab308", textColor: "#000", offsetMeters: 0 },
      { id: "blue", name: "Blaves", color: "#3b82f6", textColor: "#fff", offsetMeters: -14 },
      { id: "red", name: "Vermelles", color: "#ef4444", textColor: "#fff", offsetMeters: -25 }
    ],
    osmVerified: true,
    holes: [
      { number: 1, par: 4, hcp: 17, officialMeters: 234, tee: { lat: 41.563848, lng: 2.487213 }, green: { lat: 41.563347, lng: 2.484478 }, greenRadius: 13, source: "OSM" },
      { number: 2, par: 3, hcp: 13, officialMeters: 146, tee: { lat: 41.563791, lng: 2.483836 }, green: { lat: 41.562618, lng: 2.483048 }, greenRadius: 13, source: "OSM" },
      { number: 3, par: 5, hcp: 1, officialMeters: 484, tee: { lat: 41.562375, lng: 2.482998 }, green: { lat: 41.563714, lng: 2.488537 }, greenRadius: 13, source: "OSM" },
      { number: 4, par: 4, hcp: 5, officialMeters: 284, tee: { lat: 41.563437, lng: 2.488564 }, green: { lat: 41.56283, lng: 2.485253 }, greenRadius: 13, source: "OSM" },
      { number: 5, par: 3, hcp: 5, officialMeters: 178, tee: { lat: 41.562796, lng: 2.484909 }, green: { lat: 41.562033, lng: 2.483021 }, greenRadius: 13, source: "OSM" },
      { number: 6, par: 4, hcp: 9, officialMeters: 279, tee: { lat: 41.561506, lng: 2.482931 }, green: { lat: 41.562283, lng: 2.486113 }, greenRadius: 13, source: "OSM" },
      { number: 7, par: 5, hcp: 3, officialMeters: 397, tee: { lat: 41.56211, lng: 2.485316 }, green: { lat: 41.559686, lng: 2.48182 }, greenRadius: 13, source: "OSM" },
      { number: 8, par: 3, hcp: 15, officialMeters: 121, tee: { lat: 41.559517, lng: 2.482161 }, green: { lat: 41.55997, lng: 2.483478 }, greenRadius: 13, source: "OSM" },
      { number: 9, par: 4, hcp: 11, officialMeters: 277, tee: { lat: 41.560358, lng: 2.483292 }, green: { lat: 41.561921, lng: 2.485886 }, greenRadius: 13, source: "OSM" },
      { number: 10, par: 4, hcp: 12, officialMeters: 279, tee: { lat: 41.561877, lng: 2.486415 }, green: { lat: 41.560304, lng: 2.483801 }, greenRadius: 13, source: "OSM" },
      { number: 11, par: 4, hcp: 2, officialMeters: 266, tee: { lat: 41.559408, lng: 2.482595 }, green: { lat: 41.558921, lng: 2.479461 }, greenRadius: 13, source: "OSM" },
      { number: 12, par: 4, hcp: 4, officialMeters: 318, tee: { lat: 41.558674, lng: 2.47911 }, green: { lat: 41.561166, lng: 2.477236 }, greenRadius: 13, source: "OSM" },
      { number: 13, par: 4, hcp: 10, officialMeters: 263, tee: { lat: 41.561423, lng: 2.477671 }, green: { lat: 41.559342, lng: 2.479166 }, greenRadius: 13, source: "OSM" },
      { number: 14, par: 4, hcp: 8, officialMeters: 300, tee: { lat: 41.559142, lng: 2.479695 }, green: { lat: 41.560785, lng: 2.482547 }, greenRadius: 13, source: "OSM" },
      { number: 15, par: 3, hcp: 18, officialMeters: 98, tee: { lat: 41.561059, lng: 2.482672 }, green: { lat: 41.561511, lng: 2.481656 }, greenRadius: 13, source: "OSM" },
      { number: 16, par: 5, hcp: 6, officialMeters: 408, tee: { lat: 41.561306, lng: 2.48267 }, green: { lat: 41.564863, lng: 2.483865 }, greenRadius: 13, source: "OSM" },
      { number: 17, par: 4, hcp: 16, officialMeters: 251, tee: { lat: 41.565584, lng: 2.484113 }, green: { lat: 41.563326, lng: 2.484103 }, greenRadius: 13, source: "OSM" },
      { number: 18, par: 3, hcp: 14, officialMeters: 123, tee: { lat: 41.563635, lng: 2.484519 }, green: { lat: 41.564068, lng: 2.485876 }, greenRadius: 13, source: "OSM" }
    ]
  },
{
    id: "golf-barcelona",
    name: "Club de Golf Barcelona (Masia Bach)",
    municipality: "Sant Esteve Sesrovires",
    province: "Barcelona",
    type: "Golf",
    federation: "FCGolf",
    holesCount: 18,
    lat: 41.496707,
    lng: 1.850037,
    website: "https://www.golfbarcelona.com",
    teesAvailable: [
      { id: "white", name: "Blanques", color: "#f8fafc", textColor: "#0f172a", offsetMeters: 15 },
      { id: "yellow", name: "Grogues", color: "#eab308", textColor: "#000", offsetMeters: 0 },
      { id: "blue", name: "Blaves", color: "#3b82f6", textColor: "#fff", offsetMeters: -18 },
      { id: "red", name: "Vermelles", color: "#ef4444", textColor: "#fff", offsetMeters: -32 }
    ],
    osmVerified: true,
    holes: [
      { number: 1, par: 3, hcp: 3, officialMeters: 200, tee: { lat: 41.490757, lng: 1.856418 }, green: { lat: 41.491009, lng: 1.858799 }, greenRadius: 13, source: "OSM" },
      { number: 2, par: 3, hcp: 15, officialMeters: 99, tee: { lat: 41.491156, lng: 1.859252 }, green: { lat: 41.490485, lng: 1.860039 }, greenRadius: 13, source: "OSM" },
      { number: 3, par: 3, hcp: 11, officialMeters: 128, tee: { lat: 41.490278, lng: 1.859748 }, green: { lat: 41.489132, lng: 1.8596 }, greenRadius: 13, source: "OSM" },
      { number: 4, par: 4, hcp: 7, officialMeters: 254, tee: { lat: 41.489299, lng: 1.859235 }, green: { lat: 41.487079, lng: 1.8585 }, greenRadius: 13, source: "OSM" },
      { number: 5, par: 4, hcp: 1, officialMeters: 267, tee: { lat: 41.487507, lng: 1.858206 }, green: { lat: 41.486098, lng: 1.855609 }, greenRadius: 13, source: "OSM" },
      { number: 6, par: 3, hcp: 9, officialMeters: 152, tee: { lat: 41.486411, lng: 1.85575 }, green: { lat: 41.487189, lng: 1.857257 }, greenRadius: 13, source: "OSM" },
      { number: 7, par: 5, hcp: 5, officialMeters: 398, tee: { lat: 41.487381, lng: 1.856861 }, green: { lat: 41.49054, lng: 1.859114 }, greenRadius: 13, source: "OSM" },
      { number: 8, par: 3, hcp: 13, officialMeters: 105, tee: { lat: 41.490621, lng: 1.858576 }, green: { lat: 41.490481, lng: 1.857334 }, greenRadius: 13, source: "OSM" },
      { number: 9, par: 3, hcp: 17, officialMeters: 86, tee: { lat: 41.490517, lng: 1.856878 }, green: { lat: 41.490418, lng: 1.855857 }, greenRadius: 13, source: "OSM" },
      { number: 10, par: 3, hcp: 10, officialMeters: 200, tee: { lat: 41.490757, lng: 1.856418 }, green: { lat: 41.491009, lng: 1.858799 }, greenRadius: 13, source: "OSM" },
      { number: 11, par: 3, hcp: 11, officialMeters: 99, tee: { lat: 41.491156, lng: 1.859252 }, green: { lat: 41.490485, lng: 1.860039 }, greenRadius: 13, source: "OSM" },
      { number: 12, par: 3, hcp: 12, officialMeters: 128, tee: { lat: 41.490278, lng: 1.859748 }, green: { lat: 41.489132, lng: 1.8596 }, greenRadius: 13, source: "OSM" },
      { number: 13, par: 4, hcp: 13, officialMeters: 254, tee: { lat: 41.489299, lng: 1.859235 }, green: { lat: 41.487079, lng: 1.8585 }, greenRadius: 13, source: "OSM" },
      { number: 14, par: 4, hcp: 14, officialMeters: 267, tee: { lat: 41.487507, lng: 1.858206 }, green: { lat: 41.486098, lng: 1.855609 }, greenRadius: 13, source: "OSM" },
      { number: 15, par: 3, hcp: 15, officialMeters: 152, tee: { lat: 41.486411, lng: 1.85575 }, green: { lat: 41.487189, lng: 1.857257 }, greenRadius: 13, source: "OSM" },
      { number: 16, par: 5, hcp: 16, officialMeters: 398, tee: { lat: 41.487381, lng: 1.856861 }, green: { lat: 41.49054, lng: 1.859114 }, greenRadius: 13, source: "OSM" },
      { number: 17, par: 3, hcp: 17, officialMeters: 105, tee: { lat: 41.490621, lng: 1.858576 }, green: { lat: 41.490481, lng: 1.857334 }, greenRadius: 13, source: "OSM" },
      { number: 18, par: 3, hcp: 18, officialMeters: 86, tee: { lat: 41.490517, lng: 1.856878 }, green: { lat: 41.490418, lng: 1.855857 }, greenRadius: 13, source: "OSM" }
    ]
  },
{
    id: "golf-la-roca",
    name: "Golf La Roca",
    municipality: "La Roca del Vallès",
    province: "Barcelona",
    type: "Golf",
    federation: "FCGolf",
    holesCount: 18,
    lat: 41.630225,
    lng: 2.352203,
    website: "https://www.golflaroca.com",
    teesAvailable: [
      { id: "white", name: "Blanques", color: "#f8fafc", textColor: "#0f172a", offsetMeters: 15 },
      { id: "yellow", name: "Grogues", color: "#eab308", textColor: "#000", offsetMeters: 0 },
      { id: "blue", name: "Blaves", color: "#3b82f6", textColor: "#fff", offsetMeters: -18 },
      { id: "red", name: "Vermelles", color: "#ef4444", textColor: "#fff", offsetMeters: -32 }
    ],
    osmVerified: true,
    holes: [
      { number: 1, par: 4, hcp: 4, officialMeters: 383, tee: { lat: 41.625965, lng: 2.348938 }, green: { lat: 41.62888, lng: 2.351391 }, greenRadius: 13, source: "OSM" },
      { number: 2, par: 5, hcp: 2, officialMeters: 412, tee: { lat: 41.630004, lng: 2.353022 }, green: { lat: 41.633593, lng: 2.354256 }, greenRadius: 13, source: "OSM" },
      { number: 3, par: 3, hcp: 14, officialMeters: 152, tee: { lat: 41.633941, lng: 2.355342 }, green: { lat: 41.632808, lng: 2.35431 }, greenRadius: 13, source: "OSM" },
      { number: 4, par: 5, hcp: 16, officialMeters: 486, tee: { lat: 41.632764, lng: 2.354858 }, green: { lat: 41.628421, lng: 2.354218 }, greenRadius: 13, source: "OSM" },
      { number: 5, par: 4, hcp: 10, officialMeters: 396, tee: { lat: 41.628458, lng: 2.353672 }, green: { lat: 41.63199, lng: 2.354249 }, greenRadius: 13, source: "OSM" },
      { number: 6, par: 3, hcp: 6, officialMeters: 203, tee: { lat: 41.630812, lng: 2.353707 }, green: { lat: 41.629047, lng: 2.353073 }, greenRadius: 13, source: "OSM" },
      { number: 7, par: 4, hcp: 18, officialMeters: 255, tee: { lat: 41.627857, lng: 2.353408 }, green: { lat: 41.625872, lng: 2.351874 }, greenRadius: 13, source: "OSM" },
      { number: 8, par: 4, hcp: 12, officialMeters: 365, tee: { lat: 41.625669, lng: 2.3503 }, green: { lat: 41.62839, lng: 2.352751 }, greenRadius: 13, source: "OSM" },
      { number: 9, par: 4, hcp: 8, officialMeters: 335, tee: { lat: 41.628579, lng: 2.351792 }, green: { lat: 41.626007, lng: 2.349699 }, greenRadius: 13, source: "OSM" },
      { number: 10, par: 4, hcp: 9, officialMeters: 293, tee: { lat: 41.626408, lng: 2.348761 }, green: { lat: 41.628793, lng: 2.350264 }, greenRadius: 13, source: "OSM" },
      { number: 11, par: 4, hcp: 5, officialMeters: 323, tee: { lat: 41.62979, lng: 2.349871 }, green: { lat: 41.632619, lng: 2.350726 }, greenRadius: 13, source: "OSM" },
      { number: 12, par: 3, hcp: 11, officialMeters: 166, tee: { lat: 41.633022, lng: 2.350807 }, green: { lat: 41.634488, lng: 2.351215 }, greenRadius: 13, source: "OSM" },
      { number: 13, par: 5, hcp: 7, officialMeters: 519, tee: { lat: 41.634215, lng: 2.352177 }, green: { lat: 41.62958, lng: 2.35149 }, greenRadius: 13, source: "OSM" },
      { number: 14, par: 4, hcp: 1, officialMeters: 401, tee: { lat: 41.629446, lng: 2.352033 }, green: { lat: 41.633023, lng: 2.352618 }, greenRadius: 13, source: "OSM" },
      { number: 15, par: 4, hcp: 15, officialMeters: 277, tee: { lat: 41.633484, lng: 2.352749 }, green: { lat: 41.635898, lng: 2.351911 }, greenRadius: 13, source: "OSM" },
      { number: 16, par: 3, hcp: 13, officialMeters: 127, tee: { lat: 41.635972, lng: 2.351383 }, green: { lat: 41.634837, lng: 2.351579 }, greenRadius: 13, source: "OSM" },
      { number: 17, par: 5, hcp: 3, officialMeters: 517, tee: { lat: 41.634173, lng: 2.351683 }, green: { lat: 41.629614, lng: 2.350484 }, greenRadius: 13, source: "OSM" },
      { number: 18, par: 3, hcp: 17, officialMeters: 117, tee: { lat: 41.628685, lng: 2.349729 }, green: { lat: 41.628139, lng: 2.348525 }, greenRadius: 13, source: "OSM" }
    ]
  },
{
    id: "golf-montanya",
    name: "Club de Golf Montanyà",
    municipality: "El Brull",
    province: "Barcelona",
    type: "Golf",
    federation: "FCGolf",
    holesCount: 18,
    lat: 41.818767,
    lng: 2.280783,
    website: "https://www.golfmontanya.com",
    teesAvailable: [
      { id: "white", name: "Blanques", color: "#f8fafc", textColor: "#0f172a", offsetMeters: 15 },
      { id: "yellow", name: "Grogues", color: "#eab308", textColor: "#000", offsetMeters: 0 },
      { id: "blue", name: "Blaves", color: "#3b82f6", textColor: "#fff", offsetMeters: -18 },
      { id: "red", name: "Vermelles", color: "#ef4444", textColor: "#fff", offsetMeters: -32 }
    ]
  },
{
    id: "golf-camiral",
    name: "Camiral Golf & Wellness (PGA Catalunya)",
    municipality: "Caldes de Malavella",
    province: "Girona",
    type: "Golf",
    federation: "FCGolf",
    holesCount: 18,
    lat: 41.857125,
    lng: 2.763864,
    website: "https://www.camiral.com",
    teesAvailable: [
      { id: "white", name: "Blanques", color: "#f8fafc", textColor: "#0f172a", offsetMeters: 18 },
      { id: "yellow", name: "Grogues", color: "#eab308", textColor: "#000", offsetMeters: 0 },
      { id: "blue", name: "Blaves", color: "#3b82f6", textColor: "#fff", offsetMeters: -18 },
      { id: "red", name: "Vermelles", color: "#ef4444", textColor: "#fff", offsetMeters: -35 }
    ],
    osmVerified: true,
    holes: [
      { number: 1, par: 4, hcp: 3, officialMeters: 377, tee: { lat: 41.856086, lng: 2.762196 }, green: { lat: 41.853273, lng: 2.759657 }, greenRadius: 13, source: "OSM" },
      { number: 2, par: 4, hcp: 5, officialMeters: 346, tee: { lat: 41.852275, lng: 2.760526 }, green: { lat: 41.855165, lng: 2.762058 }, greenRadius: 13, source: "OSM" },
      { number: 3, par: 5, hcp: 13, officialMeters: 507, tee: { lat: 41.854841, lng: 2.762362 }, green: { lat: 41.850293, lng: 2.761883 }, greenRadius: 13, source: "OSM" },
      { number: 4, par: 4, hcp: 9, officialMeters: 367, tee: { lat: 41.849451, lng: 2.761868 }, green: { lat: 41.85234, lng: 2.759735 }, greenRadius: 13, source: "OSM" },
      { number: 5, par: 3, hcp: 7, officialMeters: 186, tee: { lat: 41.852895, lng: 2.758431 }, green: { lat: 41.851325, lng: 2.759208 }, greenRadius: 13, source: "OSM" },
      { number: 6, par: 4, hcp: 11, officialMeters: 362, tee: { lat: 41.850513, lng: 2.759135 }, green: { lat: 41.851831, lng: 2.755146 }, greenRadius: 13, source: "OSM" },
      { number: 7, par: 5, hcp: 17, officialMeters: 526, tee: { lat: 41.851924, lng: 2.754462 }, green: { lat: 41.856048, lng: 2.757567 }, greenRadius: 13, source: "OSM" },
      { number: 8, par: 3, hcp: 15, officialMeters: 165, tee: { lat: 41.855156, lng: 2.757873 }, green: { lat: 41.853672, lng: 2.757895 }, greenRadius: 13, source: "OSM" },
      { number: 9, par: 4, hcp: 1, officialMeters: 416, tee: { lat: 41.85329, lng: 2.758539 }, green: { lat: 41.856461, lng: 2.761208 }, greenRadius: 13, source: "OSM" },
      { number: 10, par: 4, hcp: 12, officialMeters: 398, tee: { lat: 41.856104, lng: 2.763037 }, green: { lat: 41.852533, lng: 2.7633 }, greenRadius: 13, source: "OSM" },
      { number: 11, par: 3, hcp: 16, officialMeters: 171, tee: { lat: 41.852232, lng: 2.764031 }, green: { lat: 41.851031, lng: 2.76274 }, greenRadius: 13, source: "OSM" },
      { number: 12, par: 5, hcp: 14, officialMeters: 480, tee: { lat: 41.85103, lng: 2.763452 }, green: { lat: 41.851911, lng: 2.76913 }, greenRadius: 13, source: "OSM" },
      { number: 13, par: 4, hcp: 6, officialMeters: 382, tee: { lat: 41.851393, lng: 2.770265 }, green: { lat: 41.85094, lng: 2.765691 }, greenRadius: 13, source: "OSM" },
      { number: 14, par: 4, hcp: 4, officialMeters: 404, tee: { lat: 41.850141, lng: 2.765118 }, green: { lat: 41.850659, lng: 2.76995 }, greenRadius: 13, source: "OSM" },
      { number: 15, par: 5, hcp: 18, officialMeters: 441, tee: { lat: 41.851244, lng: 2.770402 }, green: { lat: 41.855106, lng: 2.771632 }, greenRadius: 13, source: "OSM" },
      { number: 16, par: 3, hcp: 10, officialMeters: 182, tee: { lat: 41.855538, lng: 2.771116 }, green: { lat: 41.85464, lng: 2.769277 }, greenRadius: 13, source: "OSM" },
      { number: 17, par: 4, hcp: 8, officialMeters: 432, tee: { lat: 41.855663, lng: 2.7689 }, green: { lat: 41.852469, lng: 2.765922 }, greenRadius: 13, source: "OSM" },
      { number: 18, par: 4, hcp: 2, officialMeters: 417, tee: { lat: 41.852436, lng: 2.765141 }, green: { lat: 41.85609, lng: 2.764024 }, greenRadius: 13, source: "OSM" }
    ]
  },
{
    id: "golf-emporda",
    name: "Empordà Golf Club",
    municipality: "Gualta",
    province: "Girona",
    type: "Golf",
    federation: "FCGolf",
    holesCount: 18,
    lat: 42.014336,
    lng: 3.139358,
    website: "https://www.empordagolf.com",
    teesAvailable: [
      { id: "white", name: "Blanques", color: "#f8fafc", textColor: "#0f172a", offsetMeters: 15 },
      { id: "yellow", name: "Grogues", color: "#eab308", textColor: "#000", offsetMeters: 0 },
      { id: "blue", name: "Blaves", color: "#3b82f6", textColor: "#fff", offsetMeters: -18 },
      { id: "red", name: "Vermelles", color: "#ef4444", textColor: "#fff", offsetMeters: -32 }
    ]
  },
{
    id: "golf-pals",
    name: "Golf de Pals",
    municipality: "Pals",
    province: "Girona",
    type: "Golf",
    federation: "FCGolf",
    holesCount: 18,
    lat: 41.992820,
    lng: 3.195312,
    website: "https://www.golfdepals.com",
    teesAvailable: [
      { id: "white", name: "Blanques", color: "#f8fafc", textColor: "#0f172a", offsetMeters: 15 },
      { id: "yellow", name: "Grogues", color: "#eab308", textColor: "#000", offsetMeters: 0 },
      { id: "blue", name: "Blaves", color: "#3b82f6", textColor: "#fff", offsetMeters: -18 },
      { id: "red", name: "Vermelles", color: "#ef4444", textColor: "#fff", offsetMeters: -32 }
    ]
  },
{
    id: "golf-infinitum",
    name: "Infinitum Golf (Lumine)",
    municipality: "Vila-seca / Salou",
    province: "Tarragona",
    type: "Golf",
    federation: "FCGolf",
    holesCount: 18,
    lat: 41.066956,
    lng: 1.156177,
    website: "https://www.infinitumliving.com",
    teesAvailable: [
      { id: "white", name: "Blanques", color: "#f8fafc", textColor: "#0f172a", offsetMeters: 15 },
      { id: "yellow", name: "Grogues", color: "#eab308", textColor: "#000", offsetMeters: 0 },
      { id: "blue", name: "Blaves", color: "#3b82f6", textColor: "#fff", offsetMeters: -18 },
      { id: "red", name: "Vermelles", color: "#ef4444", textColor: "#fff", offsetMeters: -32 }
    ],
    osmVerified: true,
    holes: [
      { number: 1, par: 4, hcp: 1, officialMeters: 357, tee: { lat: 41.077245, lng: 1.161488 }, green: { lat: 41.074862, lng: 1.164336 }, greenRadius: 13, source: "OSM" },
      { number: 2, par: 5, hcp: 2, officialMeters: 521, tee: { lat: 41.074657, lng: 1.16572 }, green: { lat: 41.071619, lng: 1.170457 }, greenRadius: 13, source: "OSM" },
      { number: 3, par: 4, hcp: 3, officialMeters: 355, tee: { lat: 41.067806, lng: 1.173296 }, green: { lat: 41.068039, lng: 1.16907 }, greenRadius: 13, source: "OSM" },
      { number: 4, par: 4, hcp: 4, officialMeters: 408, tee: { lat: 41.06773, lng: 1.167999 }, green: { lat: 41.069172, lng: 1.163523 }, greenRadius: 13, source: "OSM" },
      { number: 5, par: 4, hcp: 5, officialMeters: 355, tee: { lat: 41.067806, lng: 1.173296 }, green: { lat: 41.068039, lng: 1.16907 }, greenRadius: 13, source: "OSM" },
      { number: 6, par: 4, hcp: 6, officialMeters: 408, tee: { lat: 41.06773, lng: 1.167999 }, green: { lat: 41.069172, lng: 1.163523 }, greenRadius: 13, source: "OSM" },
      { number: 7, par: 4, hcp: 7, officialMeters: 424, tee: { lat: 41.069624, lng: 1.163425 }, green: { lat: 41.073333, lng: 1.164611 }, greenRadius: 13, source: "OSM" },
      { number: 8, par: 3, hcp: 8, officialMeters: 188, tee: { lat: 41.072703, lng: 1.166649 }, green: { lat: 41.074026, lng: 1.165255 }, greenRadius: 13, source: "OSM" },
      { number: 9, par: 4, hcp: 9, officialMeters: 407, tee: { lat: 41.07444, lng: 1.164321 }, green: { lat: 41.07587, lng: 1.159855 }, greenRadius: 13, source: "OSM" },
      { number: 10, par: 3, hcp: 10, officialMeters: 153, tee: { lat: 41.076473, lng: 1.159707 }, green: { lat: 41.075471, lng: 1.158455 }, greenRadius: 13, source: "OSM" },
      { number: 11, par: 5, hcp: 11, officialMeters: 483, tee: { lat: 41.075067, lng: 1.157221 }, green: { lat: 41.079372, lng: 1.158005 }, greenRadius: 13, source: "OSM" },
      { number: 12, par: 4, hcp: 12, officialMeters: 265, tee: { lat: 41.079379, lng: 1.157481 }, green: { lat: 41.077253, lng: 1.156042 }, greenRadius: 13, source: "OSM" },
      { number: 13, par: 4, hcp: 13, officialMeters: 400, tee: { lat: 41.077114, lng: 1.156599 }, green: { lat: 41.073537, lng: 1.157099 }, greenRadius: 13, source: "OSM" },
      { number: 14, par: 3, hcp: 14, officialMeters: 216, tee: { lat: 41.073499, lng: 1.157848 }, green: { lat: 41.071638, lng: 1.157133 }, greenRadius: 13, source: "OSM" },
      { number: 15, par: 4, hcp: 15, officialMeters: 398, tee: { lat: 41.070707, lng: 1.158052 }, green: { lat: 41.071214, lng: 1.162755 }, greenRadius: 13, source: "OSM" },
      { number: 16, par: 5, hcp: 16, officialMeters: 487, tee: { lat: 41.072055, lng: 1.163872 }, green: { lat: 41.071269, lng: 1.158161 }, greenRadius: 13, source: "OSM" },
      { number: 17, par: 4, hcp: 17, officialMeters: 290, tee: { lat: 41.071981, lng: 1.15821 }, green: { lat: 41.074551, lng: 1.157644 }, greenRadius: 13, source: "OSM" },
      { number: 18, par: 4, hcp: 18, officialMeters: 255, tee: { lat: 41.075793, lng: 1.158112 }, green: { lat: 41.077583, lng: 1.16001 }, greenRadius: 13, source: "OSM" }
    ]
  },
{
    id: "golf-cerdanya",
    name: "Reial Club de Golf de Cerdanya",
    municipality: "Bolvir / Puigcerdà",
    province: "Girona / Pirineus",
    type: "Golf",
    federation: "FCGolf",
    holesCount: 18,
    lat: 42.411062,
    lng: 1.901468,
    website: "https://www.rcgcerdanya.com",
    teesAvailable: [
      { id: "white", name: "Blanques", color: "#f8fafc", textColor: "#0f172a", offsetMeters: 15 },
      { id: "yellow", name: "Grogues", color: "#eab308", textColor: "#000", offsetMeters: 0 },
      { id: "blue", name: "Blaves", color: "#3b82f6", textColor: "#fff", offsetMeters: -18 },
      { id: "red", name: "Vermelles", color: "#ef4444", textColor: "#fff", offsetMeters: -32 }
    ],
    osmVerified: true,
    holes: [
      { number: 1, par: 5, hcp: 1, officialMeters: 441, tee: { lat: 42.414721, lng: 1.899585 }, green: { lat: 42.41081, lng: 1.898689 }, greenRadius: 13, source: "OSM" },
      { number: 2, par: 3, hcp: 2, officialMeters: 182, tee: { lat: 42.410165, lng: 1.898935 }, green: { lat: 42.411733, lng: 1.899552 }, greenRadius: 13, source: "OSM" },
      { number: 3, par: 5, hcp: 3, officialMeters: 442, tee: { lat: 42.412325, lng: 1.899698 }, green: { lat: 42.408593, lng: 1.901566 }, greenRadius: 13, source: "OSM" },
      { number: 4, par: 3, hcp: 4, officialMeters: 193, tee: { lat: 42.408068, lng: 1.90152 }, green: { lat: 42.409588, lng: 1.902643 }, greenRadius: 13, source: "OSM" },
      { number: 5, par: 4, hcp: 5, officialMeters: 309, tee: { lat: 42.408808, lng: 1.902912 }, green: { lat: 42.406482, lng: 1.900857 }, greenRadius: 13, source: "OSM" },
      { number: 6, par: 5, hcp: 6, officialMeters: 453, tee: { lat: 42.406293, lng: 1.901221 }, green: { lat: 42.408602, lng: 1.905767 }, greenRadius: 13, source: "OSM" },
      { number: 7, par: 4, hcp: 7, officialMeters: 210, tee: { lat: 42.408265, lng: 1.9063 }, green: { lat: 42.410052, lng: 1.907137 }, greenRadius: 13, source: "OSM" },
      { number: 8, par: 3, hcp: 8, officialMeters: 130, tee: { lat: 42.409291, lng: 1.906473 }, green: { lat: 42.408728, lng: 1.905078 }, greenRadius: 13, source: "OSM" },
      { number: 9, par: 4, hcp: 9, officialMeters: 370, tee: { lat: 42.409165, lng: 1.904351 }, green: { lat: 42.406643, lng: 1.901415 }, greenRadius: 13, source: "OSM" },
      { number: 10, par: 4, hcp: 10, officialMeters: 349, tee: { lat: 42.406566, lng: 1.901808 }, green: { lat: 42.40889, lng: 1.904672 }, greenRadius: 13, source: "OSM" },
      { number: 11, par: 4, hcp: 11, officialMeters: 295, tee: { lat: 42.409065, lng: 1.905291 }, green: { lat: 42.410721, lng: 1.902481 }, greenRadius: 13, source: "OSM" },
      { number: 12, par: 4, hcp: 12, officialMeters: 384, tee: { lat: 42.409417, lng: 1.902057 }, green: { lat: 42.412549, lng: 1.900099 }, greenRadius: 13, source: "OSM" },
      { number: 13, par: 4, hcp: 13, officialMeters: 328, tee: { lat: 42.411536, lng: 1.899971 }, green: { lat: 42.408742, lng: 1.898687 }, greenRadius: 13, source: "OSM" },
      { number: 14, par: 3, hcp: 14, officialMeters: 146, tee: { lat: 42.408794, lng: 1.898292 }, green: { lat: 42.410091, lng: 1.898581 }, greenRadius: 13, source: "OSM" },
      { number: 15, par: 5, hcp: 15, officialMeters: 443, tee: { lat: 42.410296, lng: 1.898291 }, green: { lat: 42.413607, lng: 1.895293 }, greenRadius: 13, source: "OSM" },
      { number: 16, par: 4, hcp: 16, officialMeters: 317, tee: { lat: 42.413807, lng: 1.895064 }, green: { lat: 42.41446, lng: 1.89882 }, greenRadius: 13, source: "OSM" },
      { number: 17, par: 3, hcp: 17, officialMeters: 182, tee: { lat: 42.414722, lng: 1.899914 }, green: { lat: 42.413147, lng: 1.899294 }, greenRadius: 13, source: "OSM" },
      { number: 18, par: 4, hcp: 18, officialMeters: 403, tee: { lat: 42.411904, lng: 1.899158 }, green: { lat: 42.415249, lng: 1.901038 }, greenRadius: 13, source: "OSM" }
    ]
  },
{
    id: "golf-fontanals",
    name: "Fontanals Golf Club",
    municipality: "Fontanals de Cerdanya",
    province: "Girona / Pirineus",
    type: "Golf",
    federation: "FCGolf",
    holesCount: 18,
    lat: 42.399313,
    lng: 1.875567,
    website: "https://www.fontanalsgolf.com",
    teesAvailable: [
      { id: "white", name: "Blanques", color: "#f8fafc", textColor: "#0f172a", offsetMeters: 15 },
      { id: "yellow", name: "Grogues", color: "#eab308", textColor: "#000", offsetMeters: 0 },
      { id: "blue", name: "Blaves", color: "#3b82f6", textColor: "#fff", offsetMeters: -18 },
      { id: "red", name: "Vermelles", color: "#ef4444", textColor: "#fff", offsetMeters: -32 }
    ],
    osmVerified: true,
    holes: [
      { number: 1, par: 4, hcp: 8, officialMeters: 391, tee: { lat: 42.396651, lng: 1.878316 }, green: { lat: 42.399273, lng: 1.881483 }, greenRadius: 13, source: "OSM" },
      { number: 2, par: 5, hcp: 10, officialMeters: 481, tee: { lat: 42.399554, lng: 1.881607 }, green: { lat: 42.401241, lng: 1.876218 }, greenRadius: 13, source: "OSM" },
      { number: 3, par: 4, hcp: 2, officialMeters: 409, tee: { lat: 42.401176, lng: 1.87516 }, green: { lat: 42.399871, lng: 1.879819 }, greenRadius: 13, source: "OSM" },
      { number: 4, par: 4, hcp: 12, officialMeters: 324, tee: { lat: 42.399444, lng: 1.879288 }, green: { lat: 42.400128, lng: 1.87545 }, greenRadius: 13, source: "OSM" },
      { number: 5, par: 3, hcp: 14, officialMeters: 152, tee: { lat: 42.400471, lng: 1.875555 }, green: { lat: 42.400435, lng: 1.873703 }, greenRadius: 13, source: "OSM" },
      { number: 6, par: 5, hcp: 4, officialMeters: 526, tee: { lat: 42.400159, lng: 1.874169 }, green: { lat: 42.39953, lng: 1.880518 }, greenRadius: 13, source: "OSM" },
      { number: 7, par: 4, hcp: 18, officialMeters: 333, tee: { lat: 42.399222, lng: 1.880929 }, green: { lat: 42.398386, lng: 1.877038 }, greenRadius: 13, source: "OSM" },
      { number: 8, par: 3, hcp: 6, officialMeters: 200, tee: { lat: 42.398707, lng: 1.877449 }, green: { lat: 42.399335, lng: 1.875164 }, greenRadius: 13, source: "OSM" },
      { number: 9, par: 4, hcp: 16, officialMeters: 338, tee: { lat: 42.399076, lng: 1.874837 }, green: { lat: 42.397434, lng: 1.878306 }, greenRadius: 13, source: "OSM" },
      { number: 10, par: 5, hcp: 13, officialMeters: 470, tee: { lat: 42.397162, lng: 1.876053 }, green: { lat: 42.39746, lng: 1.87034 }, greenRadius: 13, source: "OSM" },
      { number: 11, par: 3, hcp: 5, officialMeters: 187, tee: { lat: 42.397076, lng: 1.869881 }, green: { lat: 42.3986, lng: 1.868921 }, greenRadius: 13, source: "OSM" },
      { number: 12, par: 4, hcp: 11, officialMeters: 321, tee: { lat: 42.399287, lng: 1.86877 }, green: { lat: 42.397284, lng: 1.86595 }, greenRadius: 13, source: "OSM" },
      { number: 13, par: 5, hcp: 7, officialMeters: 560, tee: { lat: 42.397725, lng: 1.865743 }, green: { lat: 42.400608, lng: 1.871342 }, greenRadius: 13, source: "OSM" },
      { number: 14, par: 4, hcp: 9, officialMeters: 321, tee: { lat: 42.400489, lng: 1.872722 }, green: { lat: 42.399141, lng: 1.869259 }, greenRadius: 13, source: "OSM" },
      { number: 15, par: 4, hcp: 15, officialMeters: 339, tee: { lat: 42.399251, lng: 1.870139 }, green: { lat: 42.399544, lng: 1.874252 }, greenRadius: 13, source: "OSM" },
      { number: 16, par: 4, hcp: 3, officialMeters: 365, tee: { lat: 42.399144, lng: 1.874052 }, green: { lat: 42.398582, lng: 1.869674 }, greenRadius: 13, source: "OSM" },
      { number: 17, par: 3, hcp: 17, officialMeters: 185, tee: { lat: 42.398094, lng: 1.869915 }, green: { lat: 42.398382, lng: 1.872132 }, greenRadius: 13, source: "OSM" },
      { number: 18, par: 4, hcp: 1, officialMeters: 385, tee: { lat: 42.398804, lng: 1.87182 }, green: { lat: 42.397642, lng: 1.876237 }, greenRadius: 13, source: "OSM" }
    ]
  },
{
    id: "golf-raimat",
    name: "Raimat Golf Club",
    municipality: "Raimat / Alpicat (Lleida)",
    province: "Lleida",
    type: "Golf",
    federation: "FCGolf",
    holesCount: 18,
    lat: 41.670993,
    lng: 0.512918,
    website: "https://www.raimatgolf.com",
    teesAvailable: [
      { id: "white", name: "Blanques", color: "#f8fafc", textColor: "#0f172a", offsetMeters: 15 },
      { id: "yellow", name: "Grogues", color: "#eab308", textColor: "#000", offsetMeters: 0 },
      { id: "blue", name: "Blaves", color: "#3b82f6", textColor: "#fff", offsetMeters: -18 },
      { id: "red", name: "Vermelles", color: "#ef4444", textColor: "#fff", offsetMeters: -32 }
    ],
    osmVerified: true,
    holes: [
      { number: 1, par: 5, hcp: 15, officialMeters: 444, tee: { lat: 41.670547, lng: 0.519008 }, green: { lat: 41.672228, lng: 0.523862 }, greenRadius: 13, source: "OSM" },
      { number: 2, par: 4, hcp: 3, officialMeters: 348, tee: { lat: 41.672203, lng: 0.522712 }, green: { lat: 41.67098, lng: 0.51886 }, greenRadius: 13, source: "OSM" },
      { number: 3, par: 4, hcp: 5, officialMeters: 371, tee: { lat: 41.669471, lng: 0.516049 }, green: { lat: 41.667823, lng: 0.519935 }, greenRadius: 13, source: "OSM" },
      { number: 4, par: 3, hcp: 9, officialMeters: 142, tee: { lat: 41.667731, lng: 0.51903 }, green: { lat: 41.668321, lng: 0.517508 }, greenRadius: 13, source: "OSM" },
      { number: 5, par: 4, hcp: 7, officialMeters: 282, tee: { lat: 41.668591, lng: 0.517258 }, green: { lat: 41.669457, lng: 0.514074 }, greenRadius: 13, source: "OSM" },
      { number: 6, par: 3, hcp: 11, officialMeters: 156, tee: { lat: 41.669567, lng: 0.513269 }, green: { lat: 41.670135, lng: 0.511557 }, greenRadius: 13, source: "OSM" },
      { number: 7, par: 4, hcp: 13, officialMeters: 362, tee: { lat: 41.670179, lng: 0.511001 }, green: { lat: 41.672155, lng: 0.507542 }, greenRadius: 13, source: "OSM" },
      { number: 8, par: 4, hcp: 17, officialMeters: 272, tee: { lat: 41.67245, lng: 0.507131 }, green: { lat: 41.674464, lng: 0.509 }, greenRadius: 13, source: "OSM" },
      { number: 9, par: 5, hcp: 1, officialMeters: 397, tee: { lat: 41.674116, lng: 0.509411 }, green: { lat: 41.670742, lng: 0.510966 }, greenRadius: 13, source: "OSM" },
      { number: 10, par: 4, hcp: 8, officialMeters: 336, tee: { lat: 41.670839, lng: 0.512157 }, green: { lat: 41.672904, lng: 0.509206 }, greenRadius: 13, source: "OSM" },
      { number: 11, par: 4, hcp: 18, officialMeters: 384, tee: { lat: 41.673307, lng: 0.51065 }, green: { lat: 41.67116, lng: 0.514267 }, greenRadius: 13, source: "OSM" },
      { number: 12, par: 4, hcp: 2, officialMeters: 331, tee: { lat: 41.672176, lng: 0.512775 }, green: { lat: 41.671548, lng: 0.516672 }, greenRadius: 13, source: "OSM" },
      { number: 13, par: 3, hcp: 16, officialMeters: 138, tee: { lat: 41.672095, lng: 0.5168 }, green: { lat: 41.671026, lng: 0.517638 }, greenRadius: 13, source: "OSM" },
      { number: 14, par: 4, hcp: 4, officialMeters: 348, tee: { lat: 41.671871, lng: 0.517706 }, green: { lat: 41.674576, lng: 0.519824 }, greenRadius: 13, source: "OSM" },
      { number: 15, par: 4, hcp: 6, officialMeters: 362, tee: { lat: 41.67454, lng: 0.519084 }, green: { lat: 41.672139, lng: 0.516131 }, greenRadius: 13, source: "OSM" },
      { number: 16, par: 5, hcp: 10, officialMeters: 442, tee: { lat: 41.672274, lng: 0.515015 }, green: { lat: 41.673983, lng: 0.510204 }, greenRadius: 13, source: "OSM" },
      { number: 17, par: 3, hcp: 14, officialMeters: 165, tee: { lat: 41.674349, lng: 0.509762 }, green: { lat: 41.672864, lng: 0.509752 }, greenRadius: 13, source: "OSM" },
      { number: 18, par: 5, hcp: 12, officialMeters: 476, tee: { lat: 41.673032, lng: 0.510234 }, green: { lat: 41.670202, lng: 0.514529 }, greenRadius: 13, source: "OSM" }
    ]
  }
];
