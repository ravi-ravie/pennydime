import React, { useState } from 'react';
import {
  Plane,
  Home,
  Utensils,
  ShoppingBag,
  Car,
  Tv,
  Sliders,
  RefreshCw
} from 'lucide-react';
import { formatCurrencyInteger } from '../../utils/formatters';

export default function BudgetGoalsGrid({
  budgetGoals,
  currencySymbol = '₹',
  onOpenAdjustBudget,
  onReconcileCategory
}) {
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');

  const filterTabs = ['All', 'Travel', 'Food', 'Shopping', 'Bills', 'Entertainment', 'Others'];

  const filteredBudgets = budgetGoals.filter((b) => {
    if (selectedCategoryFilter === 'All') return true;
    if (selectedCategoryFilter === 'Food') return b.category.includes('Food');
    return b.category.toLowerCase().includes(selectedCategoryFilter.toLowerCase());
  });

  const getBudgetCategoryIcon = (category) => {
    switch (category) {
      case 'Housing':
        return <Home size={18} />;
      case 'Food & Dining':
        return <Utensils size={18} />;
      case 'Shopping':
        return <ShoppingBag size={18} />;
      case 'Travel':
        return <Plane size={18} />;
      case 'Auto Maintenance':
        return <Car size={18} />;
      case 'Subscriptions':
        return <Tv size={18} />;
      default:
        return <Sliders size={18} />;
    }
  };

  const getStatusBadge = (budget) => {
    const pct = (budget.spent / budget.allocated) * 100;
    if (pct > 100) {
      return <span className="budget-status-pill red">OVER (RED)</span>;
    }
    if (pct >= 85) {
      return <span className="budget-status-pill amber">WARNING (AMBER)</span>;
    }
    return <span className="budget-status-pill green">NORMAL (GREEN)</span>;
  };

  const getJarFillClass = (budget) => {
    const pct = (budget.spent / budget.allocated) * 100;
    if (pct > 100) return 'red';
    if (pct >= 85) return 'amber';
    return 'green';
  };

  return (
    <section className="budget-goals-section">
      <div className="category-filter-pills-bar">
        <span
          style={{
            fontSize: '12px',
            fontWeight: '600',
            color: '#727974',
            marginRight: '6px'
          }}
        >
          Categories:
        </span>
        {filterTabs.map((tab) => (
          <button
            type="button"
            key={tab}
            className={`cat-filter-btn ${
              selectedCategoryFilter === tab ? 'active' : ''
            }`}
            onClick={() => setSelectedCategoryFilter(tab)}
          >
            {tab === 'Travel' && <Plane size={13} />}
            {tab === 'Food' && <Utensils size={13} />}
            {tab === 'Shopping' && <ShoppingBag size={13} />}
            <span>{tab}</span>
          </button>
        ))}
      </div>

      <div className="budget-cards-grid">
        {filteredBudgets.map((budget) => {
          const fillPct = Math.round((budget.spent / budget.allocated) * 100);
          const remaining = budget.allocated - budget.spent;
          const isOver = remaining < 0;
          const cardClass = isOver
            ? 'over-red'
            : fillPct >= 85
            ? 'warning-amber'
            : '';

          return (
            <div key={budget.id} className={`budget-card ${cardClass}`}>
              <div>
                <div className="budget-card-header">
                  <div className="budget-card-icon-title">
                    <div className="budget-icon-circle">
                      {getBudgetCategoryIcon(budget.category)}
                    </div>
                    <div className="budget-name-type">
                      <span className="budget-card-name">{budget.category}</span>
                      <span className="budget-card-type">{budget.type}</span>
                    </div>
                  </div>
                  {getStatusBadge(budget)}
                </div>

                <div className="budget-amount-display">
                  <div className="budget-spent-label">DR SPENT / ALLOCATED</div>
                  <div className="budget-amount-row">
                    <span className="budget-amount-spent">
                      {formatCurrencyInteger(budget.spent, currencySymbol)}
                    </span>
                    <span className="budget-amount-allocated">
                      / {formatCurrencyInteger(budget.allocated, currencySymbol)}
                    </span>
                  </div>
                </div>

                <div className="budget-remaining-text">
                  {isOver ? (
                    <span>
                      Remaining Balance: −{currencySymbol}
                      {Math.abs(remaining).toLocaleString('en-IN')} Deficit ({fillPct}%)
                    </span>
                  ) : (
                    <span>
                      Remaining Balance: {currencySymbol}
                      {remaining.toLocaleString('en-IN')} ({Math.round(100 - fillPct)}% left)
                    </span>
                  )}
                </div>

                <div className="jar-progress-track">
                  <div
                    className={`jar-progress-fill ${getJarFillClass(budget)}`}
                    style={{ width: `${Math.min(100, fillPct)}%` }}
                  />
                </div>
              </div>

              <div className="budget-card-actions">
                <button
                  type="button"
                  className="budget-action-btn"
                  onClick={() => onOpenAdjustBudget(budget)}
                >
                  <Sliders size={13} />
                  <span>Adjust Limit</span>
                </button>
                <button
                  type="button"
                  className="budget-action-btn"
                  onClick={() => onReconcileCategory(budget.category)}
                >
                  <RefreshCw size={13} />
                  <span>Reconcile</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
