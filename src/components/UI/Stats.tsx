import { useMemo } from "react";
import type { TreeNode } from "../../types";

interface StatsProps {
  nodes: TreeNode[];
}

export function Stats({ nodes }: StatsProps) {
  const stats = useMemo(() => {
    const species = nodes.filter((n) => n.rank === "species").length;
    const genera = nodes.filter((n) => n.rank === "genus").length;
    const families = nodes.filter((n) => n.rank === "family").length;
    const orders = nodes.filter((n) => n.rank === "order").length;
    return { total: nodes.length, species, genera, families, orders };
  }, [nodes]);

  return (
    <div className="stats">
      <div className="stat-item">
        <span className="stat-number">{stats.total}</span>
        <span className="stat-label">Taxa</span>
      </div>
      <div className="stat-item">
        <span className="stat-number">{stats.species}</span>
        <span className="stat-label">Species</span>
      </div>
      <div className="stat-item">
        <span className="stat-number">{stats.genera}</span>
        <span className="stat-label">Genera</span>
      </div>
      <div className="stat-item">
        <span className="stat-number">{stats.families}</span>
        <span className="stat-label">Families</span>
      </div>
    </div>
  );
}
