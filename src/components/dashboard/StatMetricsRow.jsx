import React from 'react';
import { ArrowDownLeft, ArrowUpRight, BookOpen } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
export default function StatMetricsRow({ totalCR, totalDR, crCount, drCount, currencySymbol }) {
  const netFlow = totalCR - totalDR;
  const savingsRate = totalCR > 0 ? Math.round((netFlow / totalCR) * 100) : 0;
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
      <div className="bg-white border border-[#eae6df] rounded-2xl p-6 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3.5">
          <div className="w-9 h-9 rounded-full bg-[#eaf5f0] text-[#456558] flex items-center justify-center"><ArrowDownLeft size={20} /></div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#eaf5f0] text-[#456558] tracking-wide">CR</span>
        </div>
        <div>
          <div className="text-[12px] font-medium text-[#414845] mb-1">CR (Credit / Money In)</div>
          <div className="font-serif text-2xl font-bold text-[#03241a] mb-1">+{formatCurrency(totalCR, currencySymbol)}</div>
          <div className="text-[12px] text-[#727974]">{crCount} entries recorded</div>
        </div>
      </div>
      <div className="bg-white border border-[#eae6df] rounded-2xl p-6 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3.5">
          <div className="w-9 h-9 rounded-full bg-[#fcedea] text-[#e8703a] flex items-center justify-center"><ArrowUpRight size={20} /></div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#fcedea] text-[#e8703a] tracking-wide">DR</span>
        </div>
        <div>
          <div className="text-[12px] font-medium text-[#414845] mb-1">DR (Debit / Money Out)</div>
          <div className="font-serif text-2xl font-bold text-[#a33e07] mb-1">-{formatCurrency(totalDR, currencySymbol)}</div>
          <div className="text-[12px] text-[#727974]">{drCount} entries recorded</div>
        </div>
      </div>
      <div className="bg-[#1b3a2f] rounded-2xl p-6 shadow-md flex flex-col justify-between text-white">
        <div className="flex items-center justify-between mb-3.5">
          <div className="w-9 h-9 rounded-full bg-[#fd8048] text-white flex items-center justify-center"><BookOpen size={20} /></div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/15 text-white tracking-wide">Net</span>
        </div>
        <div>
          <div className="text-[12px] font-medium text-white/70 mb-1">Net Flow (Surplus)</div>
          <div className="font-serif text-2xl font-bold text-white mb-1">{netFlow >= 0 ? '+' : '-'}{formatCurrency(Math.abs(netFlow), currencySymbol)}</div>
          <div className="text-[12px] text-white/70">{totalCR > 0 ? `${savingsRate}% savings rate` : 'No credits yet'}</div>
        </div>
      </div>
    </section>
  );
}