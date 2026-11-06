import React from 'react';
import { LogOut } from 'lucide-react';
import UserProfileCard from '../../components/settings/UserProfileCard';
import PreferencesCard from '../../components/settings/PreferencesCard';

export default function SettingsPage({
  userProfile,
  setUserProfile,
  currencySymbol,
  setCurrencySymbol,
  startingBalance,
  setStartingBalance,
  transactions,
  onResetData,
  showToast,
  onLogout
}) {
  return (
    <div className="flex flex-col w-full relative pb-10 max-w-[1100px] mx-auto">
      
      <div className="flex flex-col mb-6 md:mb-8 pt-2">
        <h1 className="font-serif text-[32px] md:text-[42px] font-bold text-[#03241a] leading-tight tracking-tight mb-1">Settings & Preferences</h1>
        <p className="text-[13px] md:text-[15px] text-[#727974]">Configure your ledger environment, currency, and data backups.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 items-start">
        <UserProfileCard
          userProfile={userProfile}
          setUserProfile={setUserProfile}
          startingBalance={startingBalance}
          setStartingBalance={setStartingBalance}
          showToast={showToast}
        />

        <PreferencesCard
          currencySymbol={currencySymbol}
          setCurrencySymbol={setCurrencySymbol}
          transactions={transactions}
          userProfile={userProfile}
          startingBalance={startingBalance}
          onResetData={onResetData}
          showToast={showToast}
        />
      </div>

      {onLogout && (
        <div className="mt-6 bg-white border border-[#eae6df] rounded-2xl p-5 md:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-[18px] md:text-xl font-bold text-[#03241a]">Account Session</h2>
            <p className="text-[13px] text-[#727974] mt-1">Securely sign out of your account on this device.</p>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center justify-center gap-2 w-full md:w-auto px-5 py-2.5 rounded-xl bg-[#fcedea] text-[#ba1a1a] text-[13px] font-bold hover:bg-[#fddbd6] transition-colors shadow-sm"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      )}

    </div>
  );
}