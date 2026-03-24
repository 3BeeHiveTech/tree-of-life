import { useTreeStore, type ColorMode } from "../../stores/tree";

const MODES: { value: ColorMode; label: string; icon: string }[] = [
  { value: "iconic", label: "Taxonomic Groups", icon: "🌿" },
  { value: "iucn", label: "Conservation Status", icon: "🛡" },
];

export function ColorModeSwitch() {
  const { colorMode, setColorMode } = useTreeStore();

  return (
    <div className="color-mode-switch">
      {MODES.map((mode) => (
        <button
          key={mode.value}
          className={`mode-btn ${colorMode === mode.value ? "active" : ""}`}
          onClick={() => setColorMode(mode.value)}
          title={mode.label}
        >
          <span className="mode-icon">{mode.icon}</span>
          <span className="mode-label">{mode.label}</span>
        </button>
      ))}
    </div>
  );
}
