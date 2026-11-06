import React, { useState, useEffect } from 'react';
import { X, Sliders } from 'lucide-react';

export default function AdjustBudgetModal({ isOpen, onClose, budget, onSave, currencySymbol = '₹' }) {
  const [allocated, setAllocated] = useState(budget ? budget.allocated : 0);
  const [spent, setSpent] = useState(budget ? budget.spent : 0);

  useEffect(() => {
    if (budget) {
      setAllocated(budget.allocated);
      setSpent(budget.spent);
    }
  }, [budget]);

  if (!isOpen || !budget) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...budget, allocated: parseFloat(allocated) || 0, spent: parseFloat(spent) || 0 });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#03241a]/45 backdrop-blur-sm animate-in fade-in" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-[420px] overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-[#eae6df]">
          <h2 className="font-serif text-xl font-bold text-[#03241a] flex items-center gap-2">
            <Sliders size={20} className="text-[#1b3a2f]" /> Adjust Limit: {budget.category}
          </h2>
          <button className="text-[#727974] hover:bg-[#f0ede9] p-1.5 rounded-md transition-colors" onClick={onClose}><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold text-[#414845]">MONTHLY LIMIT ALLOCATION ({currencySymbol})</label>
              <input type="number" step="any" required autoFocus className="w-full border-b-2 border-[#e0ded8] bg-transparent py-2 text-[14px] focus:outline-none focus:border-[#1b3a2f] transition-colors" value={allocated} onChange={(e) => setAllocated(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold text-[#414845]">CURRENT DR SPENT ({currencySymbol})</label>
              <input type="number" step="any" required className="w-full border-b-2 border-[#e0ded8] bg-transparent py-2 text-[14px] focus:outline-none focus:border-[#1b3a2f] transition-colors" value={spent} onChange={(e) => setSpent(e.target.value)} />
            </div>
          </div>
          <div className="p-4 border-t border-[#eae6df] flex justify-end gap-3">
            <button type="button" className="px-4 py-2 rounded-lg text-[13px] font-semibold text-[#414845] hover:bg-[#f0ede9] transition-colors" onClick={onClose}>Cancel</button>
            <button type="submit" className="px-5 py-2 rounded-lg text-[13px] font-semibold text-white bg-[#03241a] hover:bg-[#1b3a2f] transition-colors shadow-sm">Update Limit</button>
          </div>
        </form>
      </div>
    </div>
  );
}