import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';

export default function AddEntryModal({
  isOpen,
  onClose,
  onAddEntry,
  currencySymbol = '₹',
  allowancePools = [],
  currentBalance = 0
}) {
  const getTodayISO = () => { 
    const today = new Date(); 
    return today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0'); 
  };
  
  const [currentMode, setCurrentMode] = useState('DR');
  const [amount, setAmount] = useState('');
  const [merchant, setMerchant] = useState('');
  const [dateStr, setDateStr] = useState(getTodayISO());
  const [allowanceOption, setAllowanceOption] = useState('none');
  const [category, setCategory] = useState('Food & Dining');
  const [notes, setNotes] = useState('');
  const [showError, setShowError] = useState(false);
  const [insufficientError, setInsufficientError] = useState(false);

  const drCategories = ['Food & Dining', 'Travel', 'Bills & Utilities', 'Shopping', 'Housing', 'Entertainment', 'Others'];
  const crCategories = ['Salary', 'Consulting', 'Investment', 'Dividend', 'Gift', 'Refund', 'Other Income'];
  
  useEffect(() => { 
    if (isOpen) { 
      setShowError(false); 
      setInsufficientError(false);
      setDateStr(getTodayISO()); 
    } 
  }, [isOpen]);

  if (!isOpen) return null;

  const handleModeChange = (mode) => {
    setCurrentMode(mode);
    setInsufficientError(false);
    if (mode === 'CR') { setCategory('Salary'); setAllowanceOption('none'); } 
    else { setCategory('Food & Dining'); }
  };

  const handleAdjustAmount = (delta) => { 
    const val = parseFloat(amount) || 0; 
    setAmount((val + delta).toFixed(2).replace(/\.00$/, '')); 
    setShowError(false); 
    setInsufficientError(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    
    if (!parsedAmount || isNaN(parsedAmount) || parsedAmount <= 0) { 
      setShowError(true); 
      return; 
    }

    if (currentMode === 'DR' && parsedAmount > Number(currentBalance)) {
      setInsufficientError(true);
      return;
    }

    setShowError(false);
    setInsufficientError(false);
    
    const isDR = currentMode === 'DR';
    const validDate = dateStr || new Date().toISOString().split('T')[0];
    const displayDate = new Date(validDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    
    const entryData = {
      id: 'tx-' + Date.now(), 
      title: merchant.trim() || (isDR ? category + ' Expense' : category + ' Inflow'), 
      type: currentMode, 
      amount: parsedAmount, 
      category, 
      date: validDate, 
      displayDate, 
      note: notes.trim() || (isDR ? category : 'Direct Transfer'), 
      method: isDR ? (allowanceOption !== 'none' ? 'Allowance Pool' : 'Standard Payment') : 'Direct Deposit', 
      isReconciled: true, 
      allowancePool: isDR ? allowanceOption : null
    };
    
    onAddEntry(entryData);
    setAmount(''); 
    setMerchant(''); 
    setNotes(''); 
    onClose();
  };

  const activeCategories = currentMode === 'DR' ? drCategories : crCategories;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-3 sm:p-4 bg-[#03241a]/45 backdrop-blur-sm animate-in fade-in overflow-y-auto" onClick={onClose} role="dialog" aria-modal="true">
      <div className="relative bg-white border border-[#c1c8c3]/70 rounded-3xl sm:rounded-[28px] shadow-2xl w-full max-w-[520px] p-5 sm:p-7 z-[1000] max-h-[95vh] sm:max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
        
        <div className="flex items-start justify-between pb-4 border-b border-[#c1c8c3]/40">
          <div className="pr-4">
            <span className="text-[10px] sm:text-[11px] font-bold tracking-wider text-[#414845] uppercase block">Real Ledger Entry</span>
            <h3 className="font-serif text-[22px] sm:text-[26px] font-bold text-[#03241a] mt-1 leading-tight">Record Transaction</h3>
            <p className="text-[11px] sm:text-[12px] text-[#414845] mt-1">Add a real double-entry Credit (Money In) or Debit (Money Out) record.</p>
          </div>
          <button type="button" className="p-1.5 rounded-full text-[#414845] hover:bg-[#f0ede9] transition-colors shrink-0" onClick={onClose} aria-label="Close dialog">✕</button>
        </div>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
          
          <div className="grid grid-cols-2 gap-1.5 sm:gap-2 bg-[#f0ede9] p-1 sm:p-1.5 rounded-2xl border border-[#c1c8c3]/40">
            <button type="button" className={`py-2 sm:py-2.5 rounded-xl text-[10px] sm:text-[12px] font-bold flex items-center justify-center gap-1 transition-all ${currentMode === 'CR' ? 'bg-[#03241a] text-white shadow-md' : 'text-[#414845] hover:text-[#1c1c19]'}`} onClick={() => handleModeChange('CR')}>
              <span>↓</span><span className="hidden sm:inline">CR (Credit / Income)</span><span className="sm:hidden">CR (Income)</span>
            </button>
            <button type="button" className={`py-2 sm:py-2.5 rounded-xl text-[10px] sm:text-[12px] font-bold flex items-center justify-center gap-1 transition-all ${currentMode === 'DR' ? 'bg-[#a33e07] text-white shadow-md' : 'text-[#414845] hover:text-[#1c1c19]'}`} onClick={() => handleModeChange('DR')}>
              <span>↑</span><span className="hidden sm:inline">DR (Debit / Expense)</span><span className="sm:hidden">DR (Expense)</span>
            </button>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-bold tracking-wider text-[#414845] uppercase">Amount</label>
              {showError && <span className="text-[11px] text-[#ba1a1a] font-semibold">Please enter a valid amount</span>}
            </div>
            <div className={`flex items-center border-b-2 pb-1 transition-colors ${currentMode === 'DR' ? 'border-[#a33e07]' : 'border-[#03241a]'} ${insufficientError ? 'border-[#ba1a1a]' : ''}`}>
              <span className={`font-serif text-[26px] sm:text-[32px] font-bold mr-2 ${currentMode === 'DR' ? 'text-[#a33e07]' : 'text-[#03241a]'}`}>{currencySymbol}</span>
              <input type="number" step="any" min="0.01" required autoFocus className="w-full bg-transparent border-none outline-none font-serif text-[26px] sm:text-[32px] font-bold text-[#1c1c19] tracking-tight placeholder-[#c1c8c3]" placeholder="0.00" value={amount} onChange={(e) => { setAmount(e.target.value); setShowError(false); setInsufficientError(false); }} />
            </div>
            
            {insufficientError && (
              <div className="mt-2 flex items-start gap-1.5 text-[11px] sm:text-[12px] font-medium text-[#ba1a1a] animate-in fade-in slide-in-from-top-1">
                <AlertCircle size={14} className="shrink-0 mt-0.5" />
                <span>Insufficient balance. Available: {currencySymbol}{Number(currentBalance).toFixed(2)}.</span>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-1.5 mt-3">
              <span className="text-[10px] sm:text-[11px] font-semibold text-[#414845] mr-0.5">Quick Add:</span>
              <button type="button" className="px-2 py-1 rounded-lg border border-[#c1c8c3]/70 text-[10px] sm:text-[11px] font-semibold hover:bg-[#f0ede9]" onClick={() => handleAdjustAmount(500)}>+{currencySymbol}500</button>
              <button type="button" className="px-2 py-1 rounded-lg border border-[#c1c8c3]/70 text-[10px] sm:text-[11px] font-semibold hover:bg-[#f0ede9]" onClick={() => handleAdjustAmount(1000)}>+{currencySymbol}1,000</button>
              <button type="button" className="px-2 py-1 rounded-lg border border-[#c1c8c3]/70 text-[10px] sm:text-[11px] font-semibold hover:bg-[#f0ede9]" onClick={() => handleAdjustAmount(2500)}>+{currencySymbol}2,500</button>
              <button type="button" className="ml-auto text-[10px] sm:text-[11px] text-[#414845] px-1.5 py-1 hover:text-[#ba1a1a]" onClick={() => setAmount('')}>Clear</button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold tracking-wider text-[#414845] uppercase">Date</label>
              <div className="flex items-center gap-2 bg-[#f6f3ee] border border-[#c1c8c3]/60 rounded-xl px-3 py-2">
                <input type="date" className="w-full bg-transparent border-none outline-none text-[12px] font-medium text-[#1c1c19] cursor-pointer" value={dateStr} onChange={(e) => setDateStr(e.target.value)} />
              </div>
            </div>
            <div className={`flex flex-col gap-1.5 ${currentMode === 'CR' ? 'opacity-45 pointer-events-none' : ''}`}>
              <label className="text-[11px] font-bold tracking-wider text-[#414845] uppercase">Allowance Pool</label>
              <div className="relative flex items-center">
                <select className="w-full bg-[#f6f3ee] border border-[#c1c8c3]/60 rounded-xl py-2 pl-3 pr-8 text-[12px] font-semibold text-[#1c1c19] appearance-none cursor-pointer outline-none" value={allowanceOption} disabled={currentMode === 'CR'} onChange={(e) => setAllowanceOption(e.target.value)}>
                  <option value="none">General / No Pool</option>
                  {allowancePools.map(pool => (
                    <option key={pool.id} value={pool.id}>
                      {pool.name} (Rem: {currencySymbol}{Math.max(0, pool.allocated - pool.spent).toLocaleString('en-IN')})
                    </option>
                  ))}
                </select>
                <span className="absolute right-2.5 pointer-events-none text-[#414845]">▼</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold tracking-wider text-[#414845] uppercase">{currentMode === 'DR' ? 'Merchant / Payee' : 'Payer / Source'}</label>
            <div className="flex items-center gap-2 bg-[#f6f3ee] border border-[#c1c8c3]/60 rounded-xl px-3 py-2">
              <input type="text" required className="w-full bg-transparent border-none outline-none text-[12px] font-semibold text-[#1c1c19] placeholder-[#727974]" placeholder={currentMode === 'DR' ? 'e.g. Market, Rent' : 'e.g. Salary, Dividend'} value={merchant} onChange={(e) => setMerchant(e.target.value)} />
            </div>
          </div>
          
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold tracking-wider text-[#414845] uppercase">Category</label>
            <div className="flex flex-wrap gap-1.5">
              {activeCategories.map((cat) => {
                const isSelected = category === cat;
                const selectedClass = isSelected ? (currentMode === 'DR' ? 'bg-[#a33e07] text-white shadow-sm' : 'bg-[#03241a] text-white shadow-sm') : 'bg-[#f0ede9] text-[#414845] hover:bg-[#e5e2dd]';
                return (
                  <button key={cat} type="button" className={`px-2.5 sm:px-3 py-1.5 rounded-full text-[10px] sm:text-[11px] font-medium transition-colors ${selectedClass}`} onClick={() => setCategory(cat)}><span>{cat}</span></button>
                );
              })}
            </div>
          </div>
          
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold tracking-wider text-[#414845] uppercase">Note (Optional)</label>
            <input type="text" className="w-full bg-transparent border-b border-[#c1c8c3]/60 outline-none text-[12px] font-medium text-[#1c1c19] py-1.5 focus:border-[#03241a] transition-colors placeholder-[#727974]" placeholder="e.g. Reference" value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
          
          <div className="flex items-center justify-between sm:justify-end gap-2 mt-2 pt-4 border-t border-[#c1c8c3]/40">
            <button type="button" className="px-4 py-2 rounded-xl text-[12px] font-bold text-[#414845] hover:bg-[#f0ede9] transition-colors" onClick={onClose}>Cancel</button>
            <button type="submit" className={`flex items-center justify-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-xl text-[12px] font-bold text-white shadow-md transition-all hover:-translate-y-0.5 flex-1 sm:flex-none ${currentMode === 'DR' ? 'bg-[#a33e07] hover:brightness-110' : 'bg-[#03241a] hover:bg-[#1b3a2f]'}`}>
              <span>Record {currentMode === 'DR' ? 'Debit' : 'Credit'} Entry</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}