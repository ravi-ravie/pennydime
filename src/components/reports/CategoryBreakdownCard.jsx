import React from 'react';
import { formatCurrencyInteger } from '../../utils/formatters';

export default function CategoryBreakdownCard({ categories = [], totalDR = 0, currencySymbol = '₹' }) {
  if (categories.length === 0) return <div className="bg-white border border-[#eae6df] rounded-2xl p-4 md:p-6 shadow-sm min-h-[300px] flex flex-col"><span className="text-[10px] md:text-[11px] font-bold tracking-wider text-[#727974] uppercase">OUTFLOW BREAKDOWN (DR ONLY)</span><p className="text-[#727974] text-[12px] md:text-[14px] mt-4">No debit entries yet. Record an expense to see category breakdown.</p></div>;
  
  const circ = 2 * Math.PI * 62;
  let offset = 0;
  const segs = categories.map((c) => { const len = (c.pctVal / 100) * circ; const seg = { ...c, dash: `${len} ${circ}`, offset: -offset }; offset += len; return seg; });

  return (
    <div className="bg-white border border-[#eae6df] rounded-2xl p-4 md:p-6 shadow-sm">
      <div className="flex justify-between items-center mb-3 md:mb-4">
        <span className="text-[10px] md:text-[11px] font-bold tracking-wider text-[#727974] uppercase">OUTFLOW BREAKDOWN</span>
        <span className="bg-[#fcedea] text-[#e8703a] text-[9px] md:text-[10px] font-bold px-2 py-0.5 rounded-full">{categories.length} Categories</span>
      </div>
      <div className="flex justify-center items-center relative my-2 md:my-4">
        <svg width="140" height="140" className="md:w-[170px] md:h-[170px] -rotate-90" viewBox="0 0 170 170">
          {segs.map((s) => <circle key={s.name} cx="85" cy="85" r="62" fill="none" stroke={s.color} strokeWidth="18" strokeDasharray={s.dash} strokeDashoffset={s.offset} strokeLinecap="round" />)}
        </svg>
        <div className="absolute flex flex-col items-center justify-center text-center pointer-events-none">
          <span className="text-[9px] md:text-[11px] font-semibold text-[#727974] uppercase tracking-wide">TOTAL DR</span>
          <span className="font-serif text-[20px] md:text-2xl font-bold text-[#a33e07]">{formatCurrencyInteger(totalDR, currencySymbol)}</span>
          <span className="text-[8px] md:text-[10px] text-[#727974]">100% debits</span>
        </div>
      </div>
      <div className="flex flex-col gap-2 md:gap-3">
        {categories.map((item) => (
          <div key={item.name} className="flex items-center justify-between text-[12px] md:text-[13px]">
            <div className="flex items-center gap-1.5 md:gap-2">
              <span className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
              <span className="font-medium text-[#1c1c19] truncate max-w-[100px] md:max-w-none">{item.name}</span>
            </div>
            <div className="flex items-center gap-1 md:gap-2 shrink-0">
              <span className="font-semibold text-[#1c1c19]">{formatCurrencyInteger(item.amount, currencySymbol)}</span>
              <span className="text-[10px] md:text-[11px] text-[#727974]">({item.pctVal.toFixed(1)}%)</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}