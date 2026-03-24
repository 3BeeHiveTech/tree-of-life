import { useTreeStore } from "../../stores/tree";
import { ICONIC_TAXA_COLORS, IUCN_COLORS } from "../../utils/colors";

const ICONIC_LABELS: Record<string, string> = {
  aves: "Birds",
  mammalia: "Mammals",
  insecta: "Insects",
  arachnida: "Arachnids",
  plantae: "Plants",
  fungi: "Fungi",
  amphibia: "Amphibians",
  reptilia: "Reptiles",
  actinopterygii: "Fish",
  mollusca: "Mollusks",
  animalia: "Other Animals",
};

const IUCN_LABELS: Record<string, string> = {
  CR: "Critically Endangered",
  EN: "Endangered",
  VU: "Vulnerable",
  NT: "Near Threatened",
  LC: "Least Concern",
  DD: "Data Deficient",
  NE: "Not Evaluated",
};

function colorToCSS(c: [number, number, number]) {
  return `rgb(${Math.round(c[0] * 255)}, ${Math.round(c[1] * 255)}, ${Math.round(c[2] * 255)})`;
}

export function Legend() {
  const colorMode = useTreeStore((s) => s.colorMode);

  const entries =
    colorMode === "iconic"
      ? Object.entries(ICONIC_TAXA_COLORS)
          .filter(([key]) => key in ICONIC_LABELS)
          .map(([key, color]) => ({
            label: ICONIC_LABELS[key],
            color: colorToCSS(color),
          }))
      : Object.entries(IUCN_COLORS)
          .filter(([key]) => key in IUCN_LABELS)
          .map(([key, color]) => ({
            label: `${key} — ${IUCN_LABELS[key]}`,
            color: colorToCSS(color),
          }));

  return (
    <div className="legend">
      <h3 className="legend-title">
        {colorMode === "iconic" ? "Taxonomic Groups" : "Conservation Status"}
      </h3>
      <div className="legend-entries">
        {entries.map((entry) => (
          <div key={entry.label} className="legend-entry">
            <span
              className="legend-dot"
              style={{ backgroundColor: entry.color }}
            />
            <span className="legend-label">{entry.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
