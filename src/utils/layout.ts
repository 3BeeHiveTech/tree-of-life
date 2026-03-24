import { hierarchy, tree as d3tree } from "d3-hierarchy";
import type { TaxonNode, TreeNode, LayoutResult } from "../types";
import { getNodeColor, RANK_SIZES } from "./colors";
import type { ColorMode } from "../stores/tree";

interface HierarchyDatum {
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
  children?: HierarchyDatum[];
}

function buildHierarchy(flatNodes: TaxonNode[]): HierarchyDatum | null {
  const map = new Map<number, HierarchyDatum>();
  const roots: HierarchyDatum[] = [];

  for (const node of flatNodes) {
    map.set(node.id, { ...node, children: [] });
  }

  for (const node of flatNodes) {
    const datum = map.get(node.id)!;
    if (node.parent_id === null) {
      roots.push(datum);
    } else {
      const parent = map.get(node.parent_id);
      if (parent) {
        parent.children!.push(datum);
      } else {
        // Parent not loaded yet — treat as root
        roots.push(datum);
      }
    }
  }

  if (roots.length === 0) return null;
  if (roots.length === 1) return roots[0];

  return {
    id: 0,
    name: "Life",
    rank: "kingdom",
    parent_id: null,
    species_count: roots.reduce((s, r) => s + r.species_count, 0),
    has_children: true,
    children: roots,
  };
}

export function computeLayout(
  flatNodes: TaxonNode[],
  colorMode: ColorMode = "iconic"
): LayoutResult {
  const rootDatum = buildHierarchy(flatNodes);
  if (!rootDatum) return { nodes: [], edges: [] };

  const root = hierarchy(rootDatum);

  const maxDepth = root.height;
  const treeLayout = d3tree<HierarchyDatum>()
    .size([2 * Math.PI, Math.max(maxDepth, 1)])
    .separation((a, b) => {
      return (a.parent === b.parent ? 1 : 2) / (a.depth || 1);
    });

  treeLayout(root);

  const nodes: TreeNode[] = [];
  const edges: LayoutResult["edges"] = [];

  const VERTICAL_SPREAD = 4;
  const RADIAL_SCALE = 10;

  root.each((d) => {
    const angle = (d as unknown as { x: number }).x;
    const radius = (d as unknown as { y: number }).y * RADIAL_SCALE;
    const depth = d.depth;

    const x = radius * Math.cos(angle);
    const z = radius * Math.sin(angle);
    const y = depth * VERTICAL_SPREAD;

    const data = d.data;
    const color = getNodeColor(data.iconic_taxa, data.conservation_status, colorMode);
    const size = RANK_SIZES[data.rank] ?? 0.3;

    const treeNode: TreeNode = {
      ...data,
      x,
      y,
      z,
      depth,
      color,
      size,
      expanded: false,
    };
    nodes.push(treeNode);

    if (d.parent) {
      const parentAngle = (d.parent as unknown as { x: number }).x;
      const parentRadius = (d.parent as unknown as { y: number }).y * RADIAL_SCALE;
      const parentDepth = d.parent.depth;

      const px = parentRadius * Math.cos(parentAngle);
      const pz = parentRadius * Math.sin(parentAngle);
      const py = parentDepth * VERTICAL_SPREAD;

      edges.push([px, py, pz, x, y, z]);
    }
  });

  return { nodes, edges };
}
