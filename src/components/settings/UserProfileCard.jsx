import React, { useState, useEffect } from 'react';
import { User } from 'lucide-react';

export default function UserProfileCard({
  userProfile,
  currentUser,
  setUserProfile,
  startingBalance,
  setStartingBalance,
  showToast
}) {
  const initialName = userProfile?.name && userProfile.name !== 'Ledger User' ? userProfile.name : (currentUser?.name || '');
  const initialEmail = currentUser?.email || userProfile?.email || '';

  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [startBal, setStartBal] = useState(startingBalance || 0);

  // This effect fixes the mobile timing issue
  useEffect(() => {
    if (!name && initialName) setName(initialName);
    if (!email && initialEmail) setEmail(initialEmail);
  }, [initialName, initialEmail, name, email]);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setUserProfile({ ...userProfile, name, email });
    setStartingBalance(parseFloat(startBal) || 0);
    showToast('Settings and profile updated successfully');
  };

  return (
    <div className="bg-white border border-[#eae6df] rounded-2xl p-5 md:p-8 shadow-sm">
      <div className="flex items-center gap-2 mb-4 md:mb-6">
        <User size={18} className="md:w-5 md:h-5 text-[#03241a]" />
        <h2 className="font-serif text-[18px] md:text-xl font-bold text-[#03241a]">User Account</h2>
      </div>

      <form onSubmit={handleSaveProfile} className="flex flex-col gap-4 md:gap-5">
        <div className="flex flex-col gap-1 md:gap-1.5">
          <label className="text-[10px] md:text-[11px] font-bold tracking-wider text-[#414845] uppercase">Full Name</label>
          <input
            type="text"
            required
            className="w-full border-b-2 border-[#eae6df] bg-transparent py-1.5 md:py-2 text-[13px] md:text-[14px] font-medium focus:outline-none focus:border-[#1b3a2f] transition-colors"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1 md:gap-1.5">
          <label className="text-[10px] md:text-[11px] font-bold tracking-wider text-[#414845] uppercase">Email Address</label>
          <input
            type="email"
            disabled
            readOnly
            className="w-full border-b-2 border-[#eae6df] bg-transparent py-1.5 md:py-2 text-[13px] md:text-[14px] font-medium text-[#727974] opacity-70 cursor-not-allowed"
            value={email}
            placeholder="Authenticated via Google"
          />
        </div>

        <div className="flex flex-col gap-1 md:gap-1.5">
          <label className="text-[10px] md:text-[11px] font-bold tracking-wider text-[#414845] uppercase">Baseline Starting Balance</label>
          <input
            type="number"
            step="any"
            disabled
            readOnly
            className="w-full border-b-2 border-[#eae6df] bg-transparent py-1.5 md:py-2 text-[13px] md:text-[14px] font-bold text-[#727974] opacity-70 cursor-not-allowed"
            value={startBal}
          />
        </div>

        <div className="mt-2 md:mt-4">
          <button type="submit" className="px-5 md:px-6 py-2 md:py-2.5 rounded-xl bg-[#03241a] text-white text-[12px] md:text-[13px] font-bold hover:bg-[#1b3a2f] transition-colors shadow-md">
            Save Account Details
          </button>
        </div>
      </form>
    </div>
  );
}