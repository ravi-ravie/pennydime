import React, { useState } from 'react';
import { X, SlidersHorizontal, Trash2 } from 'lucide-react';

export default function AdjustPoolModal({ isOpen, onClose, pool, onSave, onDelete, currencySymbol = '₹' }) {
  const isEditing = !!pool;
  const [name, setName] = useState(pool?.name || '');
  const [allocated, setAllocated] = useState(pool?.allocated || '');
  const [category, setCategory] = useState(pool?.category || 'Travel');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ name, allocated: parseFloat(allocated) || 0, category });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#03241a]/45 backdrop-blur-sm animate-in fade-in" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-[420px] overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-[#eae6df]">
          <h2 className="font-serif text-xl font-bold text-[#03241a] flex items-center gap-2">
            <SlidersHorizontal size={20} className="text-[#1b3a2f]" /> {isEditing ? 'Edit Allowance Pool' : 'Create Allowance Pool'}
          </h2>
          <button className="text-[#727974] hover:bg-[#f0ede9] p-1.5 rounded-md transition-colors" onClick={onClose}><X size={20} /></button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="p-6 flex flex-col gap-5">
            
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#414845]">Pool Title</label>
              <input 
                type="text" 
                required 
                placeholder="e.g. Travel Allowance"
                className="w-full border-b-2 border-[#eae6df] bg-transparent py-2 text-[14px] font-medium focus:outline-none focus:border-[#1b3a2f] transition-colors" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#414845]">Linked Category</label>
              <select 
                className="w-full border-b-2 border-[#eae6df] bg-transparent py-2 text-[14px] font-medium focus:outline-none focus:border-[#1b3a2f] transition-colors"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Travel">Travel</option>
                <option value="Food & Dining">Food & Dining</option>
                <option value="Shopping">Shopping</option>
                <option value="Bills & Utilities">Bills & Utilities</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Housing">Housing</option>
              </select>
              <p className="text-[11px] text-[#727974] mt-1">Expenses in this category count towards this pool.</p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#414845]">Monthly Allocation ({currencySymbol})</label>
              <input 
                type="number" 
                step="any" 
                required 
                placeholder="5000"
                className="w-full border-b-2 border-[#eae6df] bg-transparent py-2 text-[16px] font-bold text-[#03241a] focus:outline-none focus:border-[#1b3a2f] transition-colors" 
                value={allocated} 
                onChange={(e) => setAllocated(e.target.value)} 
              />
            </div>

          </div>
          
          <div className="p-4 border-t border-[#eae6df] flex justify-between gap-3 bg-[#fcf9f4]">
            {isEditing ? (
              <button type="button" onClick={() => { onDelete(pool.id); onClose(); }} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[#ba1a1a] text-[13px] font-bold hover:bg-[#fcedea] transition-colors">
                <Trash2 size={16} /> Delete
              </button>
            ) : <div />}
            
            <div className="flex gap-2">
              <button type="button" className="px-5 py-2.5 rounded-xl border border-[#eae6df] text-[13px] font-bold text-[#414845] hover:bg-[#f0ede9] transition-colors" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="px-5 py-2.5 rounded-xl bg-[#03241a] text-white text-[13px] font-bold hover:bg-[#1b3a2f] transition-colors shadow-md">
                Save Pool
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}