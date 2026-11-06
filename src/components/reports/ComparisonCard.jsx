import React from 'react';
import { formatCurrencyInteger } from '../../utils/formatters';

export default function ComparisonCard({ monthly = {}, currencySymbol = '₹' }) {
  const keys = Object.keys(monthly).sort((a, b) => new Date(`1 ${b}`) - new Date(`1 ${a}`));
  const thisKey = keys[0];
  const thisM = thisKey ? monthly[thisKey] : { CR: 0, DR: 0 };
  const thisNet = (thisM.CR || 0) - (thisM.DR || 0);

  if (!thisKey) return null;

  return (
    <section className="bg-white border border-[#eae6df] rounded-2xl p-4 md:p-7 shadow-sm mt-2 md:mt-4">
      <div className="flex items-center gap-2 mb-4 md:mb-6">
        <span className="w-3 md:w-3.5 h-0.5 bg-[#727974]" />
        <h2 className="font-serif text-[18px] md:text-xl font-bold text-[#03241a]">Current Month Flow</h2>
      </div>
      
      <div className="w-full">
        <span className="text-[10px] md:text-[11px] font-bold tracking-wider text-[#727974] uppercase mb-2 md:mb-4 block">
          {thisKey.toUpperCase()}
        </span>
        
        <div className="mb-4 md:mb-8 pb-4 md:pb-8 border-b border-[#eae6df]">
          <div className="font-serif text-[32px] md:text-[48px] font-bold text-[#03241a] leading-none flex flex-col md:flex-row md:items-baseline gap-1 md:gap-4">
            {formatCurrencyInteger(thisM.DR || 0, currencySymbol)} 
            <span className="text-[11px] md:text-[14px] font-sans text-[#a33e07] font-bold tracking-widest uppercase mt-1 md:mt-0">DR Outflow</span>
          </div>
        </div>

        <div className="flex flex-col gap-3 md:gap-5 text-[13px] md:text-[15px]">
          <div className="flex items-center justify-between">
            <span className="text-[#414845] font-medium md:text-[16px]">Inflow (CR)</span>
            <span className="font-serif text-[16px] md:text-[20px] font-bold text-[#456558]">
              +{formatCurrencyInteger(thisM.CR || 0, currencySymbol)}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-[#414845] font-medium md:text-[16px]">Outflow (DR)</span>
            <span className="font-serif text-[16px] md:text-[20px] font-bold text-[#a33e07]">
              −{formatCurrencyInteger(thisM.DR || 0, currencySymbol)}
            </span>
          </div>

          <div className="flex items-center justify-between pt-3 md:pt-4 border-t border-[#eae6df] mt-1 md:mt-2">
            <span className="text-[#414845] font-bold md:text-[16px]">Net Savings</span>
            <span className={`font-serif text-[18px] md:text-[22px] font-bold ${thisNet >= 0 ? 'text-[#456558]' : 'text-[#a33e07]'}`}>
              {thisNet >= 0 ? '+' : '-'}{formatCurrencyInteger(Math.abs(thisNet), currencySymbol)}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}