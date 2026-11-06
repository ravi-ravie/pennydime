import React, { useState, useMemo } from 'react';
import { Plus, Plane, Home, Utensils, ShoppingBag, Settings2, RefreshCw, Zap, Tv } from 'lucide-react';
import { formatCurrencyInteger } from '../../utils/formatters';
import AllowancePoolSection from '../../components/budget/AllowancePoolSection';

export default function BudgetsPage({
  allowancePools = [],
  budgetGoals = [],
  transactions = [],
  currencySymbol = '₹',
  onOpenAdjustPool,
  onOpenAdjustBudget,
  onReconcileCategory,
  onAddAllowancePool,
  onOpenAddEntry,
  searchQuery = ''
}) {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredBudgets = budgetGoals.filter((b) => {
    if (!b.allocated || Number(b.allocated) === 0) return false;
    
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (!b.category.toLowerCase().includes(q)) return false;
    }

    if (activeCategory === 'All') return true;
    if (activeCategory === 'Food') return b.category.includes('Food');
    if (activeCategory === 'Bills') return b.category.includes('Bills');
    return b.category.toLowerCase().includes(activeCategory.toLowerCase());
  });

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Housing': return <Home size={18} />;
      case 'Food & Dining': return <Utensils size={18} />;
      case 'Shopping': return <ShoppingBag size={18} />;
      case 'Travel': return <Plane size={18} />;
      case 'Bills & Utilities': return <Zap size={18} />;
      case 'Entertainment': return <Tv size={18} />;
      default: return <Settings2 size={18} />;
    }
  };

  const poolExpenses = useMemo(() => {
    const poolTxs = transactions.filter(t => t.type === 'DR' && t.allowancePool && t.allowancePool !== 'none');
    
    return poolTxs.map(tx => {
      const pool = allowancePools.find(p => p.id === tx.allowancePool);
      const dateObj = new Date(tx.date);
      const monthYear = dateObj.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      
      return {
        ...tx,
        poolName: pool ? pool.name : 'Unknown Pool',
        monthYear
      };
    }).sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [transactions, allowancePools]);

  const filteredPoolExpenses = poolExpenses.filter(tx => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = tx.title ? tx.title.toLowerCase().includes(q) : false;
      const matchCategory = tx.category ? tx.category.toLowerCase().includes(q) : false;
      const matchPool = tx.poolName ? tx.poolName.toLowerCase().includes(q) : false;
      const matchNote = tx.note ? tx.note.toLowerCase().includes(q) : false;
      
      if (!matchTitle && !matchCategory && !matchPool && !matchNote) {
        return false;
      }
    }

    if (activeCategory === 'All') return true;
    if (activeCategory === 'Food') return tx.category.includes('Food');
    if (activeCategory === 'Bills') return tx.category.includes('Bills');
    return tx.category.toLowerCase().includes(activeCategory.toLowerCase());
  });

  return (
    <div className="flex flex-col w-full relative pb-10">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 md:gap-6 mb-6 md:mb-8 border-b border-[#eae6df] pb-4 md:pb-6">
        <div>
          <h1 className="font-serif text-[32px] md:text-[42px] font-bold text-[#03241a] leading-tight tracking-tight mb-2">Monthly Allocations</h1>
          <p className="text-[13px] md:text-[15px] text-[#727974] max-w-2xl">
            Monitor your spending across categories. The fill levels represent your progress against your set monthly targets.
          </p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button 
            onClick={onAddAllowancePool}
            disabled={allowancePools.length >= 3}
            className={`flex items-center justify-center gap-2 w-full md:w-auto px-5 py-2.5 rounded-full text-[12px] md:text-[13px] font-bold shadow-md transition-colors ${allowancePools.length >= 3 ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-[#a33e07] text-white hover:bg-[#8b3506]'}`}
          >
            <Plus size={16} /> Add Allowance Pool
          </button>
        </div>
      </div>

      <AllowancePoolSection
        allowancePools={allowancePools}
        currencySymbol={currencySymbol}
        onOpenAdjustPool={onOpenAdjustPool}
        onReconcileCategory={onReconcileCategory}
        activeCategory={activeCategory}
      />

      <div className="flex items-center gap-2 mb-6 md:mb-8 overflow-x-auto pb-2 border-t border-[#eae6df] pt-4 md:pt-6">
        <span className="text-[11px] md:text-[12px] font-bold text-[#414845] mr-1 shrink-0">Categories:</span>
        {['All', 'Travel', 'Food', 'Shopping', 'Bills', 'Entertainment', 'Others'].map(cat => (
          <button 
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 md:px-3.5 py-1.5 rounded-full text-[11px] md:text-[12px] font-bold whitespace-nowrap transition-colors shrink-0 ${activeCategory === cat ? 'bg-[#03241a] text-white' : 'bg-[#f0ede9] text-[#414845] hover:bg-[#e5e2dd]'}`}
          >
            {cat === 'Travel' && <Plane size={12} className="inline mr-1" />}
            {cat === 'Food' && <Utensils size={12} className="inline mr-1" />}
            {cat === 'Shopping' && <ShoppingBag size={12} className="inline mr-1" />}
            {cat === 'Bills' && <Zap size={12} className="inline mr-1" />}
            {cat === 'Entertainment' && <Tv size={12} className="inline mr-1" />}
            {cat}
          </button>
        ))}
      </div>

      <div className="mb-8 md:mb-12">
        <h2 className="font-serif text-[20px] md:text-[22px] font-bold text-[#03241a] mb-3 md:mb-4">Category Spending by Pool</h2>
        {filteredPoolExpenses.length === 0 ? (
          <div className="bg-white border border-[#eae6df] rounded-2xl p-6 text-[#727974] text-[13px] text-center">
            No expenses found matching your search or category.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {filteredPoolExpenses.map((tx, idx) => (
              <div key={idx} className="bg-white border border-[#eae6df] rounded-xl p-4 shadow-sm flex flex-col justify-between hover:border-[#c1c8c3] transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2.5 md:gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#f0ede9] text-[#414845] flex items-center justify-center shrink-0">
                      {getCategoryIcon(tx.category)}
                    </div>
                    <div>
                      <h4 className="font-serif text-[14px] md:text-[15px] font-bold text-[#1c1c19]">{tx.category}</h4>
                      <p className="text-[11px] text-[#727974] truncate max-w-[100px] md:max-w-[120px]">{tx.title}</p>
                    </div>
                  </div>
                  <span className="font-serif text-[15px] md:text-[16px] font-bold text-[#a33e07] shrink-0">
                    -{formatCurrencyInteger(tx.amount, currencySymbol)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[10px] md:text-[11px] text-[#727974] border-t border-[#eae6df] pt-2 md:pt-3 mt-1">
                  <span className="flex items-center gap-1 font-bold text-[#03241a] bg-[#f6f3ee] px-1.5 md:px-2 py-0.5 rounded-md truncate max-w-[120px]">
                    <Plane size={10} className="shrink-0" /> <span className="truncate">{tx.poolName}</span>
                  </span>
                  <span className="shrink-0">{tx.monthYear}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {filteredBudgets.length > 0 && (
        <>
          <h2 className="font-serif text-[20px] md:text-[22px] font-bold text-[#03241a] mb-3 md:mb-4 border-t border-[#eae6df] pt-4 md:pt-6">Budget Limits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-12">
            {filteredBudgets.map((b) => {
              const spent = Number(b.spent) || 0;
              const allocated = Number(b.allocated) || 0;
              const remaining = allocated - spent;
              const pct = allocated > 0 ? (spent / allocated) * 100 : 0;
              
              const isOver = pct > 100;
              const isWarning = pct >= 85 && pct <= 100;
              
              const cardClass = isOver 
                ? 'bg-[#fdf6f5] border-[#ba1a1a]/30 shadow-[0_4px_24px_rgba(186,26,26,0.1)]' 
                : 'bg-white border-[#eae6df] shadow-sm';

              return (
                <div key={b.id} className={`rounded-2xl p-4 md:p-6 flex flex-col justify-between border transition-all hover:-translate-y-1 ${cardClass}`}>
                  
                  <div className="flex justify-between items-start mb-4 md:mb-6">
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center ${isOver ? 'bg-[#fcedea] text-[#ba1a1a]' : 'bg-[#f0ede9] text-[#03241a]'}`}>
                        {getCategoryIcon(b.category)}
                      </div>
                      <div>
                        <h3 className="font-serif text-[16px] md:text-[18px] font-bold text-[#1c1c19]">{b.category}</h3>
                        <span className="text-[10px] md:text-[11px] text-[#727974]">{b.type || 'Variable Budget'}</span>
                      </div>
                    </div>
                    
                    <div className={`px-2 md:px-2.5 py-1 rounded-full text-[9px] md:text-[10px] font-bold tracking-wider uppercase ${isOver ? 'bg-[#ba1a1a] text-white' : isWarning ? 'bg-[#fcedea] text-[#a33e07]' : 'bg-[#eaf5f0] text-[#456558]'}`}>
                      {isOver ? 'Over (Red)' : isWarning ? 'Warning' : 'Normal'}
                    </div>
                  </div>

                  <div className="mb-4 md:mb-6">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-2 gap-1">
                      <span className={`text-[10px] md:text-[11px] font-bold uppercase tracking-wider ${isOver ? 'text-[#ba1a1a]' : 'text-[#727974]'}`}>DR Spent / Allocated</span>
                      <div className="flex items-baseline gap-1">
                        <span className={`font-serif text-[24px] md:text-[28px] font-bold ${isOver ? 'text-[#ba1a1a]' : isWarning ? 'text-[#a33e07]' : 'text-[#03241a]'}`}>
                          {formatCurrencyInteger(spent, currencySymbol)}
                        </span>
                        <span className="text-[12px] md:text-[14px] text-[#727974]">/ {formatCurrencyInteger(allocated, currencySymbol)}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between text-[11px] md:text-[12px] pt-2 md:pt-3 border-t border-[#eae6df]">
                      <span className="text-[#727974]">Remaining:</span>
                      <span className={`font-bold ${isOver ? 'text-[#ba1a1a]' : 'text-[#03241a]'}`}>
                        {isOver ? '-' : ''}{formatCurrencyInteger(Math.abs(remaining), currencySymbol)} ({pct.toFixed(0)}%)
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="w-full h-2 md:h-3 bg-[#e5e2dd] rounded-full overflow-hidden relative mb-3 md:mb-4">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${isOver ? 'bg-[#ba1a1a]' : isWarning ? 'bg-[#a33e07]' : 'bg-[#03241a]'}`} 
                        style={{ width: `${Math.min(100, pct)}%` }} 
                      />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] md:text-[10px] font-bold text-white mix-blend-difference">
                        {pct.toFixed(0)}%
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center pt-2 md:pt-3 border-t border-[#eae6df]">
                      <button onClick={() => onOpenAdjustBudget(b)} className="text-[11px] md:text-[12px] font-bold text-[#03241a] hover:underline flex items-center gap-1">
                        <Settings2 size={12} className="md:w-3.5 md:h-3.5" /> Adjust
                      </button>
                      <button onClick={() => onReconcileCategory(b.category)} className="text-[11px] md:text-[12px] font-bold text-[#727974] hover:text-[#1c1c19] flex items-center gap-1">
                        <RefreshCw size={12} className="md:w-3.5 md:h-3.5" /> Reconcile
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}