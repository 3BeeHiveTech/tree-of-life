import { useCallback, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { ApiResponse, TaxonNode } from "../types";
import { useTreeStore } from "../stores/tree";

// TODO: replace with real API URL after deploy
const API_BASE = import.meta.env.VITE_API_BASE ?? "";

async function fetchTree(maxDepth: number, parentId?: number): Promise<TaxonNode[]> {
  // If no API configured, use mock data
  if (!API_BASE) {
    const { mockTaxonomy } = await import("../data/mockTaxonomy");
    return mockTaxonomy;
  }

  const params = new URLSearchParams({ max_depth: String(maxDepth) });
  if (parentId !== undefined) {
    params.set("parent_id", String(parentId));
  }
  const res = await fetch(`${API_BASE}/v1/taxonomy/tree?${params}`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const data: ApiResponse = await res.json();
  // Filter out non-taxonomy entries (negative IDs = AI classes, NODATA, etc.)
  return data.nodes.filter((n) => n.id > 0);
}

export function useInitialTree() {
  const addNodes = useTreeStore((s) => s.addNodes);
  const setLoading = useTreeStore((s) => s.setLoading);

  // Load initial tree: top 4 levels (kingdom → class)
  const { data, isLoading } = useQuery({
    queryKey: ["taxonomy", "initial"],
    queryFn: () => fetchTree(API_BASE ? 3 : 10), // API: top 3 levels (kingdom→phylum→class), mock: all
    staleTime: Infinity,
    gcTime: Infinity,
  });

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading, setLoading]);

  useEffect(() => {
    if (data) {
      addNodes(data);
    }
  }, [data, addNodes]);
}

export function useExpandSubtree() {
  const addNodes = useTreeStore((s) => s.addNodes);
  const expandNode = useTreeStore((s) => s.expandNode);
  const queryClient = useQueryClient();

  return useCallback(
    async (parentId: number) => {
      // Check if already loaded
      const cached = queryClient.getQueryData<TaxonNode[]>(["taxonomy", "subtree", parentId]);
      if (cached) {
        expandNode(parentId);
        return;
      }

      try {
        const nodes = await queryClient.fetchQuery({
          queryKey: ["taxonomy", "subtree", parentId],
          queryFn: () => fetchTree(1, parentId), // load only next level
          staleTime: Infinity,
          gcTime: Infinity,
        });
        addNodes(nodes);
        expandNode(parentId);
      } catch (err) {
        console.error("Failed to expand subtree:", err);
      }
    },
    [addNodes, expandNode, queryClient]
  );
}
