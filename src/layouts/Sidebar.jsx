import React, { useState } from 'react';
import {
  LayoutDashboard,
  ReceiptText,
  PieChart,
  BarChart3,
  Settings,
  CheckCircle2,
  LogOut
} from 'lucide-react';
import PennyDimeLogo from './PennyDimeLogo';

export default function Sidebar({
  currentRoute,
  setCurrentRoute,
  userProfile,
  currentUser,
  onLogout
}) {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions', icon: ReceiptText },
    { id: 'budgets', label: 'Budgets', icon: PieChart },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const handleNavClick = (routeId) => {
    setCurrentRoute(routeId);
  };

  const isValidProfile = userProfile?.name && userProfile.name !== 'Ledger User';

  const displayName = isValidProfile ? userProfile.name : (currentUser?.name || 'Ledger User');
  const displayEmail = isValidProfile ? userProfile.email : (currentUser?.email || 'Authenticated User');
  const displayAvatar = isValidProfile ? userProfile.avatar : (currentUser?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(displayName)}&backgroundColor=03241a&textColor=ffffff`);

  return (
    <aside className="hidden lg:flex fixed top-0 left-0 h-screen w-[260px] bg-[#fcf9f4] border-r border-[#eae6df] flex-col justify-between py-6 px-4 z-[100]">
      <div>
        <div className="flex items-center justify-between pb-7 px-3">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => handleNavClick('dashboard')}
          >
            <div className="w-9 h-9 rounded-lg bg-white border border-[#eae6df] flex items-center justify-center shadow-sm">
              <PennyDimeLogo size={32} />
            </div>
            <span className="font-serif text-[22px] font-bold text-[#03241a] tracking-tight">
              PennyDime
            </span>
          </div>
        </div>

        <nav className="flex flex-col gap-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentRoute === item.id;
            return (
              <button
                key={item.id}
                type="button"
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-[14px] font-medium transition-all duration-200 text-left
                  ${
                    isActive
                      ? 'bg-[#1b3a2f] text-white shadow-md'
                      : 'text-[#414845] hover:bg-[#f0ede9] hover:text-[#1c1c19]'
                  }
                `}
                onClick={() => handleNavClick(item.id)}
              >
                <Icon size={18} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'text-white' : 'text-[#414845]'} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="relative">
        {isProfileMenuOpen && (
          <div className="absolute bottom-full left-0 w-full mb-2 bg-white border border-[#eae6df] rounded-xl shadow-lg overflow-hidden animate-in fade-in slide-in-from-bottom-2 z-50">
            <button
              type="button"
              className="w-full flex items-center gap-3 px-4 py-3 text-[13px] font-semibold text-[#ba1a1a] hover:bg-[#fcedea] transition-colors"
              onClick={() => {
                setIsProfileMenuOpen(false);
                onLogout();
              }}
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </div>
        )}

        <button
          type="button"
          className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left w-full group ${
            isProfileMenuOpen 
              ? 'bg-[#f0ede9] border-[#eae6df]' 
              : 'border-transparent hover:bg-[#f0ede9] hover:border-[#eae6df]'
          }`}
          onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
          title="Account Settings"
        >
          <img
            src={displayAvatar}
            alt={displayName}
            className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm shrink-0"
            onError={(e) => {
              e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(displayName)}&backgroundColor=03241a&textColor=ffffff`;
            }}
          />
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1">
              <span className="text-[14px] font-bold text-[#1c1c19] truncate">
                {displayName}
              </span>
              <CheckCircle2 size={13} className="text-[#1b3a2f] shrink-0" />
            </div>
            <span className="text-[12px] text-[#727974] truncate">
              {displayEmail}
            </span>
          </div>
        </button>
      </div>
    </aside>
  );
}