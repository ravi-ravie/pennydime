import React from 'react';
import { formatCurrencyInteger } from '../../utils/formatters';

export default function MilestoneCard({ 
  currentBalance = 0, 
  targetAmount = 0, 
  currencySymbol = '₹', 
  onOpenSetMilestone
}) {
  const hasTarget = targetAmount > 0;
  const pct = hasTarget ? Math.min(100, (currentBalance / targetAmount) * 100) : 0;
  
  return (
    <div 
      className="relative rounded-2xl overflow-hidden flex flex-col justify-end p-7 shadow-md min-h-[220px] border border-[#eae6df] bg-[#1b3a2f] cursor-pointer group"
      onClick={onOpenSetMilestone}
    >
      <img src="/compass.jpg" alt="Compass" className="absolute inset-0 w-full h-full object-cover brightness-75 contrast-125 transition-transform duration-500 group-hover:scale-105" onError={(e) => { e.currentTarget.src = 'https://lh3.googleusercontent.com/aida-public/AB6AXuC7Z3i3qt5kuODQZCcjUeryZhl8QgAWiYTgfSVZNyayGqwcClADrAp-P9KBwwzFe_JPG1SuyzGcA45Q7wfktbnX8-XKPxpCsC8NBQBv0PJikKko4HBt0LFUL0T6cZZ09gRMjJjAD-hNwK6y-z-uGtWzjWMHQvqj4nG9GlcfFZc669ohDThPeEl-OZxwdXIWnIVeS4lIKXIYQyrdALa6X8pE3eBahwmxGkHmBtAR3rQhXCu6fCgJkl8S3w'; }} />
      <div className="absolute inset-0 bg-gradient-to-t from-[#03241a]/90 to-transparent pointer-events-none" />
      
      <div className="relative z-10 text-white">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider opacity-85 block">Emergency Fund Reserve</span>
        </div>
        <h2 className="font-serif text-2xl font-bold leading-tight mb-3">{hasTarget ? 'Emergency Fund' : 'Set a Target'}</h2>
        
        <div className="w-full h-1.5 bg-white/30 rounded-full overflow-hidden mb-2">
          <div className="h-full bg-white rounded-full transition-all duration-300" style={{ width: `${pct}%` }} />
        </div>
        
        <div className="flex justify-between text-[11px] font-medium opacity-90">
          <span>Target: {hasTarget ? formatCurrencyInteger(targetAmount, currencySymbol) : '—'}</span>
          <span>{pct.toFixed(0)}% Accumulated</span>
        </div>
      </div>
    </div>
  );
}