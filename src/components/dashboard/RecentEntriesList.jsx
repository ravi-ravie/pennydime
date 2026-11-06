import React from 'react';
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
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isCR ? 'bg-[#eaf5f0] text-[#456558]' : 'bg-[#fcedea] text-[#e8703a]'}`}>{getCategoryIcon(tx.category)}</div>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] font-semibold text-[#1c1c19]">{tx.title}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${isCR ? 'bg-[#eaf5f0] text-[#456558]' : 'bg-[#fcedea] text-[#e8703a]'}`}>{tx.type}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[12px] text-[#727974]">
                      <span>{tx.displayDate || tx.date}</span> <span>•</span>
                      <span className="bg-[#f0ede9] text-[#414845] px-1.5 py-0.5 rounded font-medium text-[11px]">{tx.category}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right flex flex-col gap-0.5">
                  <div className={`font-serif text-[17px] font-bold ${isCR ? 'text-[#03241a]' : 'text-[#a33e07]'}`}>{isCR ? '+' : '−'}{formatCurrency(tx.amount, currencySymbol)}</div>
                  <div className="text-[11px] text-[#727974]">Bal: {formatCurrency(tx.runningBal || 0, currencySymbol)}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}