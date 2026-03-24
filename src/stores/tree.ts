import { create } from "zustand";
import type { TaxonNode, TreeNode } from "../types";

export type ColorMode = "iconic" | "iucn";

interface TreeState {
  // All loaded taxon nodes (flat, from API)
  loadedNodes: Map<number, TaxonNode>;
  // Computed layout nodes
  layoutNodes: TreeNode[];
  // Expanded node IDs (user clicked to expand children)
  expandedIds: Set<number>;
  // UI state
  selectedNode: TreeNode | null;
  hoveredNode: TreeNode | null;
  cameraTarget: [number, number, number] | null;
  colorMode: ColorMode;
  searchQuery: string;
  searchResults: TreeNode[];
  isLoading: boolean;
  breadcrumb: TreeNode[];
  // Camera state for semantic zoom
  cameraDistance: number;
  // Dirty flag for render loop
  needsUpdate: boolean;

  addNodes: (nodes: TaxonNode[]) => void;
  setLayoutNodes: (nodes: TreeNode[]) => void;
  expandNode: (nodeId: number) => void;
  collapseNode: (nodeId: number) => void;
  selectNode: (node: TreeNode | null) => void;
  setHoveredNode: (node: TreeNode | null) => void;
  flyTo: (position: [number, number, number]) => void;
  setColorMode: (mode: ColorMode) => void;
  setSearchQuery: (query: string) => void;
  setLoading: (loading: boolean) => void;
  setCameraDistance: (distance: number) => void;
  markDirty: () => void;
  markClean: () => void;
}

export const useTreeStore = create<TreeState>((set, get) => ({
  loadedNodes: new Map(),
  layoutNodes: [],
  expandedIds: new Set(),
  selectedNode: null,
  hoveredNode: null,
  cameraTarget: null,
  colorMode: "iconic",
  searchQuery: "",
  searchResults: [],
  isLoading: true,
  breadcrumb: [],
  cameraDistance: 80,
  needsUpdate: true,

  addNodes: (nodes) => {
    const { loadedNodes } = get();
    const newMap = new Map(loadedNodes);
    for (const n of nodes) {
      newMap.set(n.id, n);
    }
    set({ loadedNodes: newMap, needsUpdate: true });
  },

  setLayoutNodes: (nodes) => set({ layoutNodes: nodes, isLoading: false }),

  expandNode: (nodeId) => {
    const { expandedIds } = get();
    const newSet = new Set(expandedIds);
    newSet.add(nodeId);
    set({ expandedIds: newSet, needsUpdate: true });
  },

  collapseNode: (nodeId) => {
    const { expandedIds } = get();
    const newSet = new Set(expandedIds);
    newSet.delete(nodeId);
    set({ expandedIds: newSet, needsUpdate: true });
  },

  selectNode: (node) => {
    if (!node) {
      set({ selectedNode: null, breadcrumb: [] });
      return;
    }
    const { layoutNodes } = get();
    const breadcrumb: TreeNode[] = [];
    let current: TreeNode | undefined = node;
    while (current) {
      breadcrumb.unshift(current);
      current = layoutNodes.find((n) => n.id === current!.parent_id);
    }
    set({
      selectedNode: node,
      cameraTarget: [node.x, node.y, node.z],
      breadcrumb,
      needsUpdate: true,
    });
  },

  setHoveredNode: (node) => set({ hoveredNode: node, needsUpdate: true }),

  flyTo: (position) => set({ cameraTarget: position }),

  setColorMode: (mode) => set({ colorMode: mode, needsUpdate: true }),

  setSearchQuery: (query) => {
    const { layoutNodes } = get();
    const q = query.toLowerCase();
    const results =
      q.length >= 2
        ? layoutNodes
            .filter(
              (n) =>
                n.name.toLowerCase().includes(q) ||
                n.common_name?.toLowerCase().includes(q)
            )
            .slice(0, 20)
        : [];
    set({ searchQuery: query, searchResults: results });
  },

  setLoading: (loading) => set({ isLoading: loading }),

  setCameraDistance: (distance) => {
    const prev = get().cameraDistance;
    // Only update if distance changed significantly (avoid jitter)
    if (Math.abs(prev - distance) > 1) {
      set({ cameraDistance: distance, needsUpdate: true });
    }
  },

  markDirty: () => set({ needsUpdate: true }),
  markClean: () => set({ needsUpdate: false }),
}));
