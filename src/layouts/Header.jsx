import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, Plus, Calendar, ChevronDown, X } from 'lucide-react';

export default function Header({
  period,
  setPeriod,
  selectedMonth,
  setSelectedMonth,
  searchQuery,
  setSearchQuery,
  onOpenAddEntry,
  userProfile
}) {
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const dropdownRef = useRef(null);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const firstName = userProfile?.name ? userProfile.name.split(' ')[0] : 'Member';

  const monthOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return [
      `January ${currentYear}`, `February ${currentYear}`, `March ${currentYear}`, 
      `April ${currentYear}`, `May ${currentYear}`, `June ${currentYear}`, 
      `July ${currentYear}`, `August ${currentYear}`, `September ${currentYear}`, 
      `October ${currentYear}`, `November ${currentYear}`, `December ${currentYear}`
    ];
  }, []);

  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return [
      `Year ${currentYear - 2}`, `Year ${currentYear - 1}`, `Year ${currentYear}`, `Year ${currentYear + 1}`
    ];
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowMonthDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePeriodChange = (newPeriod) => {
    setPeriod(newPeriod);
    const currentYear = selectedMonth.split(' ').pop(); 
    if (newPeriod === 'Year') {
      setSelectedMonth(`Year ${currentYear}`);
    } else if (newPeriod === 'Month') {
      setSelectedMonth(`January ${currentYear}`);
    }
  };

  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      
      <div className="flex items-center gap-4 shrink-0">
        <div className="flex flex-col">
          <span className="text-[10px] md:text-[11px] font-bold tracking-wider text-[#727974] uppercase mb-0.5">
            REAL-TIME LEDGER ACTIVE
          </span>
          <h1 className="font-serif text-[24px] md:text-[28px] font-bold text-[#03241a] leading-tight">
            {getGreeting()}, {firstName}
          </h1>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-row items-center gap-2 md:gap-3 w-full md:w-auto mt-1 md:mt-0">
        
        {/* Toggle */}
        <div className="flex items-center bg-[#e5e2dd] p-1 rounded-full shrink-0">
          <button
            type="button"
            className={`px-2 md:px-4 py-1.5 rounded-full text-[11px] md:text-[13px] font-semibold transition-colors ${
              period === 'Month' ? 'bg-[#03241a] text-white shadow-sm' : 'text-[#414845] hover:text-[#1c1c19]'
            }`}
            onClick={() => handlePeriodChange('Month')}
          >
            Month
          </button>
          <button
            type="button"
            className={`px-2 md:px-4 py-1.5 rounded-full text-[11px] md:text-[13px] font-semibold transition-colors ${
              period === 'Year' ? 'bg-[#03241a] text-white shadow-sm' : 'text-[#414845] hover:text-[#1c1c19]'
            }`}
            onClick={() => handlePeriodChange('Year')}
          >
            Year
          </button>
        </div>

        {/* Date Dropdown */}
        <div className="relative shrink-0 flex-1 md:flex-none md:w-[140px] lg:w-[170px]" ref={dropdownRef}>
          <button
            type="button"
            className="flex items-center justify-between gap-1 bg-white border border-[#eae6df] px-2 md:px-4 py-1.5 md:py-2 rounded-full text-[11px] md:text-[13px] font-semibold text-[#1c1c19] shadow-sm hover:bg-[#f6f3ee] transition-colors w-full"
            onClick={() => setShowMonthDropdown(!showMonthDropdown)}
          >
            <div className="flex items-center gap-1 md:gap-2 whitespace-nowrap overflow-hidden">
              <Calendar size={12} className="text-[#a33e07] shrink-0 md:w-[14px] md:h-[14px]" />
              <span className="truncate">{selectedMonth}</span>
            </div>
            <ChevronDown size={12} className="text-[#727974] shrink-0 md:w-[14px] md:h-[14px]" />
          </button>

          {showMonthDropdown && (
            <div className="absolute top-full left-0 md:right-0 md:left-auto mt-2 w-[140px] md:w-full min-w-[140px] md:min-w-[170px] bg-white border border-[#eae6df] rounded-xl shadow-lg z-50 overflow-hidden py-1">
              {(period === 'Month' ? monthOptions : yearOptions).map((m) => (
                <button
                  key={m}
                  type="button"
                  className={`w-full text-left px-3 py-2 text-[12px] md:text-[13px] font-medium transition-colors ${
                    m === selectedMonth ? 'bg-[#f0ede9] text-[#03241a]' : 'text-[#414845] hover:bg-[#f6f3ee] hover:text-[#1c1c19]'
                  }`}
                  onClick={() => {
                    setSelectedMonth(m);
                    setShowMonthDropdown(false);
                  }}
                >
                  {m}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="hidden md:flex items-center bg-[#f6f3ee] border border-[#eae6df] rounded-full px-3 lg:px-4 py-1.5 lg:py-2 w-[160px] lg:w-[220px] focus-within:bg-white focus-within:border-[#456558] transition-colors shrink-0">
          <Search size={14} className="text-[#727974] mr-2 shrink-0" />
          <input
            type="text"
            className="bg-transparent border-none outline-none text-[12px] lg:text-[13px] text-[#1c1c19] w-full placeholder-[#727974]"
            placeholder="Search ledger..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <button
          type="button"
          className="md:hidden flex items-center justify-center w-8 h-8 rounded-full bg-[#f0ede9] text-[#414845] shrink-0 ml-auto"
          onClick={() => setShowMobileSearch(!showMobileSearch)}
        >
          {showMobileSearch ? <X size={16} /> : <Search size={16} />}
        </button>

        <button
          type="button"
          className="hidden lg:flex items-center gap-2 bg-[#03241a] text-white px-4 lg:px-5 py-2 lg:py-2.5 rounded-full text-[12px] lg:text-[13px] font-bold shadow-md hover:bg-[#1b3a2f] hover:-translate-y-0.5 transition-all shrink-0 ml-1"
          onClick={onOpenAddEntry}
        >
          <Plus size={16} strokeWidth={2.5} />
          <span>Add Entry</span>
          <span className="hidden lg:flex items-center gap-1 text-[10px] bg-white/20 px-1.5 py-0.5 rounded-md ml-1">
            <span className="font-bold text-white">CR</span>
            <span className="text-white/60">/</span>
            <span className="font-bold text-[#ffb598]">DR</span>
          </span>
        </button>
      </div>

      {/* Mobile Search Expanded (< md) */}
      {showMobileSearch && (
        <div className="md:hidden w-full mt-2 flex items-center bg-white border border-[#eae6df] rounded-xl px-3 py-2 shadow-sm animate-in fade-in slide-in-from-top-2">
          <Search size={14} className="text-[#727974] mr-2 shrink-0" />
          <input
            type="text"
            className="bg-transparent border-none outline-none text-[13px] text-[#1c1c19] w-full placeholder-[#727974]"
            placeholder="Search ledger..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
        </div>
      )}
    </header>
  );
}