const fs = require('fs');
const path = require('path');

const files = {
    'src/utils/calculations.js': `export function deriveLedger({ transactions = [], startingBalance = 0 }) {
  const cr = transactions.filter((t) => t.type === 'CR');
  const dr = transactions.filter((t) => t.type === 'DR');
  const totalCR = cr.reduce((s, t) => s + (parseFloat(t.amount) || 0), 0);
  const totalDR = dr.reduce((s, t) => s + (parseFloat(t.amount) || 0), 0);
  const currentBalance = startingBalance + totalCR - totalDR;
  const netFlow = totalCR - totalDR;
  const savingsRate = totalCR > 0 ? (netFlow / totalCR) * 100 : 0;
  return { cr, dr, totalCR, totalDR, currentBalance, netFlow, savingsRate };
}
export function deriveCategories(transactions = []) {
  const dr = transactions.filter((t) => t.type === 'DR');
  const totalDR = dr.reduce((s, t) => s + (parseFloat(t.amount) || 0), 0);
  const map = {};
  dr.forEach((t) => {
    const cat = t.category || 'Others';
    map[cat] = (map[cat] || 0) + (parseFloat(t.amount) || 0);
  });
  const PALETTE = ['#e8703a', '#03241a', '#1b3a2f', '#456558', '#83a496', '#fd8048', '#727974'];
  return Object.entries(map)
    .map(([name, amount], i) => ({
      name, amount, pctVal: totalDR > 0 ? (amount / totalDR) * 100 : 0, color: PALETTE[i % PALETTE.length]
    }))
    .sort((a, b) => b.amount - a.amount);
}
export function deriveMonthlyBreakdown(transactions = []) {
  const map = {};
  transactions.forEach((t) => {
    const d = new Date(t.date);
    if (isNaN(d)) return;
    const key = d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    if (!map[key]) map[key] = { CR: 0, DR: 0 };
    map[key][t.type] = (map[key][t.type] || 0) + (parseFloat(t.amount) || 0);
  });
  return map;
}`,

    'src/components/dashboard/ReconcileModal.jsx': `import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
export default function ReconcileModal({ isOpen, onClose, currentBalance, onReconciled, currencySymbol = '₹' }) {
  const [statementBalance, setStatementBalance] = useState(currentBalance.toFixed(2));
  const diff = Math.abs(parseFloat(statementBalance || 0) - currentBalance);
  const isMatch = diff < 0.01;
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#03241a]/45 backdrop-blur-sm animate-in fade-in" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-[520px] max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-[#eae6df]">
          <h2 className="font-serif text-xl font-bold text-[#03241a] flex items-center gap-2">
            <ShieldCheck size={22} className="text-[#1b3a2f]" /> Reconcile Ledger Balance
          </h2>
          <button className="text-[#727974] hover:bg-[#f0ede9] p-1.5 rounded-md transition-colors" onClick={onClose}><X size={20} /></button>
        </div>
        <div className="p-6 flex flex-col gap-5">
          <div className="p-4 bg-[#f6f3ee] rounded-xl border border-[#eae6df] flex flex-col gap-1.5">
            <span className="text-[11px] font-bold uppercase text-[#727974] tracking-wider">Calculated Ledger Balance</span>
            <span className="font-serif text-[28px] font-bold text-[#03241a]">{formatCurrency(currentBalance, currencySymbol)}</span>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold text-[#414845]">Confirm Bank Statement Balance ({currencySymbol})</label>
            <input type="number" step="any" className="w-full border-b-2 border-[#e0ded8] bg-transparent py-2 text-[14px] focus:outline-none focus:border-[#1b3a2f] transition-colors" value={statementBalance} onChange={(e) => setStatementBalance(e.target.value)} />
          </div>
          {isMatch ? (
            <div className="flex items-center gap-2.5 p-3.5 bg-[#eaf5f0] rounded-lg text-[#456558] text-[13px] font-medium">
              <CheckCircle2 size={18} /> <span>Statement matches your PennyDime ledger down to the penny.</span>
            </div>
          ) : (
            <div className="flex items-center gap-2.5 p-3.5 bg-[#fcedea] rounded-lg text-[#a33e07] text-[13px]">
              <AlertCircle size={18} /> <span>Difference detected: {currencySymbol}{diff.toFixed(2)}.</span>
            </div>
          )}
        </div>
        <div className="p-4 border-t border-[#eae6df] flex justify-end gap-3">
          <button type="button" className="px-4 py-2 rounded-lg text-[13px] font-semibold text-[#414845] hover:bg-[#f0ede9] transition-colors" onClick={onClose}>Cancel</button>
          <button type="button" className="px-5 py-2 rounded-lg text-[13px] font-semibold text-white bg-[#03241a] hover:bg-[#1b3a2f] transition-colors shadow-sm" onClick={onReconciled}>Verify & Reconcile</button>
        </div>
      </div>
    </div>
  );
}`,

    'src/components/dashboard/MilestoneCard.jsx': `import React from 'react';
import { formatCurrencyInteger } from '../../utils/formatters';
export default function MilestoneCard({ currentBalance = 0, targetAmount = 0, currencySymbol = '₹' }) {
  const hasTarget = targetAmount > 0;
  const pct = hasTarget ? Math.min(100, (currentBalance / targetAmount) * 100) : 0;
  return (
    <div className="relative rounded-2xl overflow-hidden flex flex-col justify-end p-7 shadow-md min-h-[220px] border border-[#eae6df] bg-[#1b3a2f]">
      <img src="/compass.jpg" alt="Compass" className="absolute inset-0 w-full h-full object-cover brightness-75 contrast-125 transition-transform duration-500 hover:scale-105" onError={(e) => { e.currentTarget.src = 'https://lh3.googleusercontent.com/aida-public/AB6AXuC7Z3i3qt5kuODQZCcjUeryZhl8QgAWiYTgfSVZNyayGqwcClADrAp-P9KBwwzFe_JPG1SuyzGcA45Q7wfktbnX8-XKPxpCsC8NBQBv0PJikKko4HBt0LFUL0T6cZZ09gRMjJjAD-hNwK6y-z-uGtWzjWMHQvqj4nG9GlcfFZc669ohDThPeEl-OZxwdXIWnIVeS4lIKXIYQyrdALa6X8pE3eBahwmxGkHmBtAR3rQhXCu6fCgJkl8S3w'; }} />
      <div className="absolute inset-0 bg-gradient-to-t from-[#03241a]/90 to-transparent pointer-events-none" />
      <div className="relative z-10 text-white">
        <span className="text-[11px] font-semibold uppercase tracking-wider opacity-85 mb-1 block">Next Milestone</span>
        <h2 className="font-serif text-2xl font-bold leading-tight mb-3">{hasTarget ? 'Emergency Fund' : 'Set a Target'}</h2>
        <div className="w-full h-1.5 bg-white/30 rounded-full overflow-hidden mb-2">
          <div className="h-full bg-white rounded-full transition-all duration-300" style={{ width: \`\${pct}%\` }} />
        </div>
        <div className="flex justify-between text-[11px] font-medium opacity-90">
          <span>Target: {hasTarget ? formatCurrencyInteger(targetAmount, currencySymbol) : '—'}</span>
          <span>{pct.toFixed(0)}% Accumulated</span>
        </div>
      </div>
    </div>
  );
}`,

    'src/components/dashboard/StatMetricsRow.jsx': `import React from 'react';
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
          <div className="text-[12px] text-white/70">{totalCR > 0 ? \`\${savingsRate}% savings rate\` : 'No credits yet'}</div>
        </div>
      </div>
    </section>
  );
}`,

    'src/components/dashboard/AllowancePoolBanner.jsx': `import React from 'react';
import { Plane, SlidersHorizontal } from 'lucide-react';
import { formatCurrencyInteger } from '../../utils/formatters';
export default function AllowancePoolBanner({ allowancePool, currencySymbol, onOpenAdjustPool }) {
  const allocated = Number(allowancePool?.allocated) || 0;
  const spent = Number(allowancePool?.spent) || 0;
  const remaining = Math.max(0, allocated - spent);
  const percentage = allocated > 0 ? Math.min(100, Math.round((spent / allocated) * 100)) : 0;
  return (
    <section className="bg-white border border-[#eae6df] rounded-2xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5 mb-6">
      <div className="flex items-center gap-4 min-w-[260px]">
        <div className="w-11 h-11 rounded-xl bg-[#fcefe9] text-[#a33e07] flex items-center justify-center shrink-0"><Plane size={22} /></div>
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold tracking-wider uppercase text-[#727974]">Allowance Pool</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#fcedea] text-[#a33e07]">{percentage}% Used</span>
          </div>
          <div className="font-serif text-lg font-bold text-[#03241a]">{allowancePool?.name || 'No Allowance Pool'} — {formatCurrencyInteger(allocated, currencySymbol)}</div>
        </div>
      </div>
      <div className="flex-1 max-w-sm flex flex-col gap-1.5">
        <div className="flex justify-between text-[11px] text-[#727974]">
          <span>Spent: <strong className="text-[#1c1c19]">{formatCurrencyInteger(spent, currencySymbol)}</strong></span>
          <span>Remaining: <strong className="text-[#1c1c19]">{formatCurrencyInteger(remaining, currencySymbol)}</strong></span>
        </div>
        <div className="w-full h-2.5 bg-[#1b3a2f]/10 rounded-full overflow-hidden shadow-inner">
          <div className="h-full bg-[#e8703a] rounded-full transition-all duration-500" style={{ width: \`\${percentage}%\` }} />
        </div>
      </div>
      <button type="button" className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#f6f3ee] border border-[#eae6df] text-[12px] font-semibold text-[#1c1c19] hover:bg-[#f0ede9] transition-colors shrink-0" onClick={onOpenAdjustPool}>
        <SlidersHorizontal size={14} /> <span>Adjust Pool</span>
      </button>
    </section>
  );
}`,

    'src/components/budget/AllowancePoolSection.jsx': `import React from 'react';
import { Plane, Edit2, RefreshCw } from 'lucide-react';
import { formatCurrencyInteger } from '../../utils/formatters';
export default function AllowancePoolSection({ allowancePool, currencySymbol = '₹', onOpenAdjustPool, onReconcileCategory }) {
  const allocated = Number(allowancePool?.allocated) || 0;
  const spent = Number(allowancePool?.spent) || 0;
  const remaining = Math.max(0, allocated - spent);
  const poolPercentage = allocated > 0 ? ((spent / allocated) * 100).toFixed(1) : '0.0';
  return (
    <section className="flex flex-col gap-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="font-serif text-xl font-bold text-[#03241a] flex items-center gap-2">🏛️ Allowance & Budget Pools</div>
        <span className="text-[11px] font-bold tracking-wider text-[#727974] uppercase">{allocated > 0 ? '1 Active Pool' : 'No Pool Set'}</span>
      </div>
      <div className="bg-white border border-[#eae6df] rounded-2xl p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#fcedea] text-[#a33e07] flex items-center justify-center"><Plane size={24} /></div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2.5">
                <span className="font-serif text-xl font-bold text-[#03241a]">{allowancePool?.name || 'No Allowance Pool'}</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#fcedea] text-[#a33e07]">{poolPercentage}% USED</span>
              </div>
              <div className="text-[12px] text-[#727974]">Fixed monthly allowance pool • {allowancePool?.reconcileDate || 'Reconciles at end of cycle'}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" className="flex items-center gap-1.5 px-3.5 py-1.5 border border-[#eae6df] rounded-lg text-[12px] font-semibold text-[#1c1c19] hover:bg-[#f0ede9] transition-colors" onClick={onOpenAdjustPool}><Edit2 size={13} /> Edit Pool</button>
            <button type="button" className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#03241a] rounded-lg text-[12px] font-semibold text-white hover:bg-[#1b3a2f] transition-colors" onClick={() => onReconcileCategory(allowancePool?.name || 'Allowance Pool')}><RefreshCw size={13} /> Reconcile</button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
          <div className="bg-[#f6f3ee] p-4 rounded-xl flex flex-col gap-1">
            <span className="text-[11px] font-semibold uppercase text-[#727974]">Allocated</span>
            <span className="font-serif text-2xl font-bold text-[#03241a]">{formatCurrencyInteger(allocated, currencySymbol)}</span>
          </div>
          <div className="bg-[#fcedea] p-4 rounded-xl flex flex-col gap-1">
            <span className="text-[11px] font-semibold uppercase text-[#727974]">DR Spent</span>
            <span className="font-serif text-2xl font-bold text-[#a33e07]">{formatCurrencyInteger(spent, currencySymbol)}</span>
          </div>
          <div className="bg-[#f6f3ee] p-4 rounded-xl flex flex-col gap-1">
            <span className="text-[11px] font-semibold uppercase text-[#727974]">Remaining Balance</span>
            <span className="font-serif text-2xl font-bold text-[#03241a]">{formatCurrencyInteger(remaining, currencySymbol)}</span>
          </div>
        </div>
        <div>
          <div className="flex justify-between text-[11px] font-bold tracking-wider text-[#727974] mb-2">
            <span>POOL CONSUMPTION</span>
            <span className="text-[#e8703a]">{poolPercentage}% (Warning Threshold)</span>
          </div>
          <div className="w-full h-3 bg-[#1b3a2f]/10 rounded-full overflow-hidden shadow-inner">
            <div className="h-full bg-[#e8703a] rounded-full transition-all duration-300" style={{ width: \`\${Math.min(100, parseFloat(poolPercentage))}%\` }} />
          </div>
        </div>
      </div>
    </section>
  );
}`,

    'src/components/dashboard/DebitAllocationDonut.jsx': `import React from 'react';
import { PieChart } from 'lucide-react';
import { formatCurrencyInteger } from '../../utils/formatters';
const PALETTE = ['#e8703a', '#03241a', '#1b3a2f', '#456558', '#83a496', '#fd8048', '#727974'];
export default function DebitAllocationDonut({ transactions = [], totalDR = 0, currencySymbol = '₹' }) {
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
    return { name, amount, pctVal, pct: \`\${pctVal.toFixed(1)}%\`, color: PALETTE[index % PALETTE.length] };
  });
  const circumference = 2 * Math.PI * 68;
  let accumulatedOffset = 0;
  const svgSegments = categories.map((cat) => {
    const segmentLength = (cat.pctVal / 100) * circumference;
    const strokeDasharray = \`\${segmentLength} \${circumference}\`;
    const strokeDashoffset = -accumulatedOffset;
    accumulatedOffset += segmentLength;
    return { name: cat.name, color: cat.color, strokeDasharray, strokeDashoffset };
  });
  return (
    <div className="bg-white border border-[#eae6df] rounded-2xl shadow-sm flex flex-col p-6 min-h-[420px]">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="font-serif text-xl font-bold text-[#03241a] mb-1">Debit Allocation</h2>
          <div className="text-[13px] text-[#727974]">Breakdown of real DR entries by category</div>
        </div>
        <div className="bg-[#fcedea] text-[#e8703a] text-[11px] font-bold px-2.5 py-1 rounded-md tracking-wide">
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
          <div className="flex justify-center items-center relative my-4">
            <svg width="180" height="180" viewBox="0 0 180 180" className="-rotate-90">
              {svgSegments.map((seg) => (
                <circle key={seg.name} cx="90" cy="90" r="68" fill="none" stroke={seg.color} strokeWidth="20" strokeDasharray={seg.strokeDasharray} strokeDashoffset={seg.strokeDashoffset} strokeLinecap="round" className="transition-all duration-300 ease-in-out" />
              ))}
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center pointer-events-none">
              <span className="text-[11px] font-semibold text-[#727974] uppercase tracking-wide">Total DR</span>
              <span className="font-serif text-2xl font-bold text-[#a33e07] my-0.5">{formatCurrencyInteger(calculatedTotalDR, currencySymbol)}</span>
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
                    <span className="font-semibold text-[#1c1c19]">{formatCurrencyInteger(item.amount, currencySymbol)}</span>
                    <span className="text-[11px] text-[#727974]">({item.pct})</span>
                  </div>
                </div>
                <div className="w-full h-1.5 bg-[#f0ede9] rounded-full overflow-hidden">
                   <div className="h-full rounded-full transition-all duration-500" style={{ width: \`\${item.pctVal}%\`, backgroundColor: item.color }} />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}`,

    'src/components/dashboard/RecentEntriesList.jsx': `import React from 'react';
import { ChevronRight, Utensils, ShoppingBag, Plane, CreditCard, BookOpen, Plus, Receipt } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
export default function RecentEntriesList({ transactions = [], currencySymbol = '₹', onNavigateToTransactions, onOpenAddEntry }) {
  const recentEntries = transactions.slice(0, 4);
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Food & Dining': return <Utensils size={16} />;
      case 'Shopping': return <ShoppingBag size={16} />;
      case 'Travel': return <Plane size={16} />;
      case 'Direct Deposit': case 'Salary': case 'Consulting': case 'Investment': return <CreditCard size={16} />;
      default: return <BookOpen size={16} />;
    }
  };
  return (
    <div className="bg-white border border-[#eae6df] rounded-2xl shadow-sm flex flex-col p-6 min-h-[420px]">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="font-serif text-xl font-bold text-[#03241a] mb-1">Recent Entries</h2>
          <div className="text-[13px] text-[#727974]">Audited ledger transactions with CR/DR and balance.</div>
        </div>
        {recentEntries.length > 0 && (
          <button type="button" className="flex items-center gap-1.5 text-[12px] font-semibold text-[#03241a] px-2 py-1 rounded-md hover:bg-[#f6f3ee] hover:underline transition-all" onClick={onNavigateToTransactions}>
            <span>View All</span> <ChevronRight size={14} />
          </button>
        )}
      </div>
      {recentEntries.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[#fcf9f4] rounded-xl border border-dashed border-[#e0ded8] text-center">
          <div className="w-12 h-12 rounded-full bg-[#f0ede9] flex items-center justify-center mb-4">
            <Receipt size={24} className="text-[#727974]" />
          </div>
          <p className="font-semibold text-[#1c1c19] mb-1 text-[15px]">No Transactions Recorded</p>
          <p className="text-[#727974] text-[13px] max-w-[280px] leading-relaxed mb-5">Your ledger is pristine. Add your initial income (CR) or expense (DR) to begin balancing your books.</p>
          {onOpenAddEntry && (
            <button type="button" className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full text-[13px] font-semibold text-white bg-[#03241a] hover:bg-[#1b3a2f] transition-colors shadow-md" onClick={onOpenAddEntry}>
              <Plus size={16} /> <span>Record First Entry</span>
            </button>
          )}
        </div>
      ) : (
        <div className="flex flex-col mt-2">
          {recentEntries.map((tx) => {
            const isCR = tx.type === 'CR';
            return (
              <div key={tx.id} className="flex items-center justify-between py-4 border-b border-[#eae6df] last:border-0 hover:bg-[#f7fbf9] transition-colors rounded-lg px-2 -mx-2">
                <div className="flex items-center gap-3.5">
                  <div className={\`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 \${isCR ? 'bg-[#eaf5f0] text-[#456558]' : 'bg-[#fcedea] text-[#e8703a]'}\`}>{getCategoryIcon(tx.category)}</div>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] font-semibold text-[#1c1c19]">{tx.title}</span>
                      <span className={\`text-[10px] font-bold px-1.5 py-0.5 rounded \${isCR ? 'bg-[#eaf5f0] text-[#456558]' : 'bg-[#fcedea] text-[#e8703a]'}\`}>{tx.type}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[12px] text-[#727974]">
                      <span>{tx.displayDate || tx.date}</span> <span>•</span>
                      <span className="bg-[#f0ede9] text-[#414845] px-1.5 py-0.5 rounded font-medium text-[11px]">{tx.category}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right flex flex-col gap-0.5">
                  <div className={\`font-serif text-[17px] font-bold \${isCR ? 'text-[#03241a]' : 'text-[#a33e07]'}\`}>{isCR ? '+' : '−'}{formatCurrency(tx.amount, currencySymbol)}</div>
                  <div className="text-[11px] text-[#727974]">Bal: {formatCurrency(tx.runningBal || 0, currencySymbol)}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}`,

    'src/components/common/AddEntryModal.jsx': `import React, { useState, useEffect } from 'react';
export default function AddEntryModal({ isOpen, onClose, onAddEntry, currencySymbol = '₹', allowancePool }) {
  const getTodayISO = () => { const today = new Date(); return today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0'); };
  const [currentMode, setCurrentMode] = useState('DR');
  const [amount, setAmount] = useState('');
  const [merchant, setMerchant] = useState('');
  const [dateStr, setDateStr] = useState(getTodayISO());
  const [allowanceOption, setAllowanceOption] = useState('none');
  const [category, setCategory] = useState('Food & Dining');
  const [notes, setNotes] = useState('');
  const [showError, setShowError] = useState(false);
  const drCategories = ['Food & Dining', 'Travel', 'Bills & Utilities', 'Shopping', 'Housing', 'Entertainment', 'Others'];
  const crCategories = ['Salary', 'Consulting', 'Investment', 'Dividend', 'Gift', 'Refund', 'Other Income'];
  useEffect(() => { if (isOpen) { setShowError(false); setDateStr(getTodayISO()); } }, [isOpen]);
  if (!isOpen) return null;
  const handleModeChange = (mode) => {
    setCurrentMode(mode);
    if (mode === 'CR') { setCategory('Salary'); setAllowanceOption('none'); } 
    else { setCategory('Food & Dining'); }
  };
  const handleAdjustAmount = (delta) => { const val = parseFloat(amount) || 0; setAmount((val + delta).toFixed(2).replace(/\\.00$/, '')); setShowError(false); };
  const handleSubmit = (e) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!parsedAmount || isNaN(parsedAmount) || parsedAmount <= 0) { setShowError(true); return; }
    setShowError(false);
    const isDR = currentMode === 'DR';
    const displayDate = new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const entryData = {
      id: 'tx-' + Date.now(), title: merchant.trim() || (isDR ? category + ' Expense' : category + ' Inflow'), type: currentMode, amount: parsedAmount, category, date: dateStr, displayDate, note: notes.trim() || (isDR ? category : 'Direct Transfer'), method: isDR ? (allowanceOption !== 'none' ? 'Allowance Pool' : 'Standard Payment') : 'Direct Deposit', isReconciled: true, allowancePool: isDR ? allowanceOption : null
    };
    onAddEntry(entryData);
    setAmount(''); setMerchant(''); setNotes(''); onClose();
  };
  const activeCategories = currentMode === 'DR' ? drCategories : crCategories;
  const poolRemaining = Math.max(0, (allowancePool?.allocated || 0) - (allowancePool?.spent || 0));
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-[#03241a]/45 backdrop-blur-sm animate-in fade-in overflow-y-auto" onClick={onClose} role="dialog" aria-modal="true">
      <div className="relative bg-white border border-[#c1c8c3]/70 rounded-[28px] shadow-2xl w-full max-w-[520px] p-7 z-[1000] max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between pb-4 border-b border-[#c1c8c3]/40">
          <div>
            <span className="text-[11px] font-bold tracking-wider text-[#414845] uppercase block">Real Ledger Entry</span>
            <h3 className="font-serif text-[26px] font-bold text-[#03241a] mt-1 leading-tight">Record Transaction</h3>
            <p className="text-[12px] text-[#414845] mt-1">Add a real double-entry Credit (Money In) or Debit (Money Out) record.</p>
          </div>
          <button type="button" className="p-1.5 rounded-full text-[#414845] hover:bg-[#f0ede9] transition-colors" onClick={onClose} aria-label="Close dialog">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
          <div className="grid grid-cols-2 gap-2 bg-[#f0ede9] p-1.5 rounded-2xl border border-[#c1c8c3]/40">
            <button type="button" className={\`py-2.5 rounded-xl text-[12px] font-bold flex items-center justify-center gap-1.5 transition-all \${currentMode === 'CR' ? 'bg-[#03241a] text-white shadow-md' : 'text-[#414845] hover:text-[#1c1c19]'}\`} onClick={() => handleModeChange('CR')}><span>↓</span><span>CR (Credit / Income)</span></button>
            <button type="button" className={\`py-2.5 rounded-xl text-[12px] font-bold flex items-center justify-center gap-1.5 transition-all \${currentMode === 'DR' ? 'bg-[#a33e07] text-white shadow-md' : 'text-[#414845] hover:text-[#1c1c19]'}\`} onClick={() => handleModeChange('DR')}><span>↑</span><span>DR (Debit / Expense)</span></button>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-bold tracking-wider text-[#414845] uppercase">Amount</label>
              {showError && <span className="text-[11px] text-[#ba1a1a] font-semibold">Please enter a valid amount</span>}
            </div>
            <div className={\`flex items-center border-b-2 pb-1 transition-colors \${currentMode === 'DR' ? 'border-[#a33e07]' : 'border-[#03241a]'}\`}>
              <span className={\`font-serif text-[32px] font-bold mr-2 \${currentMode === 'DR' ? 'text-[#a33e07]' : 'text-[#03241a]'}\`}>{currencySymbol}</span>
              <input type="number" step="any" min="0.01" required autoFocus className="w-full bg-transparent border-none outline-none font-serif text-[32px] font-bold text-[#1c1c19] tracking-tight placeholder-[#c1c8c3]" placeholder="0.00" value={amount} onChange={(e) => { setAmount(e.target.value); setShowError(false); }} />
            </div>
            <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
              <span className="text-[11px] font-semibold text-[#414845] mr-0.5">Quick Add:</span>
              <button type="button" className="px-2.5 py-1 rounded-lg border border-[#c1c8c3]/70 text-[11px] font-semibold hover:bg-[#f0ede9]" onClick={() => handleAdjustAmount(500)}>+{currencySymbol}500</button>
              <button type="button" className="px-2.5 py-1 rounded-lg border border-[#c1c8c3]/70 text-[11px] font-semibold hover:bg-[#f0ede9]" onClick={() => handleAdjustAmount(1000)}>+{currencySymbol}1,000</button>
              <button type="button" className="px-2.5 py-1 rounded-lg border border-[#c1c8c3]/70 text-[11px] font-semibold hover:bg-[#f0ede9]" onClick={() => handleAdjustAmount(2500)}>+{currencySymbol}2,500</button>
              <button type="button" className="px-2.5 py-1 rounded-lg border border-[#c1c8c3]/70 text-[11px] font-semibold hover:bg-[#f0ede9]" onClick={() => handleAdjustAmount(5000)}>+{currencySymbol}5,000</button>
              <button type="button" className="ml-auto text-[11px] text-[#414845] px-1.5 py-1 hover:text-[#ba1a1a]" onClick={() => setAmount('')}>Clear</button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold tracking-wider text-[#414845] uppercase">Date</label>
              <div className="flex items-center gap-2 bg-[#f6f3ee] border border-[#c1c8c3]/60 rounded-xl px-3 py-2">
                <input type="date" className="w-full bg-transparent border-none outline-none text-[12px] font-medium text-[#1c1c19] cursor-pointer" value={dateStr} onChange={(e) => setDateStr(e.target.value)} />
              </div>
            </div>
            <div className={\`flex flex-col gap-1.5 \${currentMode === 'CR' ? 'opacity-45 pointer-events-none' : ''}\`}>
              <label className="text-[11px] font-bold tracking-wider text-[#414845] uppercase">Allowance Pool</label>
              <div className="relative flex items-center">
                <select className="w-full bg-[#f6f3ee] border border-[#c1c8c3]/60 rounded-xl py-2 pl-3 pr-8 text-[12px] font-semibold text-[#1c1c19] appearance-none cursor-pointer outline-none" value={allowanceOption} disabled={currentMode === 'CR'} onChange={(e) => setAllowanceOption(e.target.value)}>
                  <option value="none">General / No Pool</option>
                  <option value="travel">{allowancePool?.name || 'Allowance Pool'} ({currencySymbol}{poolRemaining.toLocaleString('en-IN')} remaining)</option>
                </select>
                <span className="absolute right-2.5 pointer-events-none text-[#414845]">▼</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold tracking-wider text-[#414845] uppercase">{currentMode === 'DR' ? 'Merchant / Payee' : 'Payer / Source'}</label>
            <div className="flex items-center gap-2 bg-[#f6f3ee] border border-[#c1c8c3]/60 rounded-xl px-3 py-2">
              <input type="text" required className="w-full bg-transparent border-none outline-none text-[12px] font-semibold text-[#1c1c19] placeholder-[#727974]" placeholder={currentMode === 'DR' ? 'e.g. Organic Market, Metro Ride, Rent' : 'e.g. Salary, Client Milestone'} value={merchant} onChange={(e) => setMerchant(e.target.value)} />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold tracking-wider text-[#414845] uppercase">Category</label>
            <div className="flex flex-wrap gap-1.5">
              {activeCategories.map((cat) => {
                const isSelected = category === cat;
                const selectedClass = isSelected ? (currentMode === 'DR' ? 'bg-[#a33e07] text-white shadow-sm' : 'bg-[#03241a] text-white shadow-sm') : 'bg-[#f0ede9] text-[#414845] hover:bg-[#e5e2dd]';
                return (
                  <button key={cat} type="button" className={\`px-3 py-1.5 rounded-full text-[11px] font-medium transition-colors \${selectedClass}\`} onClick={() => setCategory(cat)}><span>{cat}</span></button>
                );
              })}
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold tracking-wider text-[#414845] uppercase">Note (Optional)</label>
            <input type="text" className="w-full bg-transparent border-b border-[#c1c8c3]/60 outline-none text-[12px] font-medium text-[#1c1c19] py-1.5 focus:border-[#03241a] transition-colors placeholder-[#727974]" placeholder="e.g. Reconciled via UPI / Invoice reference" value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
          <div className="flex items-center justify-end gap-3 mt-2 pt-4 border-t border-[#c1c8c3]/40">
            <button type="button" className="px-4 py-2 rounded-xl text-[12px] font-bold text-[#414845] hover:bg-[#f0ede9] transition-colors" onClick={onClose}>Cancel</button>
            <button type="submit" className={\`flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-[12px] font-bold text-white shadow-md transition-all hover:-translate-y-0.5 \${currentMode === 'DR' ? 'bg-[#a33e07] hover:brightness-110' : 'bg-[#03241a] hover:bg-[#1b3a2f]'}\`}><span>Record {currentMode === 'DR' ? 'Debit' : 'Credit'} Entry</span></button>
          </div>
        </form>
      </div>
    </div>
  );
}`,

    'src/pages/dashboard/DashboardPage.jsx': `import React from 'react';
import TotalBalanceHero from '../../components/dashboard/TotalBalanceHero';
import MilestoneCard from '../../components/dashboard/MilestoneCard';
import StatMetricsRow from '../../components/dashboard/StatMetricsRow';
import AllowancePoolBanner from '../../components/dashboard/AllowancePoolBanner';
import DebitAllocationDonut from '../../components/dashboard/DebitAllocationDonut';
import RecentEntriesList from '../../components/dashboard/RecentEntriesList';
export default function DashboardPage({ startingBalance, transactions, allowancePool, currencySymbol = '₹', onOpenSetStarting, onOpenReconcile, onOpenAdjustPool, onNavigateToTransactions, onOpenAddEntry, milestoneTarget = 0 }) {
  const crTransactions = transactions.filter((t) => t.type === 'CR');
  const drTransactions = transactions.filter((t) => t.type === 'DR');
  const totalCR = crTransactions.reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0);
  const totalDR = drTransactions.reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0);
  const currentBalance = startingBalance + totalCR - totalDR;
  return (
    <div className="flex flex-col gap-6">
      <section className="grid grid-cols-1 lg:grid-cols-[1.65fr_1fr] gap-6">
        <TotalBalanceHero startingBalance={startingBalance} totalCR={totalCR} totalDR={totalDR} currentBalance={currentBalance} currencySymbol={currencySymbol} onOpenSetStarting={onOpenSetStarting} onOpenReconcile={onOpenReconcile} />
        <MilestoneCard currentBalance={currentBalance} targetAmount={milestoneTarget} currencySymbol={currencySymbol} />
      </section>
      <StatMetricsRow totalCR={totalCR} totalDR={totalDR} crCount={crTransactions.length} drCount={drTransactions.length} currencySymbol={currencySymbol} />
      <AllowancePoolBanner allowancePool={allowancePool} currencySymbol={currencySymbol} onOpenAdjustPool={onOpenAdjustPool} />
      <section className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-6 items-stretch">
        <DebitAllocationDonut transactions={transactions} totalDR={totalDR} currencySymbol={currencySymbol} />
        <RecentEntriesList transactions={transactions} currencySymbol={currencySymbol} onNavigateToTransactions={onNavigateToTransactions} onOpenAddEntry={onOpenAddEntry} />
      </section>
    </div>
  );
}`,

    'src/pages/reports/ReportsPage.jsx': `import React, { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import ReportStatsCards from '../../components/reports/ReportStatsCards';
import MonthlyTrendChart from '../../components/reports/MonthlyTrendChart';
import CategoryBreakdownCard from '../../components/reports/CategoryBreakdownCard';
import ComparisonCard from '../../components/reports/ComparisonCard';
import { deriveLedger, deriveCategories, deriveMonthlyBreakdown } from '../../utils/calculations';
export default function ReportsPage({ transactions = [], currencySymbol = '₹', onOpenAddEntry }) {
  const [reportPeriod, setReportPeriod] = useState('MONTHLY');
  const derived = useMemo(() => deriveLedger({ transactions, startingBalance: 0 }), [transactions]);
  const categories = useMemo(() => deriveCategories(transactions), [transactions]);
  const monthly = useMemo(() => deriveMonthlyBreakdown(transactions), [transactions]);
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <div>
          <h1 className="font-serif text-[36px] font-bold text-[#03241a] leading-tight mb-2">Financial Flow</h1>
          <p className="text-[15px] text-[#414845]">Income and expenditure analytics from your real ledger entries</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center bg-[#e5e2dd] p-1 rounded-full">
            <button type="button" className={\`px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-colors \${reportPeriod === 'MONTHLY' ? 'bg-[#03241a] text-white shadow-md' : 'text-[#414845] hover:text-[#1c1c19]'}\`} onClick={() => setReportPeriod('MONTHLY')}>MONTHLY</button>
            <button type="button" className={\`px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-colors \${reportPeriod === 'YEARLY' ? 'bg-[#03241a] text-white shadow-md' : 'text-[#414845] hover:text-[#1c1c19]'}\`} onClick={() => setReportPeriod('YEARLY')}>YEARLY</button>
          </div>
          <button type="button" className="flex items-center gap-2 bg-[#03241a] text-white px-4.5 py-2.5 rounded-full text-[13px] font-semibold shadow-lg hover:bg-[#1b3a2f] transition-all" onClick={onOpenAddEntry}><Plus size={16} /> <span>Add Entry</span></button>
        </div>
      </div>
      <ReportStatsCards totalCR={derived.totalCR} totalDR={derived.totalDR} netFlow={derived.netFlow} currencySymbol={currencySymbol} />
      <section className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-6">
        <MonthlyTrendChart transactions={transactions} currencySymbol={currencySymbol} />
        <CategoryBreakdownCard categories={categories} totalDR={derived.totalDR} currencySymbol={currencySymbol} />
      </section>
      <ComparisonCard monthly={monthly} currencySymbol={currencySymbol} />
    </div>
  );
}`,

    'src/components/reports/ReportStatsCards.jsx': `import React from 'react';
import { ArrowDownLeft, ArrowUpRight, PiggyBank } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
export default function ReportStatsCards({ totalCR, totalDR, netFlow, currencySymbol = '₹' }) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
      <div className="bg-white border border-[#eae6df] rounded-2xl p-6 shadow-sm flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-[#eaf5f0] text-[#456558] flex items-center justify-center shrink-0"><ArrowDownLeft size={20} /></div>
        <div>
          <div className="text-[12px] font-medium text-[#414845] mb-1">TOTAL INFLOW (CR)</div>
          <div className="font-serif text-2xl font-bold text-[#03241a]">+{formatCurrency(totalCR, currencySymbol)}</div>
        </div>
      </div>
      <div className="bg-white border border-[#eae6df] rounded-2xl p-6 shadow-sm flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-[#fcedea] text-[#e8703a] flex items-center justify-center shrink-0"><ArrowUpRight size={20} /></div>
        <div>
          <div className="text-[12px] font-medium text-[#414845] mb-1">TOTAL OUTFLOW (DR)</div>
          <div className="font-serif text-2xl font-bold text-[#a33e07]">-{formatCurrency(totalDR, currencySymbol)}</div>
        </div>
      </div>
      <div className="bg-white border border-[#eae6df] rounded-2xl p-6 shadow-sm flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-[#eef3f0] text-[#456558] flex items-center justify-center shrink-0"><PiggyBank size={20} /></div>
        <div>
          <div className="text-[12px] font-medium text-[#414845] mb-1">NET SAVINGS</div>
          <div className="font-serif text-2xl font-bold text-[#03241a]">{netFlow >= 0 ? '+' : '-'}{formatCurrency(Math.abs(netFlow), currencySymbol)}</div>
        </div>
      </div>
    </section>
  );
}`,

    'src/components/reports/CategoryBreakdownCard.jsx': `import React from 'react';
import { formatCurrencyInteger } from '../../utils/formatters';
export default function CategoryBreakdownCard({ categories = [], totalDR = 0, currencySymbol = '₹' }) {
  if (categories.length === 0) return <div className="bg-white border border-[#eae6df] rounded-2xl p-6 shadow-sm min-h-[300px] flex flex-col"><span className="text-[11px] font-bold tracking-wider text-[#727974] uppercase">OUTFLOW BREAKDOWN (DR ONLY)</span><p className="text-[#727974] text-[14px] mt-4">No debit entries yet. Record an expense to see category breakdown.</p></div>;
  const circ = 2 * Math.PI * 62;
  let offset = 0;
  const segs = categories.map((c) => { const len = (c.pctVal / 100) * circ; const seg = { ...c, dash: \`\${len} \${circ}\`, offset: -offset }; offset += len; return seg; });
  return (
    <div className="bg-white border border-[#eae6df] rounded-2xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <span className="text-[11px] font-bold tracking-wider text-[#727974] uppercase">OUTFLOW BREAKDOWN (DR ONLY)</span>
        <span className="bg-[#fcedea] text-[#e8703a] text-[10px] font-bold px-2 py-0.5 rounded-full">{categories.length} Categories</span>
      </div>
      <div className="flex justify-center items-center relative my-4">
        <svg width="170" height="170" viewBox="0 0 170 170" className="-rotate-90">
          {segs.map((s) => <circle key={s.name} cx="85" cy="85" r="62" fill="none" stroke={s.color} strokeWidth="18" strokeDasharray={s.dash} strokeDashoffset={s.offset} strokeLinecap="round" />)}
        </svg>
        <div className="absolute flex flex-col items-center justify-center text-center pointer-events-none">
          <span className="text-[11px] font-semibold text-[#727974] uppercase tracking-wide">TOTAL DR</span>
          <span className="font-serif text-2xl font-bold text-[#a33e07]">{formatCurrencyInteger(totalDR, currencySymbol)}</span>
          <span className="text-[10px] text-[#727974]">100% debits</span>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        {categories.map((item) => (
          <div key={item.name} className="flex items-center justify-between text-[13px]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
              <span className="font-medium text-[#1c1c19]">{item.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[#1c1c19]">{formatCurrencyInteger(item.amount, currencySymbol)}</span>
              <span className="text-[11px] text-[#727974]">({item.pctVal.toFixed(1)}%)</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}`,

    'src/components/reports/ComparisonCard.jsx': `import React from 'react';
import { formatCurrencyInteger } from '../../utils/formatters';
export default function ComparisonCard({ monthly = {}, currencySymbol = '₹' }) {
  const keys = Object.keys(monthly).sort((a, b) => new Date('1 ' + b) - new Date('1 ' + a));
  const thisKey = keys[0]; const lastKey = keys[1];
  const thisM = thisKey ? monthly[thisKey] : { CR: 0, DR: 0 };
  const lastM = lastKey ? monthly[lastKey] : { CR: 0, DR: 0 };
  const thisNet = (thisM.CR || 0) - (thisM.DR || 0);
  const lastNet = (lastM.CR || 0) - (lastM.DR || 0);
  const renderCol = (label, m, net) => (
    <div className="flex flex-col gap-3.5">
      <span className="text-[11px] font-bold tracking-wider text-[#727974] uppercase">{label}</span>
      <div>
        <div className="font-serif text-[36px] font-bold text-[#03241a] leading-none">{formatCurrencyInteger(m.DR || 0, currencySymbol)} <span className="text-[12px] font-sans text-[#a33e07] font-bold ml-1.5">DR OUTFLOW</span></div>
      </div>
      <div className="flex flex-col gap-2.5 border-t border-[#eae6df] pt-3.5 text-[13px]">
        <div className="flex items-center justify-between"><span>Inflow (CR)</span><span className="font-semibold text-[#03241a]">+{formatCurrencyInteger(m.CR || 0, currencySymbol)}</span></div>
        <div className="flex items-center justify-between"><span>Outflow (DR)</span><span className="font-semibold text-[#a33e07]">−{formatCurrencyInteger(m.DR || 0, currencySymbol)}</span></div>
        <div className="flex items-center justify-between pt-1.5"><span>Net Savings</span><span className="font-serif text-[15px] font-bold text-[#03241a]">{net >= 0 ? '+' : '-'}{formatCurrencyInteger(Math.abs(net), currencySymbol)}</span></div>
      </div>
    </div>
  );
  return (
    <section className="bg-white border border-[#eae6df] rounded-2xl p-7 shadow-sm mt-2">
      <div className="flex items-center gap-2 mb-6">
        <span className="w-3.5 h-0.5 bg-[#727974]" />
        <h2 className="font-serif text-xl font-bold text-[#03241a]">Comparison View: Monthly Inflow vs Outflow</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {thisKey ? renderCol(\`THIS MONTH (\${thisKey.toUpperCase()})\`, thisM, thisNet) : <div className="flex flex-col gap-3.5"><span className="text-[11px] font-bold tracking-wider text-[#727974] uppercase">NO DATA YET</span><p className="text-[#727974] text-[13px]">Record entries to see monthly comparisons.</p></div>}
        {lastKey ? renderCol(\`LAST MONTH (\${lastKey.toUpperCase()})\`, lastM, lastNet) : <div className="flex flex-col gap-3.5"><span className="text-[11px] font-bold tracking-wider text-[#727974] uppercase">NO PRIOR MONTH</span><p className="text-[#727974] text-[13px]">Comparison will appear once you have entries in two different months.</p></div>}
      </div>
    </section>
  );
}`,

    'src/components/reports/MonthlyTrendChart.jsx': `import React, { useState } from 'react';
import { formatCurrencyInteger } from '../../utils/formatters';
export default function MonthlyTrendChart({ transactions = [], currencySymbol = '₹' }) {
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const drs = transactions.filter((t) => t.type === 'DR');
  const weeks = [0, 0, 0, 0];
  drs.forEach((t) => { const d = new Date(t.date); if (isNaN(d)) return; const weekIdx = Math.min(3, Math.floor((d.getDate() - 1) / 7)); weeks[weekIdx] += parseFloat(t.amount) || 0; });
  const cumulativeWeeks = []; weeks.reduce((acc, w) => { const n = acc + w; cumulativeWeeks.push(n); return n; }, 0);
  const max = Math.max(...cumulativeWeeks, 1);
  const points = cumulativeWeeks.map((amount, i) => ({ week: \`W\${i + 1}\`, amount, x: 50 + i * 120, y: 160 - (amount / max) * 120 }));
  const pathD = points.length > 0 ? \`M \${points[0].x} \${points[0].y} \` + points.slice(1).map((p) => \`L \${p.x} \${p.y}\`).join(' ') : '';
  const areaD = pathD && points.length > 0 ? \`\${pathD} L \${points[points.length - 1].x} 160 L \${points[0].x} 160 Z\` : '';
  const totalDR = cumulativeWeeks[cumulativeWeeks.length - 1] || 0;
  const dailyAvg = Math.round(totalDR / 30);
  const hasData = drs.length > 0;
  return (
    <div className="bg-white border border-[#eae6df] rounded-2xl p-6 shadow-sm">
      <div className="flex justify-between items-start mb-6">
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-bold tracking-wider text-[#727974] uppercase">DR OUTFLOW TREND</span>
          <div className="font-serif text-[32px] font-bold text-[#03241a]">{formatCurrencyInteger(totalDR, currencySymbol)} <span className="text-[14px] font-sans text-[#727974] font-normal">/ current cycle</span></div>
        </div>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#ebe8e3] rounded-full text-[11px] font-semibold text-[#1c1c19]"><span className="w-1.5 h-1.5 rounded-full bg-[#03241a]" /><span>Daily Avg {formatCurrencyInteger(dailyAvg, currencySymbol)}</span></span>
      </div>
      <div className="relative w-full h-[220px]">
        {!hasData ? (
          <p className="text-[#727974] text-center pt-20">No outflow data to chart yet.</p>
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
              <div className="absolute bg-[#03241a] text-white px-2 py-1 rounded-md text-[11px] font-semibold pointer-events-none z-10 -translate-x-1/2 -translate-y-full" style={{ left: \`\${(points[hoveredPoint].x / 460) * 100}%\`, top: \`\${(points[hoveredPoint].y / 190) * 100 - 10}%\` }}>
                {points[hoveredPoint].week}: {formatCurrencyInteger(points[hoveredPoint].amount, currencySymbol)}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}`,

    'src/components/budget/UpcomingAdjustmentsCard.jsx': `import React from 'react';
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
                  <button type="button" className={\`w-9 h-9 rounded-full border-[1.5px] flex items-center justify-center transition-colors \${adj.accepted ? 'bg-[#456558] border-[#456558] text-white' : 'border-[#eae6df] text-[#727974] hover:bg-[#eaf5f0] hover:border-[#456558] hover:text-[#456558]'}\`} onClick={() => onAcceptAdjustment(adj.id)} title={adj.accepted ? 'Accepted' : 'Accept adjustment'}><Check size={16} strokeWidth={adj.accepted ? 3 : 2} /></button>
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
            {totalAllocated === 0 ? 'Set budget allocations to track your health.' : \`You are currently \${underOver.toFixed(0)}% \${isUnder ? 'under' : 'over'} your total allocations.\`}
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
}`,

    'src/pages/auth/AuthPage.jsx': `import React, { useState, useEffect, useRef } from 'react';
import { Shield, Building2, PieChart, Lock, Mail, KeyRound, User, ArrowRight, Eye, EyeOff, Sparkles, AlertCircle } from 'lucide-react';
import PennyDimeLogo from '../../layouts/PennyDimeLogo';
export default function AuthPage({ onLoginSuccess }) {
  const [authMethod, setAuthMethod] = useState('email');
  const [emailMode, setEmailMode] = useState('login');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(30);
  const [showOtpBanner, setShowOtpBanner] = useState(false);
  const otpInputRefs = useRef([]);
  useEffect(() => {
    let interval = null;
    if (isOtpStep && resendTimer > 0) { interval = setInterval(() => { setResendTimer((prev) => prev - 1); }, 1000); }
    return () => clearInterval(interval);
  }, [isOtpStep, resendTimer]);
  const startOtpFlow = (targetEmail) => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code); setIsOtpStep(true); setOtpDigits(['', '', '', '', '', '']); setShowOtpBanner(true); setResendTimer(30); setErrorMessage('');
    setTimeout(() => { if (otpInputRefs.current[0]) otpInputRefs.current[0].focus(); }, 150);
  };
  const handleAutoFillOtp = () => { if (!generatedOtp) return; const digits = generatedOtp.split(''); setOtpDigits(digits); verifyOtpCode(generatedOtp); };
  const handleOtpDigitChange = (index, value) => {
    if (!/^\\d*$/.test(value)) return;
    const newDigits = [...otpDigits]; newDigits[index] = value.slice(-1); setOtpDigits(newDigits);
    if (value && index < 5) otpInputRefs.current[index + 1]?.focus();
    const fullCode = newDigits.join('');
    if (fullCode.length === 6 && !newDigits.includes('')) verifyOtpCode(fullCode);
  };
  const handleOtpKeyDown = (index, e) => { if (e.key === 'Backspace' && !otpDigits[index] && index > 0) otpInputRefs.current[index - 1]?.focus(); };
  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (/^\\d{6}$/.test(pastedData)) { const digits = pastedData.split(''); setOtpDigits(digits); verifyOtpCode(pastedData); }
  };
  const verifyOtpCode = (enteredCode) => {
    if (enteredCode === generatedOtp) {
      const userName = fullName.trim() || email.split('@')[0] || 'Ledger User';
      onLoginSuccess({ name: userName.charAt(0).toUpperCase() + userName.slice(1), email: email.trim().toLowerCase(), avatar: \`https://api.dicebear.com/7.x/initials/svg?seed=\${encodeURIComponent(userName)}&backgroundColor=03241a&textColor=ffffff\`, provider: 'email-otp', tier: 'Sovereign Ledger Member' });
    } else { setErrorMessage('Invalid OTP code. Please enter the 6-digit code shown or click Auto-Fill.'); }
  };
  const handlePasswordAuthSubmit = (e) => {
    e.preventDefault(); setErrorMessage('');
    if (!email || !email.includes('@')) { setErrorMessage('Please provide a valid email address.'); return; }
    if (!password || password.length < 4) { setErrorMessage('Password must be at least 4 characters long.'); return; }
    if (emailMode === 'signup') { startOtpFlow(email); return; }
    const userName = fullName.trim() || email.split('@')[0];
    onLoginSuccess({ name: userName.charAt(0).toUpperCase() + userName.slice(1), email: email.trim().toLowerCase(), avatar: \`https://api.dicebear.com/7.x/initials/svg?seed=\${encodeURIComponent(userName)}&backgroundColor=03241a&textColor=ffffff\`, provider: 'email-password', tier: 'Sovereign Ledger Member' });
  };
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-[#fcf9f4] p-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_0%,rgba(3,36,26,0.03)_100%)] pointer-events-none" />
      <div className="w-full max-w-[440px] bg-white rounded-3xl shadow-xl overflow-hidden border border-[#eae6df] relative z-10">
        <div className="h-1.5 w-full bg-gradient-to-r from-[#03241a] via-[#1b3a2f] to-[#fd8048]" />
        <div className="p-8">
          <div className="flex justify-center mb-6"><PennyDimeLogo size={34} /></div>
          <div className="text-center mb-8">
            <span className="text-[10px] font-bold tracking-widest text-[#727974] uppercase block mb-2">THE MINDFUL LEDGER</span>
            <h1 className="font-serif text-[28px] font-bold text-[#03241a] leading-tight mb-2">Track every rupee, effortlessly</h1>
            <p className="text-[13px] text-[#414845] leading-relaxed max-w-[320px] mx-auto">A mindful, double-entry financial ledger designed for clarity, calm stewardship, and precision.</p>
          </div>
          {showOtpBanner && isOtpStep && (
            <div className="mb-4 p-3.5 rounded-xl bg-[#f6f3ee] border border-[#eae6df] flex items-center justify-between gap-3 shadow-sm">
              <div className="flex items-center gap-2.5">
                <Sparkles size={16} className="text-[#e8703a]" />
                <div className="text-[12px] text-[#414845]">
                  <span>Code for <strong>{email}</strong>:</span><br/>
                  <strong className="font-mono text-[14px] text-[#03241a] tracking-wider">{generatedOtp}</strong>
                </div>
              </div>
              <button type="button" className="px-3 py-1.5 bg-[#03241a] text-white text-[11px] font-bold rounded-lg hover:bg-[#1b3a2f] transition-colors shrink-0" onClick={handleAutoFillOtp}>Auto-Fill</button>
            </div>
          )}
          {errorMessage && (
            <div className="mb-4 p-3.5 rounded-xl bg-[#fcedea] text-[#ba1a1a] text-[12px] font-medium flex items-center gap-2"><AlertCircle size={15} /><span>{errorMessage}</span></div>
          )}
          {isOtpStep ? (
            <div className="flex flex-col gap-5">
              <div className="text-center">
                <span className="text-[11px] font-bold tracking-widest text-[#727974] uppercase block mb-1">VERIFY EMAIL OTP</span>
                <p className="text-[13px] text-[#414845]">Enter the 6-digit code sent to <strong>{email}</strong></p>
              </div>
              <div className="flex justify-between gap-2" onPaste={handleOtpPaste}>
                {otpDigits.map((digit, idx) => (
                  <input key={idx} ref={(el) => (otpInputRefs.current[idx] = el)} type="text" inputMode="numeric" maxLength={1} className="w-12 h-12 text-center text-xl font-bold border-2 border-[#eae6df] rounded-xl bg-[#fcf9f4] text-[#03241a] focus:outline-none focus:border-[#03241a] transition-colors" value={digit} onChange={(e) => handleOtpDigitChange(idx, e.target.value)} onKeyDown={(e) => handleOtpKeyDown(idx, e)} />
                ))}
              </div>
              <div className="flex items-center justify-between text-[12px] font-semibold text-[#727974]">
                <button type="button" className="hover:text-[#03241a] transition-colors" onClick={() => setIsOtpStep(false)}>← Change Email</button>
                <button type="button" className="hover:text-[#03241a] transition-colors disabled:opacity-50" disabled={resendTimer > 0} onClick={() => startOtpFlow(email)}>{resendTimer > 0 ? \`Resend in \${resendTimer}s\` : 'Resend Code'}</button>
              </div>
              <button type="button" className="flex items-center justify-center gap-2 w-full py-3 bg-[#03241a] text-white rounded-xl text-[13px] font-bold hover:bg-[#1b3a2f] transition-colors shadow-md disabled:opacity-50" onClick={() => verifyOtpCode(otpDigits.join(''))} disabled={otpDigits.join('').length < 6}>Verify & Enter Ledger <ArrowRight size={16} /></button>
            </div>
          ) : (
            <>
              <div className="flex justify-center mb-6">
                <div className="flex items-center bg-[#e5e2dd] p-1 rounded-full">
                  <button type="button" className={\`px-4 py-1.5 rounded-full text-[12px] font-bold transition-colors \${authMethod === 'email' ? 'bg-[#03241a] text-white shadow-md' : 'text-[#414845] hover:text-[#1c1c19]'}\`} onClick={() => setAuthMethod('email')}>Email & OTP</button>
                </div>
              </div>
              {authMethod === 'email' && (
                <form className="flex flex-col gap-4" onSubmit={handlePasswordAuthSubmit}>
                  <div className="flex items-center bg-[#f6f3ee] p-1 rounded-xl mb-2">
                    <button type="button" className={\`flex-1 py-1.5 text-[12px] font-bold rounded-lg transition-colors \${emailMode === 'login' ? 'bg-white text-[#03241a] shadow-sm' : 'text-[#727974]'}\`} onClick={() => setEmailMode('login')}>Sign In</button>
                    <button type="button" className={\`flex-1 py-1.5 text-[12px] font-bold rounded-lg transition-colors \${emailMode === 'signup' ? 'bg-white text-[#03241a] shadow-sm' : 'text-[#727974]'}\`} onClick={() => setEmailMode('signup')}>Create Account</button>
                  </div>
                  {emailMode === 'signup' && (
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold tracking-wider text-[#414845] uppercase">Full Name</label>
                      <div className="flex items-center gap-2 border border-[#eae6df] rounded-xl px-3 py-2.5 bg-[#fcf9f4] focus-within:border-[#03241a] transition-colors">
                        <User size={16} className="text-[#727974]" />
                        <input type="text" required className="w-full bg-transparent border-none outline-none text-[13px] text-[#1c1c19] placeholder-[#727974]" placeholder="e.g. Maya Sharma" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                      </div>
                    </div>
                  )}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold tracking-wider text-[#414845] uppercase">Email Address</label>
                    <div className="flex items-center gap-2 border border-[#eae6df] rounded-xl px-3 py-2.5 bg-[#fcf9f4] focus-within:border-[#03241a] transition-colors">
                      <Mail size={16} className="text-[#727974]" />
                      <input type="email" required className="w-full bg-transparent border-none outline-none text-[13px] text-[#1c1c19] placeholder-[#727974]" placeholder="you@domain.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold tracking-wider text-[#414845] uppercase">Password</label>
                    <div className="flex items-center gap-2 border border-[#eae6df] rounded-xl px-3 py-2.5 bg-[#fcf9f4] focus-within:border-[#03241a] transition-colors">
                      <KeyRound size={16} className="text-[#727974]" />
                      <input type={showPassword ? 'text' : 'password'} required className="w-full bg-transparent border-none outline-none text-[13px] text-[#1c1c19] placeholder-[#727974]" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
                      <button type="button" className="text-[#727974] hover:text-[#1c1c19]" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 mt-2">
                    <button type="submit" className="flex items-center justify-center gap-2 w-full py-3 bg-[#03241a] text-white rounded-xl text-[13px] font-bold hover:bg-[#1b3a2f] transition-colors shadow-md"><span>{emailMode === 'signup' ? 'Verify with Auto OTP' : 'Sign In with Password'}</span><ArrowRight size={16} /></button>
                    <button type="button" className="flex items-center justify-center gap-2 w-full py-3 bg-transparent text-[#03241a] border border-[#eae6df] rounded-xl text-[13px] font-bold hover:bg-[#f6f3ee] transition-colors" onClick={() => { if (!email || !email.includes('@')) { setErrorMessage('Please enter your email above to receive an OTP.'); return; } startOtpFlow(email); }}><Sparkles size={14} /><span>Instant Email OTP Code</span></button>
                  </div>
                </form>
              )}
            </>
          )}
          <div className="flex items-center gap-4 my-6">
            <span className="h-px bg-[#eae6df] flex-1" />
            <span className="text-[10px] font-bold tracking-widest text-[#727974] uppercase">Ledger Attributes</span>
            <span className="h-px bg-[#eae6df] flex-1" />
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#eaf5f0] text-[#456558] flex items-center justify-center shrink-0"><Building2 size={16} /></div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[12px] font-bold text-[#1c1c19]">Automated CR/DR reconciliation</span>
                <span className="text-[11px] text-[#727974] leading-snug">Pure balanced books conforming to double-entry integrity</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#fcedea] text-[#e8703a] flex items-center justify-center shrink-0"><PieChart size={16} /></div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[12px] font-bold text-[#1c1c19]">Allowance & travel budget pools</span>
                <span className="text-[11px] text-[#727974] leading-snug">Envelope jars that partition discretionary spending</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#f0ede9] text-[#727974] flex items-center justify-center shrink-0"><Lock size={16} /></div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[12px] font-bold text-[#1c1c19]">Bank-grade private encryption</span>
                <span className="text-[11px] text-[#727974] leading-snug">Your fiscal journal is strictly client-authenticated & sovereign</span>
              </div>
            </div>
          </div>
          <p className="text-center text-[11px] text-[#727974] mt-8 leading-relaxed">By continuing, you agree to PennyDime's <a href='#terms' onClick={(e) => e.preventDefault()} className='underline hover:text-[#1c1c19]'>Terms of Service</a> and <a href='#privacy' onClick={(e) => e.preventDefault()} className='underline hover:text-[#1c1c19]'>Privacy Policy</a>.</p>
        </div>
      </div>
      <div className="flex items-center justify-between w-full max-w-[440px] mt-6 text-[11px] text-[#727974] font-medium relative z-10 px-2">
        <div className="flex items-center gap-1.5"><span className="text-[#03241a]">•</span><span>Version 2.4 Edition</span></div>
        <div>Currencies: INR / USD / EUR</div>
      </div>
    </div>
  );
}`
};

for (const [file, content] of Object.entries(files)) {
    const dir = path.dirname(file);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(file, content, 'utf8');
    console.log('✅ Updated: ' + file);
}
console.log('\n🎉 All files successfully updated!');