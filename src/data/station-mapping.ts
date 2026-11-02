/**
 * Canonical KOLEO Station Mapping for all Polish Explorer Cities
 * Verified against live KOLEO station registry
 */

export interface KoleoStationInfo {
  stationId: number;
  name: string;
  slug: string;
}

export const KOLEO_STATIONS: Record<string, KoleoStationInfo> = {
  "warsaw": {
    "stationId": 33605,
    "name": "Warszawa Centralna",
    "slug": "warszawa-centralna"
  },
  "krakow": {
    "stationId": 80416,
    "name": "Kraków Główny",
    "slug": "krakow-glowny"
  },
  "wroclaw": {
    "stationId": 60103,
    "name": "Wrocław Główny",
    "slug": "wroclaw-glowny"
  },
  "lodz": {
    "stationId": 46458,
    "name": "Łódź Fabryczna",
    "slug": "lodz-fabryczna"
  },
  "poznan": {
    "stationId": 30601,
    "name": "Poznań Główny",
    "slug": "poznan-glowny"
  },
  "gdansk": {
    "stationId": 7500,
    "name": "Gdańsk Główny",
    "slug": "gdansk-glowny"
  },
  "szczecin": {
    "stationId": 273,
    "name": "Szczecin Główny",
    "slug": "szczecin-glowny"
  },
  "lublin": {
    "stationId": 50500,
    "name": "Lublin Główny",
    "slug": "lublin-glowny"
  },
  "bydgoszcz": {
    "stationId": 18408,
    "name": "Bydgoszcz Główna",
    "slug": "bydgoszcz-glowna"
  },
  "bialystok": {
    "stationId": 24000,
    "name": "Białystok",
    "slug": "bialystok"
  },
  "katowice": {
    "stationId": 73312,
    "name": "Katowice",
    "slug": "katowice"
  },
  "gdynia": {
    "stationId": 5900,
    "name": "Gdynia Główna",
    "slug": "gdynia-glowna"
  },
  "czestochowa": {
    "stationId": 62653,
    "name": "Częstochowa",
    "slug": "czestochowa"
  },
  "rzeszow": {
    "stationId": 82669,
    "name": "Rzeszów Główny",
    "slug": "rzeszow-glowny"
  },
  "torun": {
    "stationId": 19703,
    "name": "Toruń Główny",
    "slug": "torun-glowny"
  },
  "radom": {
    "stationId": 48355,
    "name": "Radom Główny",
    "slug": "radom-glowny"
  },
  "sosnowiec": {
    "stationId": 74658,
    "name": "Sosnowiec Główny",
    "slug": "sosnowiec-glowny"
  },
  "kielce": {
    "stationId": 63552,
    "name": "Kielce Główne",
    "slug": "kielce-glowne"
  },
  "gliwice": {
    "stationId": 69708,
    "name": "Gliwice",
    "slug": "gliwice"
  },
  "olsztyn": {
    "stationId": 9209,
    "name": "Olsztyn Główny",
    "slug": "olsztyn-glowny"
  },
  "bielsko-biala": {
    "stationId": 76109,
    "name": "Bielsko-Biała Główna",
    "slug": "bielsko-biala-glowna"
  },
  "zabrze": {
    "stationId": 69823,
    "name": "Zabrze",
    "slug": "zabrze"
  },
  "bytom": {
    "stationId": 72306,
    "name": "Bytom",
    "slug": "bytom"
  },
  "zielona-gora": {
    "stationId": 27805,
    "name": "Zielona Góra Główna",
    "slug": "zielona-gora-glowna"
  },
  "rybnik": {
    "stationId": 68205,
    "name": "Rybnik",
    "slug": "rybnik"
  },
  "ruda-slaska": {
    "stationId": 69849,
    "name": "Ruda Śląska",
    "slug": "ruda-slaska"
  },
  "opole": {
    "stationId": 60608,
    "name": "Opole Główne",
    "slug": "opole-glowne"
  },
  "tychy": {
    "stationId": 73700,
    "name": "Tychy",
    "slug": "tychy"
  },
  "gorzow-wielkopolski": {
    "stationId": 13904,
    "name": "Gorzów Wielkopolski",
    "slug": "gorzow-wielkopolski"
  },
  "dabrowa-gornicza": {
    "stationId": 74583,
    "name": "Dąbrowa Górnicza",
    "slug": "dabrowa-gornicza"
  },
  "elblag": {
    "stationId": 8151,
    "name": "Elbląg",
    "slug": "elblag"
  },
  "plock": {
    "stationId": 32607,
    "name": "Płock",
    "slug": "plock"
  },
  "koszalin": {
    "stationId": 4408,
    "name": "Koszalin",
    "slug": "koszalin"
  },
  "tarnow": {
    "stationId": 80630,
    "name": "Tarnów",
    "slug": "tarnow"
  },
  "chorzow": {
    "stationId": 72272,
    "name": "Chorzów Miasto",
    "slug": "chorzow-miasto"
  },
  "wloclawek": {
    "stationId": 21600,
    "name": "Włocławek",
    "slug": "wloclawek"
  },
  "walbrzych": {
    "stationId": 54551,
    "name": "Wałbrzych Miasto",
    "slug": "walbrzych-miasto"
  },
  "kalisz": {
    "stationId": 45245,
    "name": "Kalisz",
    "slug": "kalisz"
  },
  "legnica": {
    "stationId": 53009,
    "name": "Legnica",
    "slug": "legnica"
  },
  "grudziadz": {
    "stationId": 20503,
    "name": "Grudziądz",
    "slug": "grudziadz"
  },
  "jaworzno": {
    "stationId": 73908,
    "name": "Jaworzno Szczakowa",
    "slug": "jaworzno-szczakowa"
  },
  "jawor": {
    "stationId": 53553,
    "name": "Jawor",
    "slug": "jawor"
  },
  "slupsk": {
    "stationId": 4705,
    "name": "Słupsk",
    "slug": "slupsk"
  },
  "jastrzebie-zdroj": {
    "stationId": 68205,
    "name": "Rybnik",
    "slug": "rybnik"
  },
  "nowy-sacz": {
    "stationId": 81901,
    "name": "Nowy Sącz",
    "slug": "nowy-sacz"
  },
  "malbork": {
    "stationId": 7872,
    "name": "Malbork",
    "slug": "malbork"
  },
  "wieliczka": {
    "stationId": 241960,
    "name": "Wieliczka Rynek-Kopalnia",
    "slug": "wieliczka-rynek-kopalnia"
  },
  "oswiecim": {
    "stationId": 77107,
    "name": "Oświęcim",
    "slug": "oswiecim"
  },
  "gryfow-slaski": {
    "stationId": 52357,
    "name": "Gryfów Śląski",
    "slug": "gryfow-slaski"
  },
  "pszczyna": {
    "stationId": 75903,
    "name": "Pszczyna",
    "slug": "pszczyna"
  },
  "lancut": {
    "stationId": 83022,
    "name": "Łańcut",
    "slug": "lancut"
  },
  "swidnica": {
    "stationId": 54817,
    "name": "Świdnica Miasto",
    "slug": "swidnica-miasto"
  },
  "tarnowskie-gory": {
    "stationId": 71001,
    "name": "Tarnowskie Góry",
    "slug": "tarnowskie-gory"
  },
  "kalwaria-zebrzydowska": {
    "stationId": 78345,
    "name": "Kalwaria Zebrzydowska Lanckorona",
    "slug": "kalwaria-zebrzydowska-lanckorona"
  },
  "gniezno": {
    "stationId": 30809,
    "name": "Gniezno",
    "slug": "gniezno"
  },
  "znin": {
    "stationId": 30809,
    "name": "Gniezno",
    "slug": "gniezno"
  },
  "zakopane": {
    "stationId": 79020,
    "name": "Zakopane",
    "slug": "zakopane"
  },
  "hajnowka": {
    "stationId": 25403,
    "name": "Hajnówka",
    "slug": "hajnowka"
  },
  "gizycko": {
    "stationId": 12609,
    "name": "Giżycko",
    "slug": "gizycko"
  },
  "mikolajki": {
    "stationId": 12609,
    "name": "Giżycko",
    "slug": "gizycko"
  },
  "leba": {
    "stationId": 5256,
    "name": "Lębork",
    "slug": "lebork"
  },
  "ustrzyki-dolne": {
    "stationId": 83758,
    "name": "Zagórz",
    "slug": "zagorz"
  },
  "szklarska-poreba": {
    "stationId": 56184,
    "name": "Szklarska Poręba Górna",
    "slug": "szklarska-poreba-gorna"
  },
  "jelenia-gora": {
    "stationId": 55806,
    "name": "Jelenia Góra",
    "slug": "jelenia-gora"
  },
  "klodzko": {
    "stationId": 57307,
    "name": "Kłodzko Główne",
    "slug": "klodzko-glowne"
  },
  "nowy-targ": {
    "stationId": 78907,
    "name": "Nowy Targ",
    "slug": "nowy-targ"
  },
  "krynica-zdroj": {
    "stationId": 82487,
    "name": "Krynica-Zdrój",
    "slug": "krynica-zdroj"
  },
  "wisla": {
    "stationId": 76992,
    "name": "Wisła Uzdrowisko",
    "slug": "wisla-uzdrowisko"
  },
  "hel": {
    "stationId": 6791,
    "name": "Hel",
    "slug": "hel"
  },
  "kolobrzeg": {
    "stationId": 4101,
    "name": "Kołobrzeg",
    "slug": "kolobrzeg"
  },
  "swinoujscie": {
    "stationId": 1008,
    "name": "Świnoujście",
    "slug": "swinoujscie"
  },
  "miedzyzdroje": {
    "stationId": 1024,
    "name": "Międzyzdroje",
    "slug": "miedzyzdroje"
  },
  "ustka": {
    "stationId": 4952,
    "name": "Ustka",
    "slug": "ustka"
  }
};
