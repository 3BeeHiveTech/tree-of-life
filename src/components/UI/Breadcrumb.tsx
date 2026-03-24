import { useTreeStore } from "../../stores/tree";

export function Breadcrumb() {
  const { breadcrumb, selectNode } = useTreeStore();

  if (breadcrumb.length === 0) return null;

  return (
    <nav className="breadcrumb">
      {breadcrumb.map((node, i) => (
        <span key={node.id}>
          {i > 0 && <span className="separator">›</span>}
          <button
            className={`crumb ${i === breadcrumb.length - 1 ? "active" : ""}`}
            onClick={() => selectNode(node)}
          >
            {node.common_name || node.name}
          </button>
        </span>
      ))}
    </nav>
  );
}
