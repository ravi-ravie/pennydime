import React, { useState } from 'react';
import {
  Utensils,
  Plane,
  CreditCard,
  Zap,
  ShoppingBag,
  BookOpen,
  CheckCircle2,
  ChevronDown
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export default function TransactionGroupList({
  filteredTransactions,
  currencySymbol = '₹',
  onToggleReconciled
}) {
  const [visibleLimit, setVisibleLimit] = useState(8);

  const getTransactionIcon = (cat) => {
    switch (cat) {
      case 'Food & Dining':
        return <Utensils size={16} />;
      case 'Travel':
        return <Plane size={16} />;
      case 'Bills & Utilities':
        return <Zap size={16} />;
      case 'Shopping':
        return <ShoppingBag size={16} />;
      case 'Direct Deposit':
      case 'Salary':
      case 'Consulting':
        return <CreditCard size={16} />;
      default:
        return <BookOpen size={16} />;
    }
  };

  const displayedList = filteredTransactions.slice(0, visibleLimit);

  const dateGroups = displayedList.reduce((groups, item) => {
    const d = item.displayDate?.includes('March')
      ? item.displayDate.toUpperCase()
      : new Date(item.date).toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        }).toUpperCase();
    if (!groups[d]) groups[d] = [];
    groups[d].push(item);
    return groups;
  }, {});

  return (
    <div>
      {Object.keys(dateGroups).length === 0 ? (
        <div className="card-white" style={{ padding: '48px', textAlign: 'center' }}>
          <p style={{ color: '#727974', fontSize: '15px' }}>
            No transactions match the selected filter or search query.
          </p>
        </div>
      ) : (
        <div className="tx-groups-stack">
          {Object.entries(dateGroups).map(([dateLabel, items]) => (
            <div key={dateLabel} className="tx-day-group">
              <div className="tx-day-header">
                <span className="tx-day-date">{dateLabel}</span>
                <span className="tx-day-count">{items.length} ENTRIES</span>
              </div>

              <div className="card-white tx-card-container">
                {items.map((tx, idx) => {
                  const isCR = tx.type === 'CR';
                  return (
                    <div
                      key={tx.id || idx}
                      className={`tx-row-item ${idx !== items.length - 1 ? 'with-border' : ''}`}
                    >
                      <div className="tx-left-wrap">
                        <div className={`tx-icon-circle ${isCR ? 'cr' : 'dr'}`}>
                          {getTransactionIcon(tx.category)}
                        </div>

                        <div className="tx-info-block">
                          <div className="tx-title-line">
                            <span className="tx-title-text">{tx.title}</span>
                            <span className={isCR ? 'pill-type-cr' : 'pill-type-dr'}>
                              {tx.type}
                            </span>
                            <button
                              type="button"
                              className={`reconciled-indicator ${tx.isReconciled ? 'active' : ''}`}
                              onClick={() => onToggleReconciled(tx.id)}
                              title={tx.isReconciled ? 'Reconciled (click to toggle)' : 'Unreconciled (click to toggle)'}
                            >
                              <CheckCircle2 size={13} />
                              <span>{tx.isReconciled ? 'Reconciled' : 'Uncertified'}</span>
                            </button>
                          </div>

                          <div className="tx-sub-line">
                            <span>{tx.category}</span>
                            <span>•</span>
                            <span>{tx.method || 'Standard'}</span>
                            {tx.note && (
                              <>
                                <span>•</span>
                                <span className="tx-note-tag">{tx.note}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="tx-right-wrap">
                        <div className={`tx-amount-text ${isCR ? 'cr' : 'dr'}`}>
                          {isCR ? '+' : '−'}
                          {formatCurrency(tx.amount, currencySymbol)}
                        </div>
                        <div className="tx-running-bal-text">
                          Bal: {formatCurrency(tx.runningBal, currencySymbol)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {visibleLimit < filteredTransactions.length && (
        <div className="load-more-container">
          <button
            type="button"
            className="btn-load-more"
            onClick={() => setVisibleLimit((prev) => prev + 6)}
          >
            <span>Load More Transactions</span>
            <ChevronDown size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
