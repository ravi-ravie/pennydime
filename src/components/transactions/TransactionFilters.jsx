import React, { useState } from 'react';
import { Filter, ArrowUpDown, ChevronDown } from 'lucide-react';

export default function TransactionFilters({
  filterType,
  setFilterType,
  sortOrder,
  setSortOrder,
  filteredCount
}) {
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  return (
    <div className="tx-controls-bar">
      <div className="tx-count-label">
        <span>Showing <strong>{filteredCount}</strong> transactions</span>
      </div>

      <div className="tx-actions-right">
        {/* Filter Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            className={`tx-filter-btn ${filterType !== 'ALL' ? 'active' : ''}`}
            onClick={() => {
              setShowFilterDropdown(!showFilterDropdown);
              setShowSortDropdown(false);
            }}
          >
            <Filter size={14} />
            <span>
              {filterType === 'ALL'
                ? 'All Types'
                : filterType === 'DR_ONLY'
                ? 'Debits Only (DR)'
                : filterType === 'CR_ONLY'
                ? 'Credits Only (CR)'
                : 'Reconciled Only'}
            </span>
            <ChevronDown size={14} />
          </button>

          {showFilterDropdown && (
            <div className="tx-dropdown-menu">
              <button
                type="button"
                className={`tx-dropdown-item ${filterType === 'ALL' ? 'active' : ''}`}
                onClick={() => {
                  setFilterType('ALL');
                  setShowFilterDropdown(false);
                }}
              >
                All Transactions
              </button>
              <button
                type="button"
                className={`tx-dropdown-item ${filterType === 'DR_ONLY' ? 'active' : ''}`}
                onClick={() => {
                  setFilterType('DR_ONLY');
                  setShowFilterDropdown(false);
                }}
              >
                Debits Only (DR)
              </button>
              <button
                type="button"
                className={`tx-dropdown-item ${filterType === 'CR_ONLY' ? 'active' : ''}`}
                onClick={() => {
                  setFilterType('CR_ONLY');
                  setShowFilterDropdown(false);
                }}
              >
                Credits Only (CR)
              </button>
              <button
                type="button"
                className={`tx-dropdown-item ${filterType === 'RECONCILED' ? 'active' : ''}`}
                onClick={() => {
                  setFilterType('RECONCILED');
                  setShowFilterDropdown(false);
                }}
              >
                Reconciled Only
              </button>
            </div>
          )}
        </div>

        {/* Sort Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            className="tx-filter-btn"
            onClick={() => {
              setShowSortDropdown(!showSortDropdown);
              setShowFilterDropdown(false);
            }}
          >
            <ArrowUpDown size={14} />
            <span>
              {sortOrder === 'DATE_DESC'
                ? 'Date: Newest First'
                : sortOrder === 'DATE_ASC'
                ? 'Date: Oldest First'
                : sortOrder === 'AMOUNT_DESC'
                ? 'Amount: High to Low'
                : 'Amount: Low to High'}
            </span>
            <ChevronDown size={14} />
          </button>

          {showSortDropdown && (
            <div className="tx-dropdown-menu">
              <button
                type="button"
                className={`tx-dropdown-item ${sortOrder === 'DATE_DESC' ? 'active' : ''}`}
                onClick={() => {
                  setSortOrder('DATE_DESC');
                  setShowSortDropdown(false);
                }}
              >
                Date: Newest First
              </button>
              <button
                type="button"
                className={`tx-dropdown-item ${sortOrder === 'DATE_ASC' ? 'active' : ''}`}
                onClick={() => {
                  setSortOrder('DATE_ASC');
                  setShowSortDropdown(false);
                }}
              >
                Date: Oldest First
              </button>
              <button
                type="button"
                className={`tx-dropdown-item ${sortOrder === 'AMOUNT_DESC' ? 'active' : ''}`}
                onClick={() => {
                  setSortOrder('AMOUNT_DESC');
                  setShowSortDropdown(false);
                }}
              >
                Amount: High to Low
              </button>
              <button
                type="button"
                className={`tx-dropdown-item ${sortOrder === 'AMOUNT_ASC' ? 'active' : ''}`}
                onClick={() => {
                  setSortOrder('AMOUNT_ASC');
                  setShowSortDropdown(false);
                }}
              >
                Amount: Low to High
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
