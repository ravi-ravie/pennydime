import React, { useState } from 'react';
import { formatCurrencyInteger } from '../../utils/formatters';

export default function MonthlyTrendChart({ transactions = [], currencySymbol = '₹' }) {
  const [hoveredPoint, setHoveredPoint] = useState(null);

  const drs = transactions.filter((t) => t.type === 'DR');
  const weeks = [0, 0, 0, 0];
  drs.forEach((t) => { const d = new Date(t.date); if (isNaN(d)) return; const weekIdx = Math.min(3, Math.floor((d.getDate() - 1) / 7)); weeks[weekIdx] += parseFloat(t.amount) || 0; });
  const cumulativeWeeks = []; weeks.reduce((acc, w) => { const n = acc + w; cumulativeWeeks.push(n); return n; }, 0);
  const max = Math.max(...cumulativeWeeks, 1);
  const points = cumulativeWeeks.map((amount, i) => ({ week: `W${i + 1}`, amount, x: 50 + i * 120, y: 160 - (amount / max) * 120 }));
  const pathD = points.length > 0 ? `M ${points[0].x} ${points[0].y} ` + points.slice(1).map((p) => `L ${p.x} ${p.y}`).join(' ') : '';
  const areaD = pathD && points.length > 0 ? `${pathD} L ${points[points.length - 1].x} 160 L ${points[0].x} 160 Z` : '';
  const totalDR = cumulativeWeeks[cumulativeWeeks.length - 1] || 0;
  const dailyAvg = Math.round(totalDR / 30);
  const hasData = drs.length > 0;

  return (
    <div className="bg-white border border-[#eae6df] rounded-2xl p-4 md:p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 md:gap-0 mb-4 md:mb-6">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] md:text-[11px] font-bold tracking-wider text-[#727974] uppercase">DR OUTFLOW TREND</span>
          <div className="font-serif text-[24px] md:text-[32px] font-bold text-[#03241a]">{formatCurrencyInteger(totalDR, currencySymbol)} <span className="text-[12px] md:text-[14px] font-sans text-[#727974] font-normal">/ cycle</span></div>
        </div>
        <span className="inline-flex items-center gap-1.5 px-2 py-1 md:px-2.5 md:py-1 bg-[#ebe8e3] rounded-full text-[10px] md:text-[11px] font-semibold text-[#1c1c19]"><span className="w-1.5 h-1.5 rounded-full bg-[#03241a]" /><span>Daily Avg {formatCurrencyInteger(dailyAvg, currencySymbol)}</span></span>
      </div>
      <div className="relative w-full h-[180px] md:h-[220px]">
        {!hasData ? (
          <p className="text-[#727974] text-[13px] md:text-base text-center pt-16 md:pt-20">No outflow data to chart yet.</p>
        ) : (
          <>
            <svg viewBox="0 0 460 190" width="100%" height="100%" preserveAspectRatio="none">
              <defs><linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1b3a2f" stopOpacity="0.45" /><stop offset="100%" stopColor="#fcf9f4" stopOpacity="0.05" /></linearGradient></defs>
              <line x1="30" y1="160" x2="430" y2="160" stroke="#eae6df" strokeWidth="1" />
              <line x1="30" y1="110" x2="430" y2="110" stroke="#eae6df" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="30" y1="60" x2="430" y2="60" stroke="#eae6df" strokeWidth="1" strokeDasharray="3 3" />
              <path d={areaD} fill="url(#trendGradient)" />
              <path d={pathD} fill="none" stroke="#1b3a2f" strokeWidth="2.5" />
              {points.map((pt, i) => (
                <g key={pt.week}>
                  <circle cx={pt.x} cy={pt.y} r={hoveredPoint === i ? 6 : 4} fill="#1b3a2f" stroke="#ffffff" strokeWidth="2" className="cursor-pointer transition-all duration-200" onMouseEnter={() => setHoveredPoint(i)} onMouseLeave={() => setHoveredPoint(null)} />
                  <text x={pt.x} y="178" fontSize="11" fontFamily="Inter, sans-serif" fill="#727974" textAnchor="middle">{pt.week}</text>
                </g>
              ))}
            </svg>
            {hoveredPoint !== null && points[hoveredPoint] && (
              <div className="absolute bg-[#03241a] text-white px-2 py-1 rounded-md text-[10px] md:text-[11px] font-semibold pointer-events-none z-10 -translate-x-1/2 -translate-y-full" style={{ left: `${(points[hoveredPoint].x / 460) * 100}%`, top: `${(points[hoveredPoint].y / 190) * 100 - 10}%` }}>
                {points[hoveredPoint].week}: {formatCurrencyInteger(points[hoveredPoint].amount, currencySymbol)}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}