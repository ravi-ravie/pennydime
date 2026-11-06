import React from 'react';
import {
  LayoutDashboard,
  ReceiptText,
  PieChart,
  BarChart3,
  Settings,
  Plus
} from 'lucide-react';

export default function MobileNav({
  currentRoute,
  setCurrentRoute,
  onOpenAddEntry,
  userProfile,
  currentUser
}) {
  const displayAvatar = userProfile?.avatar || currentUser?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(userProfile?.name || 'User')}&backgroundColor=03241a&textColor=ffffff`;

  const tabs = [
    { id: 'dashboard', label: 'DASH', icon: LayoutDashboard },
    { id: 'transactions', label: 'TRANS', icon: ReceiptText },
    { id: 'budgets', label: 'BUDGET', icon: PieChart },
    { id: 'reports', label: 'CHART', icon: BarChart3 },
  ];

  return (
    <>
      <button
        type="button"
        className="lg:hidden fixed bottom-24 right-6 w-14 h-14 bg-[#a33e07] text-white rounded-full flex items-center justify-center shadow-xl z-[80] hover:bg-[#8b3506] transition-colors active:scale-95"
        onClick={onOpenAddEntry}
        aria-label="Add Ledger Entry"
      >
        <Plus size={28} strokeWidth={2.5} />
      </button>

      <nav className="lg:hidden fixed bottom-0 left-0 w-full h-[68px] bg-[#fcf9f4] border-t border-[#eae6df] flex items-center justify-around px-2 z-[75] shadow-[0_-4px_16px_rgba(0,0,0,0.04)] pb-safe">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentRoute === tab.id;
          return (
            <button
              type="button"
              key={tab.id}
              className={`flex flex-col items-center justify-center gap-1 p-2 transition-colors ${
                isActive ? 'text-[#03241a]' : 'text-[#727974] hover:text-[#1c1c19]'
              }`}
              onClick={() => setCurrentRoute(tab.id)}
            >
              <div className={`h-8 w-12 flex items-center justify-center rounded-xl transition-colors ${isActive ? 'bg-[#eaf5f0]' : ''}`}>
                <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
              </div>
              <span className="text-[10px] font-bold tracking-wider">{tab.label}</span>
            </button>
          );
        })}
        
        <button
          type="button"
          className={`flex flex-col items-center justify-center gap-1 p-2 transition-colors ${
            currentRoute === 'settings' ? 'text-[#03241a]' : 'text-[#727974] hover:text-[#1c1c19]'
          }`}
          onClick={() => setCurrentRoute('settings')}
        >
          <div className={`h-8 w-12 flex items-center justify-center rounded-xl transition-colors ${currentRoute === 'settings' ? 'bg-[#eaf5f0]' : ''}`}>
            {displayAvatar ? (
              <img src={displayAvatar} alt="Profile" className="w-5 h-5 rounded-full object-cover border border-[#03241a]" />
            ) : (
              <Settings size={20} strokeWidth={currentRoute === 'settings' ? 2.5 : 1.8} />
            )}
          </div>
          <span className="text-[10px] font-bold tracking-wider">YOU</span>
        </button>
      </nav>
    </>
  );
}