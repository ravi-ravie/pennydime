import React, { useState } from 'react';
import { Coins, Download, FileSpreadsheet, FileCode, RotateCcw } from 'lucide-react';
import ClearDataModal from './ClearDataModal';

export default function PreferencesCard({
  currencySymbol,
  setCurrencySymbol,
  transactions,
  userProfile,
  startingBalance,
  onResetData,
  showToast
}) {
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);

  const currencies = [
    { symbol: '₹', label: 'INR (₹)' },
    { symbol: '$', label: 'USD ($)' },
    { symbol: '€', label: 'EUR (€)' },
    { symbol: '£', label: 'GBP (£)' }
  ];

  const exportCSV = () => {
    if (transactions.length === 0) return showToast('No transactions to export');
    
    const headers = ['ID', 'Date', 'Title', 'Type', 'Amount', 'Category', 'Method', 'Note', 'Reconciled'];
    const rows = transactions.map((t) => [
      t.id, 
      t.date, 
      `"${(t.title || '').replace(/"/g, '""')}"`, 
      t.type, 
      t.amount, 
      `"${t.category}"`, 
      `"${t.method || ''}"`, 
      `"${(t.note || '').replace(/"/g, '""')}"`, 
      t.isReconciled ? 'Yes' : 'No'
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `PennyDime_Ledger_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Ledger exported as CSV');
  };

  const exportJSON = () => {
    if (transactions.length === 0) return showToast('No transactions to export');

    const backupData = { 
      userProfile, 
      startingBalance, 
      currencySymbol, 
      exportedAt: new Date().toISOString(), 
      transactions 
    };
    
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `PennyDime_Backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Ledger backup downloaded as JSON');
  };

  return (
    <>
      <div className="bg-white border border-[#eae6df] rounded-2xl p-5 md:p-8 shadow-sm flex flex-col gap-6 md:gap-8">
        
        <div>
          <div className="flex items-center gap-2 mb-4 md:mb-6">
            <Coins size={18} className="md:w-5 md:h-5 text-[#03241a]" />
            <h2 className="font-serif text-[18px] md:text-xl font-bold text-[#03241a]">Ledger Currencies</h2>
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-[10px] md:text-[11px] font-bold tracking-wider text-[#414845] uppercase">Primary Active Currency</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 mt-1">
              {currencies.map((c) => (
                <button
                  key={c.symbol}
                  type="button"
                  className={`flex flex-col items-center justify-center p-3 md:p-4 rounded-xl border-2 transition-all ${
                    currencySymbol === c.symbol 
                      ? 'border-[#03241a] bg-[#f0ede9]' 
                      : 'border-[#eae6df] bg-white hover:border-[#c1c8c3]'
                  }`}
                  onClick={() => {
                    setCurrencySymbol(c.symbol);
                    showToast(`Currency changed to ${c.label}`);
                  }}
                >
                  <div className="font-serif text-[20px] md:text-2xl text-[#03241a] mb-0.5 md:mb-1">{c.symbol}</div>
                  <div className="text-[9px] md:text-[10px] font-bold text-[#727974] uppercase tracking-wider">{c.label}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-[#eae6df] pt-4 md:pt-6">
          <div className="flex items-center gap-2 mb-3 md:mb-4">
            <Download size={18} className="md:w-5 md:h-5 text-[#03241a]" />
            <h2 className="font-serif text-[18px] md:text-xl font-bold text-[#03241a]">Data Portability & Backups</h2>
          </div>
          
          <div className="flex flex-col sm:flex-row flex-wrap gap-2 md:gap-3">
            <button
              type="button"
              className="flex items-center justify-center gap-2 px-4 py-2 md:py-2.5 rounded-xl border border-[#eae6df] bg-white hover:bg-[#f6f3ee] text-[12px] md:text-[13px] font-bold text-[#414845] transition-colors"
              onClick={exportCSV}
            >
              <FileSpreadsheet size={16} /> Export CSV
            </button>

            <button
              type="button"
              className="flex items-center justify-center gap-2 px-4 py-2 md:py-2.5 rounded-xl border border-[#eae6df] bg-white hover:bg-[#f6f3ee] text-[12px] md:text-[13px] font-bold text-[#414845] transition-colors"
              onClick={exportJSON}
            >
              <FileCode size={16} /> Export JSON Backup
            </button>
          </div>
        </div>

        <div className="border-t border-[#eae6df] pt-4 md:pt-6">
          <button
            type="button"
            className="flex items-center justify-center sm:justify-start gap-2 text-[#ba1a1a] text-[12px] md:text-[13px] font-bold hover:bg-[#fcedea] px-3 md:px-4 py-2 md:py-2.5 rounded-xl transition-colors border border-transparent hover:border-[#ba1a1a]/20 w-full sm:w-auto"
            onClick={() => setIsClearModalOpen(true)}
          >
            <RotateCcw size={16} />
            <span>Clear All Ledger Data</span>
          </button>
        </div>

      </div>

      <ClearDataModal 
        isOpen={isClearModalOpen} 
        onClose={() => setIsClearModalOpen(false)} 
        onConfirm={onResetData} 
      />
    </>
  );
}