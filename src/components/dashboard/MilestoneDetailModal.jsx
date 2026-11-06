import React, { useState } from 'react';
import { X, CheckCircle2, TrendingUp, Lock, Unlock, Shield, Plus, Minus, AlertCircle } from 'lucide-react';
import { formatCurrencyInteger } from '../../utils/formatters';

export default function MilestoneDetailModal({
  isOpen,
  onClose,
  targetAmount = 0,
  currentBalance = 0, 
  availableBalance = 0, 
  isLocked = true,
  onToggleLock,
  currencySymbol = '₹',
  onContribute,
  onWithdraw,
  onAdjustTarget
}) {
  const [customAmount, setCustomAmount] = useState('');
  const [actionType, setActionType] = useState(null); // 'contribute' or 'withdraw'
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const saved = Math.max(0, currentBalance); 
  const pct = targetAmount > 0 ? Math.min(100, (saved / targetAmount) * 100) : 0;
  const remaining = Math.max(0, targetAmount - saved);

  const mo1 = targetAmount * (1/6);
  const mo3 = targetAmount * (3/6);
  const mo5 = targetAmount * (5/6);
  const mo6 = targetAmount;

  const handleActionSubmit = (e) => {
    e.preventDefault();
    const val = parseFloat(customAmount);
    if (!val || val <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (actionType === 'contribute') {
      if (val > availableBalance) {
        setError(`Insufficient checking balance. You have ${formatCurrencyInteger(availableBalance, currencySymbol)} available.`);
        return;
      }
      onContribute(val);
    } else if (actionType === 'withdraw') {
      if (val > saved) {
        setError(`Cannot withdraw more than the fund balance (${formatCurrencyInteger(saved, currencySymbol)}).`);
        return;
      }
      onWithdraw(val);
    }

    setCustomAmount('');
    setActionType(null);
    setError('');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#03241a]/45 backdrop-blur-sm animate-in fade-in" onClick={onClose}>
      <div 
        className="bg-[#fcf9f4] border border-[#eae6df] rounded-[32px] shadow-2xl w-full max-w-[560px] overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between p-6 pb-4 border-b border-[#eae6df] bg-white">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold tracking-widest text-[#a33e07] bg-[#fcedea] px-2 py-0.5 rounded-full uppercase">Milestone in Progress</span>
              <span className="text-[10px] font-bold text-[#456558] bg-[#eaf5f0] px-2 py-0.5 rounded-full flex items-center gap-1">
                <Shield size={10} /> Tier 3 Active
              </span>
            </div>
            <h2 className="font-serif text-2xl font-bold text-[#03241a]">Emergency Fund Reserve</h2>
            <p className="text-[13px] text-[#727974]">Goal: 6 Months of Essential Living Expenses ({formatCurrencyInteger(targetAmount, currencySymbol)})</p>
          </div>
          <button className="text-[#727974] hover:bg-[#f0ede9] p-1.5 rounded-full transition-colors" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex flex-col gap-6">
          <div className="bg-[#f0ede9] rounded-2xl p-5 border border-[#eae6df]">
            <div className="flex justify-between items-end mb-4">
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-[32px] font-bold text-[#03241a]">{formatCurrencyInteger(saved, currencySymbol)}</span>
                <span className="text-[14px] text-[#727974]">/ {formatCurrencyInteger(targetAmount, currencySymbol)}</span>
              </div>
              <span className="bg-[#03241a] text-white text-[11px] font-bold px-2.5 py-1 rounded-md">{pct.toFixed(1)}% Achieved</span>
            </div>
            
            <div className="w-full h-2.5 bg-[#03241a]/10 rounded-full overflow-hidden mb-2">
              <div className="h-full bg-[#a33e07] rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
            </div>
            
            <div className="flex justify-between text-[11px] font-medium text-[#727974] mb-6">
              <span className="flex items-center gap-1">
                <TrendingUp size={12} className="text-[#a33e07]"/> Next Target: 5 Months ({formatCurrencyInteger(mo5, currencySymbol)})
              </span>
              <span>{formatCurrencyInteger(remaining, currencySymbol)} to final goal</span>
            </div>

            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="flex flex-col items-center gap-1">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${saved >= mo1 && mo1 > 0 ? 'bg-[#eaf5f0] text-[#456558]' : 'bg-[#e5e2dd] text-[#727974] opacity-50'}`}>
                  {saved >= mo1 && mo1 > 0 ? <CheckCircle2 size={14} /> : <Lock size={12} />}
                </div>
                <span className="text-[10px] font-bold text-[#1c1c19]">1 Mo</span>
                <span className={`text-[9px] font-semibold ${saved >= mo1 && mo1 > 0 ? 'text-[#456558]' : 'text-[#727974]'}`}>
                  {saved >= mo1 && mo1 > 0 ? 'Completed' : mo1 > 0 ? `${((saved/mo1)*100).toFixed(0)}%` : '—'}
                </span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${saved >= mo3 && mo3 > 0 ? 'bg-[#eaf5f0] text-[#456558]' : 'bg-[#e5e2dd] text-[#727974] opacity-50'}`}>
                  {saved >= mo3 && mo3 > 0 ? <CheckCircle2 size={14} /> : <Lock size={12} />}
                </div>
                <span className="text-[10px] font-bold text-[#1c1c19]">3 Mo</span>
                <span className={`text-[9px] font-semibold ${saved >= mo3 && mo3 > 0 ? 'text-[#456558]' : 'text-[#727974]'}`}>
                  {saved >= mo3 && mo3 > 0 ? 'Completed' : mo3 > 0 ? `${((saved/mo3)*100).toFixed(0)}%` : '—'}
                </span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${saved >= mo5 && mo5 > 0 ? 'bg-[#eaf5f0] text-[#456558]' : saved >= mo3 && mo5 > 0 ? 'bg-[#fcedea] text-[#a33e07] border border-[#a33e07]/30' : 'bg-[#e5e2dd] text-[#727974] opacity-50'}`}>
                  {saved >= mo5 && mo5 > 0 ? <CheckCircle2 size={14} /> : saved >= mo3 && mo5 > 0 ? <div className="w-2 h-2 rounded-full bg-[#a33e07]" /> : <Lock size={12} />}
                </div>
                <span className="text-[10px] font-bold text-[#1c1c19]">5 Mo</span>
                <span className={`text-[9px] font-semibold ${saved >= mo5 && mo5 > 0 ? 'text-[#456558]' : saved >= mo3 && mo5 > 0 ? 'text-[#a33e07]' : 'text-[#727974]'}`}>
                  {saved >= mo5 && mo5 > 0 ? 'Completed' : mo5 > 0 ? `${((saved/mo5)*100).toFixed(0)}%` : '—'}
                </span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${saved >= mo6 && mo6 > 0 ? 'bg-[#eaf5f0] text-[#456558]' : 'bg-[#e5e2dd] text-[#727974] opacity-50'}`}>
                  {saved >= mo6 && mo6 > 0 ? <CheckCircle2 size={14} /> : <Lock size={12} />}
                </div>
                <span className="text-[10px] font-bold text-[#1c1c19]">6 Mo</span>
                <span className={`text-[9px] font-semibold ${saved >= mo6 && mo6 > 0 ? 'text-[#456558]' : 'text-[#727974]'}`}>
                  {saved >= mo6 && mo6 > 0 ? 'Final Goal' : mo6 > 0 ? `${((saved/mo6)*100).toFixed(0)}%` : '—'}
                </span>
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#414845]">
                {actionType === 'withdraw' ? 'Withdraw to Checking' : 'Quick Allocate from Surplus'}
              </span>
              <span className="text-[11px] text-[#727974]">
                {actionType === 'withdraw' ? 'Available in Fund: ' : 'Available to Contribute: '}
                <strong className="text-[#03241a]">
                  {formatCurrencyInteger(actionType === 'withdraw' ? saved : availableBalance, currencySymbol)}
                </strong>
              </span>
            </div>
            
            {error && (
              <div className="mb-3 flex items-center gap-2 text-[12px] text-[#ba1a1a] font-medium bg-[#fcedea] p-2.5 rounded-lg">
                <AlertCircle size={14} /> {error}
              </div>
            )}

            {actionType ? (
              <form onSubmit={handleActionSubmit} className="flex gap-2 animate-in fade-in slide-in-from-top-2">
                <input 
                  type="number" 
                  placeholder={`Amount (${currencySymbol})`} 
                  className="flex-1 bg-white border border-[#eae6df] rounded-xl px-3 py-2 text-[13px] font-semibold focus:outline-none focus:border-[#03241a]"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    setError('');
                  }}
                  autoFocus
                />
                <button type="submit" className={`px-4 py-2 rounded-xl text-[12px] font-bold text-white transition-colors ${actionType === 'withdraw' ? 'bg-[#a33e07] hover:bg-[#8b3506]' : 'bg-[#03241a] hover:bg-[#1b3a2f]'}`}>
                  {actionType === 'withdraw' ? 'Withdraw' : 'Add'}
                </button>
                <button type="button" onClick={() => { setActionType(null); setError(''); }} className="px-3 py-2 text-[12px] text-[#727974] hover:text-[#1c1c19]">Cancel</button>
              </form>
            ) : (
              <div className="flex gap-2">
                {[5000, 10000, 25000].map((amt) => (
                  <button key={amt} onClick={() => { onContribute(amt); }} className="flex-1 py-2 bg-white border border-[#eae6df] rounded-xl text-[12px] font-bold text-[#1c1c19] hover:bg-[#f0ede9] transition-colors shadow-sm">
                    +{currencySymbol}{amt.toLocaleString('en-IN')}
                  </button>
                ))}
                <button onClick={() => setActionType('contribute')} className="flex-1 py-2 bg-white border border-[#eae6df] rounded-xl text-[12px] font-bold text-[#1c1c19] hover:bg-[#f0ede9] transition-colors shadow-sm">
                  Custom
                </button>
              </div>
            )}
          </div>

          {/* Working Lock Toggle */}
          <div className="flex items-center justify-between p-4 bg-white border border-[#eae6df] rounded-2xl shadow-sm transition-all">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isLocked ? 'bg-[#eaf5f0] text-[#456558]' : 'bg-[#fcedea] text-[#a33e07]'}`}>
                {isLocked ? <Lock size={14} /> : <Unlock size={14} />}
              </div>
              <div>
                <div className="text-[13px] font-bold text-[#1c1c19]">Lock Reserve Safeguard</div>
                <div className="text-[11px] text-[#727974]">
                  {isLocked ? 'Guarded against discretionary debits & impulse spends' : 'Withdrawals are currently allowed from this fund'}
                </div>
              </div>
            </div>
            
            <button 
              onClick={onToggleLock}
              className={`w-10 h-6 rounded-full relative cursor-pointer transition-colors ${isLocked ? 'bg-[#03241a]' : 'bg-[#c1c8c3]'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300 ${isLocked ? 'right-1' : 'left-1'}`} />
            </button>
          </div>
        </div>

        <div className="p-5 border-t border-[#eae6df] bg-white flex justify-between gap-3">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-[#eae6df] text-[13px] font-bold text-[#414845] hover:bg-[#f0ede9] transition-colors">
            Close
          </button>
          <div className="flex gap-2">
            <button onClick={onAdjustTarget} className="px-5 py-2.5 rounded-xl border border-[#eae6df] text-[13px] font-bold text-[#414845] hover:bg-[#f0ede9] transition-colors">
              Adjust Target
            </button>
            
            {isLocked ? (
              <button onClick={() => setActionType('contribute')} className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#03241a] text-white text-[13px] font-bold hover:bg-[#1b3a2f] transition-colors shadow-md">
                <Plus size={16} /> Contribute
              </button>
            ) : (
              <div className="flex gap-2">
                <button onClick={() => setActionType('withdraw')} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-[#eae6df] text-[#a33e07] text-[13px] font-bold hover:bg-[#fcedea] transition-colors shadow-sm">
                  <Minus size={16} /> Withdraw
                </button>
                <button onClick={() => setActionType('contribute')} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#03241a] text-white text-[13px] font-bold hover:bg-[#1b3a2f] transition-colors shadow-md">
                  <Plus size={16} /> Contribute
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}