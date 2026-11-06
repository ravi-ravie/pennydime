import React from 'react';
import { ArrowDownLeft, ArrowUpRight, PiggyBank } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export default function ReportStatsCards({ totalCR, totalDR, netFlow, currencySymbol = '₹' }) {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-5 mb-4 md:mb-6">
      <div className="bg-white border border-[#eae6df] rounded-2xl p-4 md:p-6 shadow-sm flex items-center gap-3 md:gap-4">
        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#eaf5f0] text-[#456558] flex items-center justify-center shrink-0"><ArrowDownLeft size={16} className="md:w-5 md:h-5" /></div>
        <div>
          <div className="text-[10px] md:text-[12px] font-medium text-[#414845] mb-0.5 md:mb-1">TOTAL INFLOW (CR)</div>
          <div className="font-serif text-[18px] md:text-2xl font-bold text-[#03241a]">+{formatCurrency(totalCR, currencySymbol)}</div>
        </div>
      </div>
      <div className="bg-white border border-[#eae6df] rounded-2xl p-4 md:p-6 shadow-sm flex items-center gap-3 md:gap-4">
        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#fcedea] text-[#e8703a] flex items-center justify-center shrink-0"><ArrowUpRight size={16} className="md:w-5 md:h-5" /></div>
        <div>
          <div className="text-[10px] md:text-[12px] font-medium text-[#414845] mb-0.5 md:mb-1">TOTAL OUTFLOW (DR)</div>
          <div className="font-serif text-[18px] md:text-2xl font-bold text-[#a33e07]">-{formatCurrency(totalDR, currencySymbol)}</div>
        </div>
      </div>
      <div className="bg-white border border-[#eae6df] rounded-2xl p-4 md:p-6 shadow-sm flex items-center gap-3 md:gap-4">
        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#eef3f0] text-[#456558] flex items-center justify-center shrink-0"><PiggyBank size={16} className="md:w-5 md:h-5" /></div>
        <div>
          <div className="text-[10px] md:text-[12px] font-medium text-[#414845] mb-0.5 md:mb-1">NET SAVINGS</div>
          <div className="font-serif text-[18px] md:text-2xl font-bold text-[#03241a]">{netFlow >= 0 ? '+' : '-'}{formatCurrency(Math.abs(netFlow), currencySymbol)}</div>
        </div>
      </div>
    </section>
  );
}