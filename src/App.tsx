import { useMemo, useEffect, useCallback } from "react";
import { Scene } from "./components/Canvas/Scene";
import { SearchBar } from "./components/UI/SearchBar";
import { Breadcrumb } from "./components/UI/Breadcrumb";
import { NodeDetail } from "./components/UI/NodeDetail";
import { ColorModeSwitch } from "./components/UI/ColorModeSwitch";
import { Legend } from "./components/UI/Legend";
import { Stats } from "./components/UI/Stats";
import { computeLayout } from "./utils/layout";
import { useTreeStore } from "./stores/tree";
import { useInitialTree, useExpandSubtree } from "./hooks/useTreeData";

function App() {
  const colorMode = useTreeStore((s) => s.colorMode);
  const loadedNodes = useTreeStore((s) => s.loadedNodes);
  const setLayoutNodes = useTreeStore((s) => s.setLayoutNodes);

  // Load initial data
  useInitialTree();

  // Expand subtree callback
  const expandSubtree = useExpandSubtree();

  // Compute layout whenever loaded nodes or color mode changes
  const layout = useMemo(() => {
    const nodesArray = Array.from(loadedNodes.values());
    if (nodesArray.length === 0) return { nodes: [], edges: [] };
    return computeLayout(nodesArray, colorMode);
  }, [loadedNodes, colorMode]);

  useEffect(() => {
    setLayoutNodes(layout.nodes);
  }, [layout.nodes, setLayoutNodes]);

  const handleExpand = useCallback(
    (nodeId: number) => {
      expandSubtree(nodeId);
    },
    [expandSubtree]
  );

  return (
    <div className="app">
      <Scene layout={layout} onExpand={handleExpand} />

      <div className="overlay">
        <header className="top-bar">
          <div className="logo">
            <span className="logo-icon">✦</span>
            <h1>Tree of Life</h1>
            <span className="logo-subtitle">3Bee Biodiversity Explorer</span>
          </div>
          <SearchBar />
        </header>

        <div className="breadcrumb-bar">
          <Breadcrumb />
        </div>

        <div className="bottom-left">
          <Stats nodes={layout.nodes} />
        </div>

        <div className="bottom-right">
          <ColorModeSwitch />
          <Legend />
        </div>

        <NodeDetail />
      </div>
    </div>
  );
}

export default App;
