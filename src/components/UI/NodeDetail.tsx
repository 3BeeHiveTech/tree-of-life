import { useTreeStore } from "../../stores/tree";
import { IUCN_COLORS } from "../../utils/colors";

const IUCN_LABELS: Record<string, string> = {
  EX: "Extinct",
  EW: "Extinct in Wild",
  CR: "Critically Endangered",
  EN: "Endangered",
  VU: "Vulnerable",
  NT: "Near Threatened",
  LC: "Least Concern",
  DD: "Data Deficient",
  NE: "Not Evaluated",
};

export function NodeDetail() {
  const { selectedNode, selectNode } = useTreeStore();

  if (!selectedNode) return null;

  const iucnColor = selectedNode.conservation_status
    ? IUCN_COLORS[selectedNode.conservation_status as keyof typeof IUCN_COLORS]
    : null;

  return (
    <div className="node-detail">
      <button className="close-btn" onClick={() => selectNode(null)}>
        ×
      </button>

      <div className="node-header">
        <h2 className="node-name">{selectedNode.name}</h2>
        {selectedNode.common_name && (
          <p className="node-common">{selectedNode.common_name}</p>
        )}
      </div>

      <div className="node-meta">
        <span className="rank-badge">{selectedNode.rank}</span>
        {selectedNode.conservation_status && (
          <span
            className="iucn-badge"
            style={{
              backgroundColor: iucnColor
                ? `rgb(${iucnColor[0] * 255}, ${iucnColor[1] * 255}, ${iucnColor[2] * 255})`
                : undefined,
            }}
          >
            {selectedNode.conservation_status} —{" "}
            {IUCN_LABELS[selectedNode.conservation_status]}
          </span>
        )}
      </div>

      {selectedNode.species_count > 1 && (
        <div className="node-stat">
          <span className="stat-label">Species</span>
          <span className="stat-value">
            {selectedNode.species_count.toLocaleString()}
          </span>
        </div>
      )}

      {selectedNode.iconic_taxa && (
        <div className="node-stat">
          <span className="stat-label">Group</span>
          <span className="stat-value iconic-taxa">
            {selectedNode.iconic_taxa}
          </span>
        </div>
      )}

      {selectedNode.has_children && (
        <div className="node-stat">
          <span className="stat-label">Expandable</span>
          <span className="stat-value">Click node to explore</span>
        </div>
      )}
    </div>
  );
}
