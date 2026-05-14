import { FaSearch, FaThLarge, FaList } from 'react-icons/fa';
import './DocumentFilters.css';

function DocumentFilters({
  statusFilter,
  setStatusFilter,
  sortBy,
  setSortBy,
  searchQuery,
  setSearchQuery,
  viewMode,
  setViewMode,
  statusOptions,
  sortOptions
}) {
  return (
    <div className="document-filters">
      <div className="filter-item">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="filter-select"
        >
          {statusOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-item search-box">
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder="Suchen"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="filter-item">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="filter-select"
        >
          {sortOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-item view-toggle">
        <button
          className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
          onClick={() => setViewMode('list')}
          title="Listen-Ansicht"
        >
          <FaList />
        </button>
        <button
          className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
          onClick={() => setViewMode('grid')}
          title="Kachel-Ansicht"
        >
          <FaThLarge />
        </button>
      </div>
    </div>
  );
}

export default DocumentFilters;
