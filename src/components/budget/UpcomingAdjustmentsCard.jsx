import React from 'react';
import { Car, Tv, Check } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
export default function UpcomingAdjustmentsCard({ upcomingAdjustments = [], budgetGoals = [], currencySymbol = '₹', onAcceptAdjustment }) {
  const totalAllocated = budgetGoals.reduce((s, b) => s + (b.allocated || 0), 0);
  const totalSpent = budgetGoals.reduce((s, b) => s + (b.spent || 0), 0);
  const pct = totalAllocated > 0 ? (totalSpent / totalAllocated) * 100 : 0;
  const underOver = totalAllocated > 0 ? Math.abs(100 - pct) : 0;
  const isUnder = pct < 100;
  return (
    <section className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6 items-stretch mt-2">
      <div className="flex flex-col gap-4">
        <h2 className="font-serif text-xl font-bold text-[#03241a]">Upcoming Adjustments</h2>
        {upcomingAdjustments.length === 0 ? (
          <div className="bg-white border border-[#eae6df] rounded-2xl p-6 shadow-sm text-[#727974] text-[13px]">No upcoming adjustments queued.</div>
        ) : (
          <div className="flex flex-col gap-3">
            {upcomingAdjustments.map((adj) => (
              <div key={adj.id} className="flex items-center justify-between p-4.5 bg-white border border-[#eae6df] rounded-2xl shadow-sm">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#f6f3ee] flex items-center justify-center text-[#1c1c19]">{adj.name.includes('Auto') ? <Car size={20} /> : <Tv size={20} />}</div>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-serif text-[16px] font-bold text-[#03241a]">{adj.name}</span>
                    <span className="text-[12px] text-[#727974]">{adj.desc}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-end">
                    <span className="text-[12px] text-[#727974] line-through">{adj.currency || currencySymbol}{Number(adj.oldVal).toFixed(2)}</span>
                    <span className="font-serif text-[16px] font-bold text-[#e8703a]">{adj.currency || currencySymbol}{Number(adj.newVal).toFixed(2)}</span>
                  </div>
                  <button type="button" className={`w-9 h-9 rounded-full border-[1.5px] flex items-center justify-center transition-colors ${adj.accepted ? 'bg-[#456558] border-[#456558] text-white' : 'border-[#eae6df] text-[#727974] hover:bg-[#eaf5f0] hover:border-[#456558] hover:text-[#456558]'}`} onClick={() => onAcceptAdjustment(adj.id)} title={adj.accepted ? 'Accepted' : 'Accept adjustment'}><Check size={16} strokeWidth={adj.accepted ? 3 : 2} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="bg-[#1b3a2f] text-white rounded-2xl p-7 shadow-md flex flex-col justify-between">
        <div>
          <div className="text-[11px] font-bold tracking-widest uppercase text-white/65 mb-2">TOTAL BUDGET HEALTH</div>
          <div className="font-serif text-[32px] font-bold leading-tight text-white mb-6">
            {totalAllocated === 0 ? 'Set budget allocations to track your health.' : `You are currently ${underOver.toFixed(0)}% ${isUnder ? 'under' : 'over'} your total allocations.`}
          </div>
        </div>
        <div className="flex justify-between border-t border-white/15 pt-4">
          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] text-white/65">Total Allocated</span>
            <span className="font-serif text-lg font-bold">{formatCurrency(totalAllocated, currencySymbol)}</span>
          </div>
          <div className="flex flex-col gap-0.5 text-right">
            <span className="text-[11px] text-white/65">Total Spent</span>
            <span className="font-serif text-lg font-bold">{formatCurrency(totalSpent, currencySymbol)}</span>
          </div>
        </div>
      </div>
    </section>
  );
}