import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

export default function ClearDataModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#03241a]/45 backdrop-blur-sm animate-in fade-in" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-[400px] overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-[#fcedea] text-[#ba1a1a] flex items-center justify-center mb-4">
            <AlertTriangle size={24} />
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#1c1c19] mb-2">Clear All Data?</h2>
          <p className="text-[14px] text-[#727974] leading-relaxed">
            Are you absolutely sure? This will permanently delete your entire ledger, transactions, budgets, and emergency fund. This action cannot be undone.
          </p>
        </div>
        <div className="p-4 border-t border-[#eae6df] flex justify-end gap-3 bg-[#fcf9f4]">
          <button type="button" className="px-5 py-2.5 rounded-xl border border-[#eae6df] text-[13px] font-bold text-[#414845] hover:bg-[#f0ede9] transition-colors" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="px-5 py-2.5 rounded-xl bg-[#ba1a1a] text-white text-[13px] font-bold hover:bg-[#93000a] transition-colors shadow-md" onClick={() => { onConfirm(); onClose(); }}>
            Yes, Clear Everything
          </button>
        </div>
      </div>
    </div>
  );
}