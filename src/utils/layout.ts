import type { TaxonNode, TreeNode, LayoutResult } from "../types";
import { getNodeColor, RANK_SIZES } from "./colors";
import type { ColorMode } from "../stores/tree";

interface HierNode {
  data: TaxonNode;
  children: HierNode[];
  x: number;
  y: number;
  z: number;
  depth: number;
}

function buildHierarchy(flatNodes: TaxonNode[]): HierNode[] {
  const map = new Map<number, HierNode>();
  const roots: HierNode[] = [];

  for (const node of flatNodes) {
    map.set(node.id, { data: node, children: [], x: 0, y: 0, z: 0, depth: 0 });
  }

  for (const node of flatNodes) {
    const hier = map.get(node.id)!;
    if (node.parent_id === null) {
      roots.push(hier);
    } else {
      const parent = map.get(node.parent_id);
      if (parent) {
        parent.children.push(hier);
      } else {
        roots.push(hier);
      }
    }
  }

  return roots;
}

/**
 * Solar system layout:
 * - Children are distributed on a SPHERE around their parent
 * - Uses fibonacci sphere for even distribution
 * - Orbit radius shrinks with depth (deeper = tighter clusters)
 * - Each cluster is clearly separated in 3D space
 */

// Fibonacci sphere: evenly distribute N points on a sphere surface
function fibonacciSphere(index: number, total: number): [number, number, number] {
  const goldenAngle = Math.PI * (3 - Math.sqrt(5)); // ~2.399
  const y = 1 - (2 * index) / Math.max(total - 1, 1); // -1 to 1
  const radiusAtY = Math.sqrt(1 - y * y);
  const theta = goldenAngle * index;
  const x = Math.cos(theta) * radiusAtY;
  const z = Math.sin(theta) * radiusAtY;
  return [x, y, z];
}

// Orbit radius per depth — how far children are from parent
const ORBIT_RADIUS: Record<number, number> = {
  0: 35,  // kingdoms spread very far apart
  1: 20,  // phyla around kingdom
  2: 12,  // classes around phylum
  3: 8,   // orders around class
  4: 5,   // families around order
  5: 3.5, // genera around family
  6: 2,   // species around genus
};

function layoutSolarSystem(
  node: HierNode,
  cx: number,
  cy: number,
  cz: number,
  depth: number,
): void {
  node.x = cx;
  node.y = cy;
  node.z = cz;
  node.depth = depth;

  if (node.children.length === 0) return;

  // Sort for consistent layout
  node.children.sort((a, b) => a.data.name.localeCompare(b.data.name));

  const orbitR = ORBIT_RADIUS[depth] ?? Math.max(2, 10 - depth * 1.5);
  const count = node.children.length;

  for (let i = 0; i < count; i++) {
    const [fx, fy, fz] = fibonacciSphere(i, count);

    // Place child on sphere around parent
    const childX = cx + fx * orbitR;
    const childY = cy + fy * orbitR;
    const childZ = cz + fz * orbitR;

    layoutSolarSystem(node.children[i], childX, childY, childZ, depth + 1);
  }
}

export function computeLayout(
  flatNodes: TaxonNode[],
  colorMode: ColorMode = "iconic"
): LayoutResult {
  const roots = buildHierarchy(flatNodes);
  if (roots.length === 0) return { nodes: [], edges: [] };

  // Sort roots
  roots.sort((a, b) => a.data.name.localeCompare(b.data.name));

  // Distribute root nodes on a large sphere (or circle if few)
  const rootSpread = 50;
  for (let i = 0; i < roots.length; i++) {
    const [fx, fy, fz] = fibonacciSphere(i, roots.length);
    layoutSolarSystem(roots[i], fx * rootSpread, fy * rootSpread * 0.3, fz * rootSpread, 0);
  }

  // Collect all nodes and edges
  const nodes: TreeNode[] = [];
  const edges: LayoutResult["edges"] = [];

  function collect(node: HierNode, parentPos: [number, number, number] | null) {
    const color = getNodeColor(node.data.iconic_taxa, node.data.conservation_status, colorMode);
    const size = RANK_SIZES[node.data.rank] ?? 0.3;

    nodes.push({
      ...node.data,
      x: node.x,
      y: node.y,
      z: node.z,
      depth: node.depth,
      color,
      size,
      expanded: false,
    });

    if (parentPos) {
      edges.push([parentPos[0], parentPos[1], parentPos[2], node.x, node.y, node.z]);
    }

    const pos: [number, number, number] = [node.x, node.y, node.z];
    for (const child of node.children) {
      collect(child, pos);
    }
  }

  for (const root of roots) {
    collect(root, null);
  }

  return { nodes, edges };
}
