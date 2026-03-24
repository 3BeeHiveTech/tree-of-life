export const ICONIC_TAXA_COLORS: Record<string, [number, number, number]> = {
  aves: [0.3, 0.55, 1.0],        // sky blue
  mammalia: [1.0, 0.5, 0.15],    // warm orange
  insecta: [0.3, 0.9, 0.25],     // bright green
  arachnida: [0.8, 0.25, 0.8],   // purple
  plantae: [0.15, 0.8, 0.35],    // emerald
  fungi: [0.9, 0.8, 0.2],        // golden
  amphibia: [0.2, 0.85, 0.85],   // cyan
  reptilia: [0.5, 0.8, 0.15],    // lime
  actinopterygii: [0.2, 0.4, 1.0], // deep blue
  mollusca: [0.85, 0.35, 0.45],  // pink
  animalia: [0.6, 0.6, 0.75],    // silver-blue
};

export const IUCN_COLORS: Record<string, [number, number, number]> = {
  EX: [0.2, 0.2, 0.2],
  EW: [0.35, 0.15, 0.35],
  CR: [1.0, 0.1, 0.1],     // red
  EN: [1.0, 0.35, 0.08],   // orange-red
  VU: [0.9, 0.6, 0.0],     // amber
  NT: [0.6, 0.8, 0.15],    // yellow-green
  LC: [0.2, 0.8, 0.35],    // green
  DD: [0.4, 0.4, 0.4],
  NE: [0.5, 0.5, 0.55],
};

// Size per rank — more dramatic variation
export const RANK_SIZES: Record<string, number> = {
  kingdom: 2.5,
  phylum: 1.8,
  class: 1.4,
  order: 1.0,
  family: 0.75,
  genus: 0.5,
  species: 0.3,
};

// HDR intensity multiplier per rank (higher rank = brighter glow)
export const RANK_GLOW: Record<string, number> = {
  kingdom: 1.8,
  phylum: 1.5,
  class: 1.3,
  order: 1.1,
  family: 1.0,
  genus: 0.9,
  species: 0.75,
};

export function getNodeColor(
  iconicTaxa?: string | null,
  conservationStatus?: string | null,
  colorMode: "iconic" | "iucn" = "iconic"
): [number, number, number] {
  if (colorMode === "iucn" && conservationStatus) {
    return IUCN_COLORS[conservationStatus] ?? [0.7, 0.7, 0.8];
  }
  if (iconicTaxa && iconicTaxa in ICONIC_TAXA_COLORS) {
    return ICONIC_TAXA_COLORS[iconicTaxa];
  }
  return [0.8, 0.9, 1.4];
}

// Get the glow-boosted color for a node (HDR, for bloom to pick up)
export function getNodeHDRColor(
  baseColor: [number, number, number],
  rank: string
): [number, number, number] {
  const glow = RANK_GLOW[rank] ?? 1.0;
  return [baseColor[0] * glow, baseColor[1] * glow, baseColor[2] * glow];
}
