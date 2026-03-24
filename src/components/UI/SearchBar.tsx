import { useTreeStore } from "../../stores/tree";

export function SearchBar() {
  const { searchQuery, searchResults, setSearchQuery, selectNode } =
    useTreeStore();

  return (
    <div className="search-bar">
      <div className="search-input-wrapper">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="text"
          placeholder="Search species..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          spellCheck={false}
        />
        {searchQuery && (
          <button
            className="clear-btn"
            onClick={() => setSearchQuery("")}
          >
            ×
          </button>
        )}
      </div>
      {searchResults.length > 0 && (
        <ul className="search-results">
          {searchResults.map((node) => (
            <li
              key={node.id}
              onClick={() => {
                selectNode(node);
                setSearchQuery("");
              }}
            >
              <span className="result-name">{node.name}</span>
              {node.common_name && (
                <span className="result-common">{node.common_name}</span>
              )}
              <span className="result-rank">{node.rank}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
