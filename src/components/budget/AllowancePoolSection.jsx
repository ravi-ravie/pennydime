import React from 'react';
import { Plane, Edit2, RefreshCw, Building2 } from 'lucide-react';
import { formatCurrencyInteger } from '../../utils/formatters';

export default function AllowancePoolSection({
  allowancePools = [],
  currencySymbol = '₹',
  onOpenAdjustPool,
  onReconcileCategory,
  activeCategory = 'All',
  searchQuery = '' 
}) {
  const filteredPools = allowancePools.filter(pool => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesSearch = 
        pool.name?.toLowerCase().includes(q) || 
        (pool.category || '').toLowerCase().includes(q);
      if (!matchesSearch) return false;
    }

    if (activeCategory === 'All') return true;
    const poolCat = (pool.category || pool.name || '').toLowerCase();
    return poolCat.includes(activeCategory.toLowerCase());
  });

  return (
    <div className="mb-12">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <span className="text-[#03241a]"><Building2 size={20} /></span>
          <h2 className="font-serif text-xl font-bold text-[#03241a]">Allowance & Budget Pools</h2>
        </div>
        <span className="text-[11px] font-bold tracking-widest text-[#727974] uppercase">{filteredPools.length} Active Pools</span>
      </div>

      {filteredPools.length === 0 ? (
        <div className="bg-white border border-[#eae6df] rounded-2xl p-6 shadow-sm text-center text-[#727974]">
          No allowance pools found for this search or category.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredPools.map((pool) => {
            const poolAllocated = Number(pool?.allocated) || 0;
            const poolSpent = Number(pool?.spent) || 0;
            const poolPct = poolAllocated > 0 ? (poolSpent / poolAllocated) * 100 : 0;

            const isOver = poolPct > 100;
            const isWarning = poolPct >= 85 && poolPct <= 100;

            return (
              <div key={pool.id} className="bg-white border border-[#eae6df] rounded-2xl p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#eae6df] pb-4 mb-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isOver ? 'bg-[#fcedea] text-[#ba1a1a]' : 'bg-[#fcefe9] text-[#a33e07]'}`}>
                      <Plane size={20} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-serif text-[16px] font-bold text-[#1c1c19]">{pool.name}</h3>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${isOver ? 'bg-[#ba1a1a] text-white' : 'bg-[#fcedea] text-[#a33e07]'}`}>
                          {poolPct.toFixed(0)}%
                        </span>
                      </div>
                      <p className="text-[12px] text-[#727974] mt-1">{pool.category || 'General'} pool</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button onClick={() => onOpenAdjustPool(pool)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#eae6df] text-[11px] font-bold text-[#414845] hover:bg-[#f6f3ee] transition-colors">
                      <Edit2 size={12} /> Edit
                    </button>
                    <button onClick={() => onReconcileCategory(pool.name)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#03241a] text-white text-[11px] font-bold hover:bg-[#1b3a2f] transition-colors">
                      <RefreshCw size={12} /> Reconcile
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="bg-[#f6f3ee] rounded-lg p-3">
                    <span className="text-[10px] font-bold tracking-wider text-[#727974] uppercase block mb-1">Allocated</span>
                    <span className="font-serif text-[16px] font-bold text-[#1c1c19]">{formatCurrencyInteger(poolAllocated, currencySymbol)}</span>
                  </div>
                  <div className="bg-[#fcedea] rounded-lg p-3">
                    <span className="text-[10px] font-bold tracking-wider text-[#a33e07] uppercase block mb-1">Spent</span>
                    <span className={`font-serif text-[16px] font-bold ${isOver ? 'text-[#ba1a1a]' : 'text-[#a33e07]'}`}>{formatCurrencyInteger(poolSpent, currencySymbol)}</span>
                  </div>
                  <div className="bg-[#e5e2dd] rounded-lg p-3">
                    <span className="text-[10px] font-bold tracking-wider text-[#727974] uppercase block mb-1">Remaining</span>
                    <span className="font-serif text-[16px] font-bold text-[#03241a]">{formatCurrencyInteger(Math.max(0, poolAllocated - poolSpent), currencySymbol)}</span>
                  </div>
                </div>

                <div>
                  <div className="w-full h-2 bg-[#e5e2dd] rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-500 ${isOver ? 'bg-[#ba1a1a]' : isWarning ? 'bg-[#a33e07]' : 'bg-[#03241a]'}`} style={{ width: `${Math.min(100, poolPct)}%` }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}