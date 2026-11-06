import React, { useState } from 'react';
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
}