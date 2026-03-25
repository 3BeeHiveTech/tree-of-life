import type { TaxonNode, TreeNode, LayoutResult } from "../types";
import { getNodeColor, RANK_SIZES } from "./colors";
import type { ColorMode } from "../stores/tree";

interface HierNode {
  data: TaxonNode;
  children: HierNode[];
  depth: number;
  angle: number;
  radius: number;
}

function buildHierarchy(flatNodes: TaxonNode[]): HierNode[] {
  const map = new Map<number, HierNode>();
  const roots: HierNode[] = [];

  for (const node of flatNodes) {
    map.set(node.id, { data: node, children: [], depth: 0, angle: 0, radius: 0 });
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
 * Galaxy cluster layout:
 * - Each root (kingdom) gets a sector of the circle
 * - Children spread outward in their parent's sector
 * - Depth increases radius exponentially (not linearly)
 * - Angular spread decreases with depth (branches narrow)
 * - Y-axis adds vertical separation per depth
 */
function layoutNode(
  node: HierNode,
  angleStart: number,
  angleEnd: number,
  depth: number,
): void {
  node.depth = depth;
  node.angle = (angleStart + angleEnd) / 2;

  // Exponential radius growth — inner levels are spaced out, outer ones spread wide
  node.radius = depth === 0 ? 0 : Math.pow(depth, 1.3) * 12;

  if (node.children.length === 0) return;

  const angleRange = angleEnd - angleStart;
  // Minimum angular gap between children
  const gap = Math.min(0.03, angleRange * 0.05);
  const usableRange = angleRange - gap * (node.children.length - 1);
  const childAngleSize = usableRange / Math.max(node.children.length, 1);

  // Sort children by name for consistent layout
  node.children.sort((a, b) => a.data.name.localeCompare(b.data.name));

  let currentAngle = angleStart;
  for (const child of node.children) {
    const childEnd = currentAngle + childAngleSize;
    layoutNode(child, currentAngle, childEnd, depth + 1);
    currentAngle = childEnd + gap;
  }
}

function collectNodes(
  node: HierNode,
  parentPos: [number, number, number] | null,
  colorMode: ColorMode,
  nodes: TreeNode[],
  edges: LayoutResult["edges"],
): void {
  const VERTICAL_SPREAD = 6;

  const x = node.radius * Math.cos(node.angle);
  const z = node.radius * Math.sin(node.angle);
  const y = node.depth * VERTICAL_SPREAD;

  const color = getNodeColor(node.data.iconic_taxa, node.data.conservation_status, colorMode);
  const size = RANK_SIZES[node.data.rank] ?? 0.4;

  const treeNode: TreeNode = {
    ...node.data,
    x,
    y,
    z,
    depth: node.depth,
    color,
    size,
    expanded: false,
  };
  nodes.push(treeNode);

  if (parentPos) {
    edges.push([parentPos[0], parentPos[1], parentPos[2], x, y, z]);
  }

  const pos: [number, number, number] = [x, y, z];
  for (const child of node.children) {
    collectNodes(child, pos, colorMode, nodes, edges);
  }
}

export function computeLayout(
  flatNodes: TaxonNode[],
  colorMode: ColorMode = "iconic"
): LayoutResult {
  const roots = buildHierarchy(flatNodes);
  if (roots.length === 0) return { nodes: [], edges: [] };

  // If single root, use it directly; otherwise create virtual root
  let topNodes: HierNode[];
  if (roots.length === 1 && roots[0].children.length > 0) {
    topNodes = [roots[0]];
  } else {
    topNodes = roots;
  }

  // Distribute roots evenly around the circle
  const sectorSize = (2 * Math.PI) / Math.max(topNodes.length, 1);
  const gap = sectorSize * 0.08; // gap between sectors

  for (let i = 0; i < topNodes.length; i++) {
    const start = i * sectorSize + gap / 2;
    const end = (i + 1) * sectorSize - gap / 2;
    layoutNode(topNodes[i], start, end, 0);
  }

  // Collect all nodes and edges
  const nodes: TreeNode[] = [];
  const edges: LayoutResult["edges"] = [];

  for (const root of topNodes) {
    collectNodes(root, null, colorMode, nodes, edges);
  }

  return { nodes, edges };
}
