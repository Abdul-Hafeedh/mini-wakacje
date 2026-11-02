/**
 * Polish Railway Brand and Carrier Registry from KOLEO
 */

export interface KoleoBrand {
  name: string;
  displayName: string;
  logoText: string;
  color: string;
}

export const KOLEO_BRANDS: Record<number, KoleoBrand> = {
  "1": {
    "name": "TLK",
    "displayName": "TLK",
    "logoText": "TLK",
    "color": "#F86505"
  },
  "2": {
    "name": "EIC",
    "displayName": "EIC",
    "logoText": "EIC",
    "color": "#6C727A"
  },
  "3": {
    "name": "REG",
    "displayName": "REG",
    "logoText": "PR",
    "color": "#E50000"
  },
  "4": {
    "name": "IR",
    "displayName": "IR",
    "logoText": "IR",
    "color": "#E50000"
  },
  "5": {
    "name": "RE",
    "displayName": "RE",
    "logoText": "RE",
    "color": "#ADB3B3"
  },
  "6": {
    "name": "ARRIVARP",
    "displayName": "ARRIVARP",
    "logoText": "AR",
    "color": "#018091"
  },
  "8": {
    "name": "WKD",
    "displayName": "WKD",
    "logoText": "WKD",
    "color": "#0545CB"
  },
  "9": {
    "name": "SKMT",
    "displayName": "SKMT",
    "logoText": "SKM-T",
    "color": "#003955"
  },
  "10": {
    "name": "KD",
    "displayName": "KD",
    "logoText": "KD",
    "color": "#2A2A28"
  },
  "11": {
    "name": "KS",
    "displayName": "KŚ",
    "logoText": "KŚ",
    "color": "#009EDC"
  },
  "12": {
    "name": "KW",
    "displayName": "KW",
    "logoText": "KW",
    "color": "#9D0A0E"
  },
  "13": {
    "name": "LKA",
    "displayName": "ŁKA",
    "logoText": "ŁKA",
    "color": "#ADB3B3"
  },
  "14": {
    "name": "KM",
    "displayName": "KM",
    "logoText": "KM",
    "color": "#00A34F"
  },
  "18": {
    "name": "MR",
    "displayName": "specjalny",
    "logoText": "specjalny",
    "color": "#E50000"
  },
  "20": {
    "name": "PRS",
    "displayName": "PRS",
    "logoText": "specjalny",
    "color": "#E50000"
  },
  "27": {
    "name": "SKM",
    "displayName": "SKM",
    "logoText": "SKM-W",
    "color": "#FF1100"
  },
  "28": {
    "name": "IC",
    "displayName": "IC",
    "logoText": "IC",
    "color": "#EF7F0B"
  },
  "29": {
    "name": "EIP",
    "displayName": "EIP",
    "logoText": "EIP",
    "color": "#102C76"
  },
  "33": {
    "name": "KML",
    "displayName": "KMŁ",
    "logoText": "KMŁ",
    "color": "#FBBF00"
  },
  "38": {
    "name": "SKPL",
    "displayName": "SKPL",
    "logoText": "SKPL",
    "color": "#0C5DC5"
  },
  "40": {
    "name": "MultiPlaza",
    "displayName": "MultiPlaza",
    "logoText": "AR",
    "color": "#018091"
  },
  "43": {
    "name": "LS",
    "displayName": "ŁKA Sprinter",
    "logoText": "ŁS",
    "color": "#ADB3B3"
  },
  "45": {
    "name": "KDP",
    "displayName": "KDP",
    "logoText": "KD",
    "color": "#2A2A28"
  },
  "46": {
    "name": "LP",
    "displayName": "ŁKA Przyspieszony",
    "logoText": "ŁP",
    "color": "#ADB3B3"
  },
  "47": {
    "name": "LEO",
    "displayName": "Leo Express",
    "logoText": "LEO",
    "color": "#FD6608"
  },
  "48": {
    "name": "sR",
    "displayName": "sR",
    "logoText": "sR",
    "color": "#E50000"
  },
  "49": {
    "name": "PKS",
    "displayName": "PKS",
    "logoText": "PKS",
    "color": "#adb3b3"
  },
  "51": {
    "name": "CD",
    "displayName": "Ceske Drahy",
    "logoText": "ČD",
    "color": "#FD6608"
  },
  "52": {
    "name": "LEO_PLUS",
    "displayName": "Leo Express",
    "logoText": "LEO",
    "color": "#FD6608"
  },
  "53": {
    "name": "UZ",
    "displayName": "UZ",
    "logoText": "UZ",
    "color": "#adb3b3"
  },
  "54": {
    "name": "RKW",
    "displayName": "FPKW",
    "logoText": "FPKW",
    "color": "#ADB3B3"
  },
  "56": {
    "name": "SLONECZNY",
    "displayName": "KM",
    "logoText": "KM",
    "color": "#00A34F"
  },
  "57": {
    "name": "KOLEO BUS",
    "displayName": "KOLEO BUS",
    "logoText": "KOLEO",
    "color": "#0075E2"
  },
  "58": {
    "name": "KDR",
    "displayName": "KD Rowerowy",
    "logoText": "KD R",
    "color": "#2A2A28"
  },
  "59": {
    "name": "Kulturzug",
    "displayName": "KD",
    "logoText": "KD",
    "color": "#2A2A28"
  },
  "61": {
    "name": "LA",
    "displayName": "ŁA",
    "logoText": "ŁA",
    "color": "#ADB3B3"
  },
  "62": {
    "name": "KM BUS",
    "displayName": "KM BUS",
    "logoText": "KM BUS",
    "color": "#00A34F"
  },
  "63": {
    "name": "MLD",
    "displayName": "MLD",
    "logoText": "MLD",
    "color": "#ec008e"
  },
  "64": {
    "name": "FlixBus",
    "displayName": "FlixBus",
    "logoText": "FLIX",
    "color": "#97d700"
  },
  "65": {
    "name": "RegioJet",
    "displayName": "RegioJet",
    "logoText": "RJ",
    "color": "#FABB00"
  },
  "66": {
    "name": "KDA",
    "displayName": "KDA",
    "logoText": "KDA",
    "color": "#2A2A28"
  }
};

export function getBrandInfo(brandId?: number): KoleoBrand {
  if (brandId && KOLEO_BRANDS[brandId]) {
    return KOLEO_BRANDS[brandId];
  }
  return {
    name: "REG",
    displayName: "Kolej",
    logoText: "PKP",
    color: "#0284c7"
  };
}
