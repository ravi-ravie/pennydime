import React, { useState, useMemo } from 'react';
import { ChevronDown } from 'lucide-react';
import { formatCurrency, formatCurrencyInteger } from '../../utils/formatters';

export default function TransactionsPage({
  transactions = [],
  currencySymbol = '₹'
}) {
  const [visibleLimit, setVisibleLimit] = useState(12);

  const totalCR = transactions.filter((t) => t.type === 'CR').reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);
  const totalDR = transactions.filter((t) => t.type === 'DR').reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);
  const net = totalCR - totalDR;

  const processedTransactions = useMemo(() => {
    let list = [...transactions];
    list.sort((a, b) => new Date(b.date) - new Date(a.date));
    return list;
  }, [transactions]);

  const displayedTransactions = processedTransactions.slice(0, visibleLimit);

  const groupedTransactions = useMemo(() => {
    const groups = {};
    displayedTransactions.forEach((tx) => {
      const dateObj = new Date(tx.date);
      const dateStr = dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase();
      
      if (!groups[dateStr]) {
        groups[dateStr] = { items: [], net: 0 };
      }
      groups[dateStr].items.push(tx);
      
      const amt = parseFloat(tx.amount) || 0;
      groups[dateStr].net += tx.type === 'CR' ? amt : -amt;
    });
    return groups;
  }, [displayedTransactions]);

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Food & Dining': return 'restaurant';
      case 'Travel': return 'directions_car';
      case 'Shopping': return 'shopping_bag';
      case 'Salary': 
      case 'Consulting':
      case 'Direct Deposit': return 'payments';
      case 'Bills & Utilities': return 'receipt_long';
      case 'Housing': return 'home';
      case 'Entertainment': return 'movie';
      case 'Savings': return 'account_balance';
      default: return 'receipt';
    }
  };

  return (
    <div className="flex flex-col w-full relative pb-10">
      
      <div className="flex flex-col mb-6 md:mb-8 pt-2">
        <h1 className="font-serif text-[32px] md:text-[42px] font-bold text-[#03241a] leading-tight tracking-tight mb-1">Transactions</h1>
        <p className="text-[13px] md:text-[15px] text-[#727974]">Review and manage your ledger entries.</p>
      </div>

      <div className="bg-[#f6f3ee]/70 border border-[#eae6df] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#03241a] text-xl">analytics</span>
          <span className="text-[10px] md:text-[11px] font-bold tracking-[0.08em] text-[#1c1c19] uppercase">Ledger Summary ({transactions.length} Entries)</span>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 md:gap-6 text-[12px]">
          <div className="flex items-center gap-1.5">
            <span className="text-[#727974] font-medium">Total CR:</span>
            <span className="font-serif text-[14px] md:text-[16px] font-bold text-[#456558]">+{formatCurrencyInteger(totalCR, currencySymbol)}</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-[#c1c8c3]" />
          <div className="flex items-center gap-1.5">
            <span className="text-[#727974] font-medium">Total DR:</span>
            <span className="font-serif text-[14px] md:text-[16px] font-bold text-[#a33e07]">-{formatCurrencyInteger(totalDR, currencySymbol)}</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-[#c1c8c3]" />
          <div className="flex items-center gap-1.5">
            <span className="text-[#727974] font-medium">Net:</span>
            <span className={`font-serif text-[14px] md:text-[16px] font-bold ${net >= 0 ? 'text-[#456558]' : 'text-[#a33e07]'}`}>
              {net >= 0 ? '+' : '-'}{formatCurrencyInteger(Math.abs(net), currencySymbol)}
            </span>
          </div>
        </div>
      </div>

      {Object.keys(groupedTransactions).length === 0 ? (
        <div className="bg-white border border-[#eae6df] rounded-2xl p-12 text-center shadow-sm">
          <p className="text-[#727974] text-[14px] md:text-lg">No transactions match your current filters.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6 md:gap-8">
          {Object.entries(groupedTransactions).map(([dateLabel, group]) => (
            <section key={dateLabel} className="flex flex-col">
              
              <div className="sticky top-[80px] z-20 bg-[#fcf9f4]/95 backdrop-blur-md py-2 md:py-3 flex items-center gap-4 mb-2">
                <span className="text-[10px] md:text-[11px] font-bold tracking-[0.1em] text-[#727974] uppercase">{dateLabel}</span>
                <div className="flex-1 h-px bg-[#eae6df]" />
                <span className={`font-serif text-[14px] md:text-[16px] font-bold ${group.net >= 0 ? 'text-[#456558]' : 'text-[#a33e07]'}`}>
                  {group.net >= 0 ? '+' : '-'}{formatCurrencyInteger(Math.abs(group.net), currencySymbol)}
                </span>
              </div>

              <div className="bg-white border border-[#eae6df] rounded-2xl shadow-sm overflow-hidden flex flex-col">
                {group.items.map((tx, idx) => {
                  const isCR = tx.type === 'CR';
                  return (
                    <div 
                      key={tx.id} 
                      className={`flex flex-col md:flex-row md:items-center justify-between p-4 md:p-5 hover:bg-[#fcf9f4] transition-colors group relative ${idx !== group.items.length - 1 ? 'border-b border-[#eae6df]' : ''}`}
                    >
                      
                      <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0 md:pr-6">
                        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shrink-0 ${isCR ? 'bg-[#eaf5f0]' : 'bg-[#fcedea]'}`}>
                          <span className={`material-symbols-outlined text-xl md:text-2xl ${isCR ? 'text-[#456558]' : 'text-[#a33e07]'}`}>
                            {getCategoryIcon(tx.category)}
                          </span>
                        </div>
                        
                        <div className="flex flex-col min-w-0">
                          <h3 className="font-serif text-[16px] md:text-[20px] font-bold text-[#1c1c19] truncate">{tx.title}</h3>
                          <div className="flex items-center gap-1.5 md:gap-2 mt-1 flex-wrap">
                            <span className={`px-1.5 md:px-2 py-0.5 rounded-full text-[9px] md:text-[10px] font-bold tracking-wider ${isCR ? 'bg-[#eaf5f0] text-[#456558]' : 'bg-[#fcedea] text-[#a33e07]'}`}>
                              [{tx.type}]
                            </span>
                            <span className="px-1.5 md:px-2 py-0.5 rounded-full bg-[#f0ede9] text-[#414845] text-[9px] md:text-[10px] font-bold">
                              {tx.category}
                            </span>
                            <span className="text-[11px] md:text-[13px] text-[#727974] hidden sm:inline-block">
                              {tx.isReconciled ? 'Reconciled' : 'Uncertified'} • {tx.method || 'Standard'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between md:justify-end gap-4 md:gap-8 mt-3 md:mt-0 pl-[52px] md:pl-0">
                        <div className="text-right min-w-[80px] md:min-w-[100px]">
                          <div className={`font-serif text-[16px] md:text-[20px] font-bold ${isCR ? 'text-[#456558]' : 'text-[#a33e07]'}`}>
                            {isCR ? '+' : '-'}{formatCurrency(tx.amount, currencySymbol)}
                          </div>
                          <div className={`text-[9px] md:text-[10px] font-bold uppercase tracking-wider ${isCR ? 'text-[#456558]' : 'text-[#a33e07]'}`}>
                            {isCR ? 'CR (CREDIT)' : 'DR (DEBIT)'}
                          </div>
                        </div>
                        
                        <div className="text-right md:pl-6 md:border-l md:border-[#eae6df] min-w-[90px] md:min-w-[120px]">
                          <div className="font-serif text-[14px] md:text-[17px] font-bold text-[#1c1c19]">
                            {formatCurrency(tx.runningBal || 0, currencySymbol)}
                          </div>
                          <div className="text-[9px] md:text-[10px] font-bold text-[#727974] uppercase tracking-wider">
                            RUNNING BAL
                          </div>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}

      {visibleLimit < processedTransactions.length && (
        <div className="flex justify-center mt-8 mb-12">
          <button 
            onClick={() => setVisibleLimit((prev) => prev + 12)}
            className="flex flex-col items-center gap-1 text-[#727974] hover:text-[#03241a] transition-colors text-[10px] md:text-[11px] font-bold tracking-widest uppercase"
          >
            <ChevronDown size={20} className="mb-1" />
            View Older Entries
          </button>
        </div>
      )}
    </div>
  );
}