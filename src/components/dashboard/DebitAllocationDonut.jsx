import React from 'react';
import { PieChart } from 'lucide-react';
import { formatCurrencyInteger } from '../../utils/formatters';

const PALETTE = ['#e8703a', '#03241a', '#1b3a2f', '#456558', '#83a496', '#fd8048', '#727974'];

export default function DebitAllocationDonut({
  transactions = [],
  totalDR = 0,
  currencySymbol = '₹'
}) {
  const drTransactions = transactions.filter((t) => t.type === 'DR');

  const categoryMap = {};
  drTransactions.forEach((tx) => {
    const cat = tx.category || 'Others';
    categoryMap[cat] = (categoryMap[cat] || 0) + (parseFloat(tx.amount) || 0);
  });

  const categoryEntries = Object.entries(categoryMap).sort((a, b) => b[1] - a[1]);
  const calculatedTotalDR = categoryEntries.reduce((sum, [, amt]) => sum + amt, 0);

  const categories = categoryEntries.map(([name, amount], index) => {
    const pctVal = calculatedTotalDR > 0 ? (amount / calculatedTotalDR) * 100 : 0;
    return {
      name,
      amount,
      pctVal,
      pct: `${pctVal.toFixed(1)}%`,
      color: PALETTE[index % PALETTE.length]
    };
  });

  const circumference = 2 * Math.PI * 68;

  let accumulatedOffset = 0;
  const svgSegments = categories.map((cat) => {
    const segmentLength = (cat.pctVal / 100) * circumference;
    const strokeDasharray = `${segmentLength} ${circumference}`;
    const strokeDashoffset = -accumulatedOffset;
    accumulatedOffset += segmentLength;
    return { name: cat.name, color: cat.color, strokeDasharray, strokeDashoffset };
  });

  return (
    <div className="bg-white border border-[#eae6df] rounded-2xl shadow-sm flex flex-col p-5 md:p-6 min-h-[420px]">
      
      {/* Header: Row layout with flex-shrink on badge */}
      <div className="flex flex-row justify-between items-start md:items-center gap-3 mb-4 md:mb-6">
        <div>
          <h2 className="font-serif text-[20px] md:text-xl font-bold text-[#03241a] mb-1">Debit Allocation</h2>
          <div className="text-[12px] md:text-[13px] text-[#727974] leading-tight md:leading-normal">Breakdown of real DR entries by category</div>
        </div>
        <div className="bg-[#fcedea] text-[#e8703a] text-[10px] md:text-[11px] font-bold px-2.5 py-1 rounded-md tracking-wide whitespace-nowrap shrink-0">
          {categories.length} {categories.length === 1 ? 'Category' : 'Categories'}
        </div>
      </div>

      {categories.length === 0 || calculatedTotalDR === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[#fcf9f4] rounded-xl border border-dashed border-[#e0ded8] text-center">
          <div className="w-12 h-12 rounded-full bg-[#f0ede9] flex items-center justify-center mb-4">
            <PieChart size={24} className="text-[#727974]" />
          </div>
          <p className="font-semibold text-[#1c1c19] mb-1 text-[15px]">No Debit Outflows Yet</p>
          <p className="text-[#727974] text-[13px] max-w-[280px] leading-relaxed">
            Record your first expense with <strong>Add Entry</strong> to see dynamic double-entry category breakdowns.
          </p>
        </div>
      ) : (
        <>
          <div className="flex justify-center items-center relative my-4 md:my-6">
            <svg
              width="180"
              height="180"
              viewBox="0 0 180 180"
              className="-rotate-90"
            >
              {svgSegments.map((seg) => (
                <circle
                  key={seg.name}
                  cx="90"
                  cy="90"
                  r="68"
                  fill="none"
                  stroke={seg.color}
                  strokeWidth="20"
                  strokeDasharray={seg.strokeDasharray}
                  strokeDashoffset={seg.strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-300 ease-in-out"
                />
              ))}
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center pointer-events-none">
              <span className="text-[11px] font-semibold text-[#727974] uppercase tracking-wide">Total DR</span>
              <span className="font-serif text-2xl font-bold text-[#a33e07] my-0.5">
                {formatCurrencyInteger(calculatedTotalDR, currencySymbol)}
              </span>
              <span className="text-[10px] text-[#727974]">100% debits</span>
            </div>
          </div>

          <div className="flex flex-col gap-4 mt-6">
            {categories.map((item) => (
              <div key={item.name}>
                <div className="flex items-center justify-between mb-1.5 text-[13px]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="font-medium text-[#1c1c19]">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-[#1c1c19]">
                      {formatCurrencyInteger(item.amount, currencySymbol)}
                    </span>
                    <span className="text-[11px] text-[#727974]">({item.pct})</span>
                  </div>
                </div>
                <div className="w-full h-1.5 bg-[#f0ede9] rounded-full overflow-hidden">
                   <div className="h-full rounded-full transition-all duration-500" style={{ width: `${item.pctVal}%`, backgroundColor: item.color }} />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}