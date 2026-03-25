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

// Distribute N points on a sphere surface (fibonacci)
function fibSphere(i: number, n: number): [number, number, number] {
  if (n <= 1) return [0, 0, 1];
  const golden = Math.PI * (3 - Math.sqrt(5));
  const y = 1 - (2 * i) / (n - 1);
  const r = Math.sqrt(Math.max(0, 1 - y * y));
  const theta = golden * i;
  return [Math.cos(theta) * r, y, Math.sin(theta) * r];
}

// Place children on a tight sphere around parent
function placeChildren(
  parent: HierNode,
  orbitRadius: number,
  depth: number,
) {
  if (parent.children.length === 0) return;

  parent.children.sort((a, b) => a.data.name.localeCompare(b.data.name));
  const n = parent.children.length;

  for (let i = 0; i < n; i++) {
    const [sx, sy, sz] = fibSphere(i, n);
    const child = parent.children[i];

    child.x = parent.x + sx * orbitRadius;
    child.y = parent.y + sy * orbitRadius;
    child.z = parent.z + sz * orbitRadius;
    child.depth = depth;

    // Children of children orbit tighter
    const childOrbit = orbitRadius * 0.45;
    placeChildren(child, childOrbit, depth + 1);
  }
}

export function computeLayout(
  flatNodes: TaxonNode[],
  colorMode: ColorMode = "iconic"
): LayoutResult {
  const roots = buildHierarchy(flatNodes);
  if (roots.length === 0) return { nodes: [], edges: [] };

  roots.sort((a, b) => a.data.name.localeCompare(b.data.name));

  // === STEP 1: Central sun "Life" at origin ===
  // If single root with children, it's the sun
  // If multiple roots, they ARE the galaxies

  let galaxies: HierNode[];
  let sunNode: HierNode | null = null;

  if (roots.length === 1 && roots[0].children.length > 0) {
    // Single root (e.g. "Life") → its children are galaxies
    sunNode = roots[0];
    sunNode.x = 0;
    sunNode.y = 0;
    sunNode.z = 0;
    sunNode.depth = 0;
    galaxies = sunNode.children;
  } else {
    // Multiple roots → they are galaxies directly
    galaxies = roots;
  }

  // === STEP 2: Place galaxies on a flat circle, far apart ===
  const galaxyDistance = 100; // distance from center to each galaxy
  const n = galaxies.length;

  for (let i = 0; i < n; i++) {
    const angle = (2 * Math.PI * i) / n;
    const galaxy = galaxies[i];

    // Galaxy sun position — flat circle in XZ plane
    galaxy.x = Math.cos(angle) * galaxyDistance;
    galaxy.y = 0;
    galaxy.z = Math.sin(angle) * galaxyDistance;
    galaxy.depth = sunNode ? 1 : 0;

    // === STEP 3: Stars orbit their galaxy sun, close & 3D ===
    const orbitRadius = 25; // stars close to their sun
    placeChildren(galaxy, orbitRadius, galaxy.depth + 1);
  }

  // === STEP 4: Collect all nodes and edges ===
  const nodes: TreeNode[] = [];
  const edges: LayoutResult["edges"] = [];

  // Add sun node if exists
  if (sunNode) {
    const color = getNodeColor(sunNode.data.iconic_taxa, sunNode.data.conservation_status, colorMode);
    nodes.push({
      ...sunNode.data,
      x: 0, y: 0, z: 0,
      depth: 0,
      color,
      size: (RANK_SIZES[sunNode.data.rank] ?? 1) * 1.5,
      expanded: false,
    });
  }

  function collect(node: HierNode, parentPos: [number, number, number]) {
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

    // Edge from parent → this node
    edges.push([parentPos[0], parentPos[1], parentPos[2], node.x, node.y, node.z]);

    const pos: [number, number, number] = [node.x, node.y, node.z];
    for (const child of node.children) {
      collect(child, pos);
    }
  }

  // Connect sun → galaxies → stars
  const sunPos: [number, number, number] = sunNode ? [0, 0, 0] : [0, 0, 0];
  for (const galaxy of galaxies) {
    collect(galaxy, sunNode ? sunPos : [galaxy.x, galaxy.y, galaxy.z]);
    // If no sun node, don't draw edge from origin
    if (!sunNode) {
      // Remove the last edge we just added (self-edge)
      const lastEdge = edges[edges.length - 1];
      if (lastEdge && lastEdge[0] === lastEdge[3] && lastEdge[1] === lastEdge[4] && lastEdge[2] === lastEdge[5]) {
        edges.pop();
      }
    }
  }

  return { nodes, edges };
}
