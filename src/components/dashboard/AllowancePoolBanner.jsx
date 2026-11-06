import React from 'react';
import { Plane, SlidersHorizontal } from 'lucide-react';
import { formatCurrencyInteger } from '../../utils/formatters';

export default function AllowancePoolBanner({
  allowancePool,
  currencySymbol,
  onOpenAdjustPool
}) {
  const allocated = Number(allowancePool?.allocated) || 0;
  const spent = Number(allowancePool?.spent) || 0;
  const remaining = Math.max(0, allocated - spent);
  const percentage = allocated > 0 ? Math.min(100, Math.round((spent / allocated) * 100)) : 0;

  return (
    <section className="bg-white border border-[#eae6df] rounded-2xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5">
      <div className="flex items-center gap-4 min-w-[260px]">
        <div className="w-11 h-11 rounded-xl bg-[#fcefe9] text-[#a33e07] flex items-center justify-center shrink-0">
          <Plane size={22} />
        </div>
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold tracking-wider uppercase text-[#727974]">Allowance Pool</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#fcedea] text-[#a33e07]">{percentage}% Used</span>
          </div>
          <div className="font-serif text-lg font-bold text-[#03241a]">
            {allowancePool?.name || 'Travel Allowance'} — {formatCurrencyInteger(allocated, currencySymbol)}
          </div>
        </div>
      </div>
      
      <div className="flex-1 max-w-sm flex flex-col gap-1.5">
        <div className="flex justify-between text-[11px] text-[#727974]">
          <span>Spent: <strong className="text-[#1c1c19]">{formatCurrencyInteger(spent, currencySymbol)}</strong></span>
          <span>Remaining: <strong className="text-[#1c1c19]">{formatCurrencyInteger(remaining, currencySymbol)}</strong></span>
        </div>
        <div className="w-full h-2.5 bg-[#1b3a2f]/10 rounded-full overflow-hidden shadow-inner">
          <div className="h-full bg-[#e8703a] rounded-full transition-all duration-500" style={{ width: `${percentage}%` }} />
        </div>
      </div>
      
      <button type="button" className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#f6f3ee] border border-[#eae6df] text-[12px] font-semibold text-[#1c1c19] hover:bg-[#f0ede9] transition-colors shrink-0" onClick={onOpenAdjustPool}>
        <SlidersHorizontal size={14} /> <span>Adjust Pool</span>
      </button>
    </section>
  );
}