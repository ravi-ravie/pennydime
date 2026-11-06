import React, { useState } from 'react';
import { X, Target } from 'lucide-react';

export default function SetMilestoneModal({ isOpen, onClose, currentTarget, onSave, currencySymbol = '₹' }) {
  const [val, setVal] = useState(currentTarget || '');

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    onSave(parseFloat(val) || 0);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#03241a]/45 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-[420px] overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-[#eae6df]">
          <h2 className="font-serif text-xl font-bold text-[#03241a] flex items-center gap-2">
            <Target size={22} className="text-[#1b3a2f]" /> Set Next Milestone
          </h2>
          <button className="text-[#727974] hover:bg-[#f0ede9] p-1.5 rounded-md transition-colors" onClick={onClose}><X size={20} /></button>
        </div>
        <form onSubmit={handleSave}>
          <div className="p-6 flex flex-col gap-4">
            <p className="text-[13px] text-[#414845]">Set a financial target (e.g., Emergency Fund) to track your progress on the dashboard.</p>
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold text-[#414845]">TARGET AMOUNT ({currencySymbol})</label>
              <input type="number" step="any" required autoFocus className="w-full border-b-2 border-[#e0ded8] bg-transparent py-2 text-[16px] font-bold focus:outline-none focus:border-[#1b3a2f] transition-colors" value={val} onChange={(e) => setVal(e.target.value)} placeholder="100000" />
            </div>
          </div>
          <div className="p-4 border-t border-[#eae6df] flex justify-end gap-3">
            <button type="button" className="px-4 py-2 rounded-lg text-[13px] font-semibold text-[#414845] hover:bg-[#f0ede9] transition-colors" onClick={onClose}>Cancel</button>
            <button type="submit" className="px-5 py-2 rounded-lg text-[13px] font-semibold text-white bg-[#03241a] hover:bg-[#1b3a2f] transition-colors shadow-sm">Save Target</button>
          </div>
        </form>
      </div>
    </div>
  );
}