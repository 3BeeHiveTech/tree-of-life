export interface TaxonNode {
  id: number;
  name: string;
  common_name?: string | null;
  rank: string;
  parent_id: number | null;
  image_url?: string | null;
  conservation_status?: string | null;
  species_count: number;
  iconic_taxa?: string | null;
  has_children: boolean;
}

export interface ApiResponse {
  nodes: TaxonNode[];
  total: number;
}

export interface TreeNode extends TaxonNode {
  x: number;
  y: number;
  z: number;
  depth: number;
  color: [number, number, number];
  size: number;
  expanded: boolean;
}

export type Edge = [number, number, number, number, number, number];

export interface LayoutResult {
  nodes: TreeNode[];
  edges: Edge[];
  galaxyEdges: Edge[]; // sun → kingdom links (dashed)
}

// LOD tier based on screen-space size
export type LODTier = "points" | "spheres" | "detailed";
