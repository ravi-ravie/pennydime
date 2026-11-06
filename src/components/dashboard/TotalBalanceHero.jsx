import React from 'react';
import { Edit3, ShieldCheck } from 'lucide-react';
import { formatCurrency, formatCurrencyInteger } from '../../utils/formatters';

export default function TotalBalanceHero({
  startingBalance,
  totalCR,
  totalDR,
  currentBalance,
  currencySymbol,
  onOpenSetStarting
}) {
  const todayStr = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="bg-white border border-[#eae6df] rounded-2xl p-7 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-0.5 bg-[#727974]" />
            <span className="text-[11px] font-bold tracking-wider text-[#727974] uppercase">
              Total Balance
            </span>
          </div>
          <button
            type="button"
            className="flex items-center gap-1 px-2.5 py-1 rounded-full border border-[#eae6df] bg-white hover:bg-[#f6f3ee] text-[11px] font-medium text-[#414845] hover:text-[#03241a] transition-colors"
            onClick={onOpenSetStarting}
            title="Update starting baseline balance"
          >
            <Edit3 size={12} />
            <span>Set Starting</span>
          </button>
        </div>

        <div className="flex flex-wrap items-baseline gap-4 mb-4">
          <span className="font-serif text-[48px] font-bold text-[#03241a] leading-none tracking-tight">
            {formatCurrency(currentBalance, currencySymbol)}
          </span>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#eaf5f0] text-[#456558] text-[12px] font-semibold">
            <ShieldCheck size={14} />
            <span>
              {currentBalance > 0
                ? 'Solvent & Balanced'
                : currentBalance === 0
                ? 'Zero Baseline'
                : 'Deficit Alert'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <span className="text-[13px] text-[#727974]">
            Real balance as of {todayStr}
          </span>
        </div>
      </div>

      <div className="inline-flex flex-wrap items-center gap-2 px-4 py-2 bg-[#f6f3ee] border border-[#eae6df] rounded-full text-[12px] text-[#414845] font-medium w-fit">
        <span className="text-[#727974]">Double-Entry:</span>
        <span>Start {formatCurrencyInteger(startingBalance, currencySymbol)}</span>
        <span className="text-[#727974]">+</span>
        <span className="text-[#456558] font-semibold">
          CR {formatCurrencyInteger(totalCR, currencySymbol)}
        </span>
        <span className="text-[#727974]">−</span>
        <span className="text-[#a33e07] font-semibold">
          DR {formatCurrencyInteger(totalDR, currencySymbol)}
        </span>
        <span className="text-[#727974]">=</span>
        <span className="text-[#03241a] font-bold underline decoration-[#03241a] decoration-2 underline-offset-4">
          {formatCurrencyInteger(currentBalance, currencySymbol)}
        </span>
      </div>
    </div>
  );
}