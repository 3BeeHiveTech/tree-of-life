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

// Fibonacci sphere: evenly distribute N points on a sphere surface
function fibonacciSphere(index: number, total: number): [number, number, number] {
  if (total <= 1) return [1, 0, 0];
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  const y = 1 - (2 * index) / (total - 1);
  const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y));
  const theta = goldenAngle * index;
  return [Math.cos(theta) * radiusAtY, y, Math.sin(theta) * radiusAtY];
}

// Count all descendants recursively (to scale orbit radius)
function countDescendants(node: HierNode): number {
  let count = 1;
  for (const child of node.children) {
    count += countDescendants(child);
  }
  return count;
}

/**
 * Solar system layout:
 * - Children orbit their parent on a sphere in 3D
 * - Orbit radius scales with number of children (more children = bigger orbit)
 * - Minimum spacing guarantees no overlap
 * - Depth reduces base radius (deeper = tighter clusters)
 */
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

  node.children.sort((a, b) => a.data.name.localeCompare(b.data.name));

  const count = node.children.length;

  // Orbit radius: base per depth + scaled by child count
  // More children = wider orbit so they don't overlap
  const baseRadius: Record<number, number> = {
    0: 80,   // kingdoms far apart
    1: 50,   // phyla around kingdom
    2: 30,   // classes around phylum
    3: 18,   // orders around class
    4: 12,   // families around order
    5: 8,    // genera around family
    6: 5,    // species around genus
  };

  const base = baseRadius[depth] ?? 5;
  // Scale up if many children
  const orbitR = base + Math.sqrt(count) * (base * 0.15);

  for (let i = 0; i < count; i++) {
    const [fx, fy, fz] = fibonacciSphere(i, count);

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

  roots.sort((a, b) => a.data.name.localeCompare(b.data.name));

  // Distribute roots on a very large sphere
  const rootSpread = 120;
  for (let i = 0; i < roots.length; i++) {
    const [fx, fy, fz] = fibonacciSphere(i, roots.length);
    layoutSolarSystem(
      roots[i],
      fx * rootSpread,
      fy * rootSpread * 0.4, // flatten Y a bit
      fz * rootSpread,
      0,
    );
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

    // Edge from parent to this node
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
