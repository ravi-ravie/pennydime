import React, { useState, useEffect, useMemo, useRef } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase';
import Sidebar from './layouts/Sidebar';
import Header from './layouts/Header';
import MobileNav from './layouts/MobileNav';
import AddEntryModal from './components/common/AddEntryModal';
import AuthPage from './pages/auth/AuthPage';
import AppRoutes, { VALID_ROUTES } from './routes/AppRoutes';
import SetStartingModal from './components/dashboard/SetStartingModal';
import ReconcileModal from './components/dashboard/ReconcileModal';
import AdjustPoolModal from './components/dashboard/AdjustPoolModal';
import AdjustBudgetModal from './components/budget/AdjustBudgetModal';
import SetMilestoneModal from './components/dashboard/SetMilestoneModal';
import MilestoneDetailModal from './components/dashboard/MilestoneDetailModal';
import { defaultCategories, sampleDemoTransactions } from './data/initialData';
import { useFirestore } from './hooks/useFirestore';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const hasSyncedProfile = useRef(false);

  const [currentRoute, setCurrentRouteState] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    if (VALID_ROUTES.includes(hash)) return hash;
    return 'dashboard';
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [period, setPeriod] = useState('Year'); 
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const currentYear = new Date().getFullYear();
    return `Year ${currentYear}`;
  });
  const [searchQuery, setSearchQuery] = useState('');
  
  const userId = currentUser?.uid || null;
  
  const [startingBalance, setStartingBalance] = useFirestore('startingBalance', 0, userId);
  const [milestoneTarget, setMilestoneTarget] = useFirestore('milestoneTarget', 0, userId);
  const [emergencyFund, setEmergencyFund] = useFirestore('emergencyFund', 0, userId);
  const [isFundLocked, setIsFundLocked] = useFirestore('isFundLocked', true, userId);
  const [currencySymbol, setCurrencySymbol] = useFirestore('currencySymbol', '₹', userId);
  
  const [userProfile, setUserProfile] = useFirestore('userProfile', {
    name: 'Ledger User',
    email: '',
    tier: 'Private Ledger Member',
    avatar: ''
  }, userId);

  const [allowancePools, setAllowancePools] = useFirestore('allowancePools', [], userId);
  const [budgetGoals, setBudgetGoals] = useFirestore('budgetGoals', defaultCategories, userId);
  const [upcomingAdjustments, setUpcomingAdjustments] = useFirestore('upcomingAdjustments', [], userId);
  const [transactions, setTransactions] = useFirestore('transactions', [], userId);

  const [isAddEntryOpen, setIsAddEntryOpen] = useState(false);
  const [isSetStartingOpen, setIsSetStartingOpen] = useState(false);
  const [isReconcileOpen, setIsReconcileOpen] = useState(false);
  const [isAdjustPoolOpen, setIsAdjustPoolOpen] = useState(false);
  const [activePool, setActivePool] = useState(null);
  const [isMilestoneOpen, setIsMilestoneOpen] = useState(false); 
  const [isAdjustTargetOpen, setIsAdjustTargetOpen] = useState(false);
  const [activeAdjustBudget, setActiveAdjustBudget] = useState(null);
  const [toasts, setToasts] = useState([]);

    useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userData = {
          uid: user.uid,
          name: user.displayName || user.email.split('@')[0],
          email: user.email,
          avatar: user.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.email)}&backgroundColor=03241a&textColor=ffffff`,
          tier: 'Sovereign Ledger Member'
        };
        setCurrentUser(userData);
        setUserProfile(userData);
      } else {
        setCurrentUser(null);
        window.location.hash = ''; 
      }
      setIsAuthLoading(false); 
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (VALID_ROUTES.includes(hash)) setCurrentRouteState(hash);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const setCurrentRoute = (route) => {
    setCurrentRouteState(route);
    if (currentUser) window.location.hash = route;
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showToast = (message) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  };

  const handleLogout = async () => { 
    try {
      await signOut(auth);
      window.location.hash = ''; 
      setCurrentRouteState('dashboard');
      showToast('You have been securely signed out.'); 
    } catch (err) {
      console.error(err);
    }
  };

  const monthlyTransactions = useMemo(() => {
    return transactions.filter((t) => {
      if (!t.date) return true;
      const txDate = new Date(t.date);
      if (period === 'Month') {
        return txDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) === selectedMonth;
      } else {
        const selectedYear = selectedMonth.replace('Year ', '');
        return txDate.getFullYear().toString() === selectedYear;
      }
    });
  }, [transactions, period, selectedMonth]);

  const filteredTransactions = useMemo(() => {
    return monthlyTransactions.filter((t) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return t.title?.toLowerCase().includes(q) || t.category?.toLowerCase().includes(q) || t.note?.toLowerCase().includes(q);
      }
      return true;
    });
  }, [monthlyTransactions, searchQuery]);

  const lifetimeCR = transactions.filter(t => t.type === 'CR').reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  const lifetimeDR = transactions.filter(t => t.type === 'DR').reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  const lifetimeCalculatedBalance = (Number(startingBalance) || 0) + lifetimeCR - lifetimeDR;

  const crTransactions = useMemo(() => monthlyTransactions.filter((t) => t.type === 'CR'), [monthlyTransactions]);
  const drTransactions = useMemo(() => monthlyTransactions.filter((t) => t.type === 'DR'), [monthlyTransactions]);
  const totalCR = useMemo(() => crTransactions.reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0), [crTransactions]);
  const totalDR = useMemo(() => drTransactions.reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0), [drTransactions]);
  
  const currentCalculatedBalance = 
    (parseFloat(startingBalance) || 0) + 
    (parseFloat(totalCR) || 0) - 
    (parseFloat(totalDR) || 0);

  const dynamicallyComputedBudgets = useMemo(() => {
    return budgetGoals.map((b) => {
      const actualSpent = drTransactions.filter((t) => t.category.toLowerCase() === b.category.toLowerCase()).reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);
      return { ...b, spent: actualSpent };
    });
  }, [budgetGoals, drTransactions]);

  const dynamicallyComputedPools = useMemo(() => {
    return allowancePools.map(pool => {
      const actualSpent = drTransactions.filter(t => {
        if (t.allowancePool !== pool.id) return false;
        if (pool.createdAt) {
          const txDate = new Date(t.date).getTime();
          const poolDate = new Date(pool.createdAt).getTime();
          if (txDate < poolDate) return false;
        }
        return true;
      }).reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);
      
      return { ...pool, spent: actualSpent };
    });
  }, [allowancePools, drTransactions]);

  const handleAddEntry = (newEntry) => {
    if (newEntry.type === 'DR' && Number(newEntry.amount) > Number(lifetimeCalculatedBalance)) {
      showToast('Insufficient balance to record this expense.');
      return;
    }

    const formattedDate = newEntry.date || new Date().toISOString().split('T')[0];
    const displayDate = new Date(formattedDate).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });

    const entryToSave = {
      ...newEntry,
      date: formattedDate,
      displayDate,
      runningBal: 0
    };

    const newTransactionsArray = [entryToSave, ...transactions];
    
    setTransactions(newTransactionsArray);
    showToast(`Recorded ${newEntry.type}: ${newEntry.title}`);
  };

  const handleReconcile = (statementBalance) => {
    const diff = statementBalance - currentCalculatedBalance;
    if (Math.abs(diff) < 0.01) {
      showToast('Ledger already matches statement.');
      return;
    }

    const newTx = {
      id: 'tx-' + Date.now(),
      title: 'Reconciliation Adjustment',
      type: diff > 0 ? 'CR' : 'DR',
      category: 'Adjustment',
      amount: Math.abs(diff),
      date: new Date().toISOString().split('T')[0],
      displayDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      note: 'Auto-generated balance correction',
      method: 'System',
      isReconciled: true
    };

    handleAddEntry(newTx);
    showToast('Ledger reconciled successfully.');
  };

  const handleSetStartingBalance = (newBal) => {
    const currentTotalWithoutStarting = totalCR - totalDR;
    const adjustedStartingBalance = newBal - currentTotalWithoutStarting;
    
    setStartingBalance(adjustedStartingBalance);
    showToast(`Total balance reset to ${currencySymbol}${newBal}`);
  };

  const handleContributeMilestone = (amount) => {
    if (amount > lifetimeCalculatedBalance) {
      showToast('Insufficient available balance to contribute');
      return;
    }
    
    const newTx = {
      id: 'tx-' + Date.now(),
      title: 'Transfer to Emergency Fund',
      type: 'DR',
      category: 'Savings',
      amount: amount,
      date: new Date().toISOString().split('T')[0],
      displayDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      note: 'Milestone Contribution',
      method: 'Internal Transfer',
      isReconciled: true
    };
    
    handleAddEntry(newTx);
    setEmergencyFund((prev) => prev + amount);
  };

  const handleWithdrawMilestone = (amount) => {
    if (isFundLocked) {
      showToast('Fund is locked. Disable the safeguard to withdraw.');
      return;
    }
    if (amount > emergencyFund) {
      showToast('Cannot withdraw more than the fund balance');
      return;
    }
    
    setEmergencyFund((prev) => Math.max(0, prev - amount));
    
    const newTx = {
      id: 'tx-' + Date.now(),
      title: 'Withdrawal from Emergency Fund',
      type: 'CR',
      category: 'Savings',
      amount: amount,
      date: new Date().toISOString().split('T')[0],
      displayDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      note: 'Milestone Withdrawal',
      method: 'Internal Transfer',
      isReconciled: true
    };
    
    handleAddEntry(newTx);
  };

  const handleSavePool = (poolData) => {
    if (activePool) {
      setAllowancePools(prev => prev.map(p => p.id === activePool.id ? { ...poolData, id: activePool.id, createdAt: activePool.createdAt } : p));
      showToast(`Pool updated: ${poolData.name}`);
    } else {
      if (allowancePools.length >= 3) return showToast('Maximum of 3 pools allowed');
      const newPool = { ...poolData, id: 'pool-' + Date.now(), createdAt: new Date().toISOString() };
      setAllowancePools(prev => [...prev, newPool]);
      showToast(`Pool created: ${poolData.name}`);
    }
    setActivePool(null);
  };

  const handleDeletePool = (poolId) => {
    setAllowancePools(prev => prev.filter(p => p.id !== poolId));
    showToast('Pool removed');
  };

  const handleToggleReconciled = (txId) => {
    setTransactions((prev) => prev.map((t) => {
      if (t.id === txId) {
        const nextState = !t.isReconciled;
        showToast(nextState ? `Reconciled: ${t.title}` : `Marked uncertified: ${t.title}`);
        return { ...t, isReconciled: nextState };
      }
      return t;
    }));
  };

  const handleDeleteTransaction = (txId) => { 
    setTransactions((prev) => prev.filter((t) => t.id !== txId)); 
    showToast('Transaction entry deleted'); 
  };
  
  const handleAcceptAdjustment = (adjId) => { 
    setUpcomingAdjustments((prev) => prev.map((adj) => adj.id === adjId ? { ...adj, accepted: !adj.accepted } : adj)); 
  };
  
  const handleReconcileCategory = (catName) => { 
    showToast(`Category "${catName}" reconciled against statement`); 
  };
  
  const handleResetData = () => { 
    setStartingBalance(0); 
    setMilestoneTarget(0); 
    setEmergencyFund(0); 
    setIsFundLocked(true); 
    setTransactions([]); 
    setBudgetGoals(defaultCategories.map((c) => ({ ...c, spent: 0 }))); 
    setAllowancePools([]); 
    setUpcomingAdjustments([]); 
    showToast('Real ledger cleared to pristine zero state'); 
  };
  
  const handleLoadSampleDemo = () => { 
    setStartingBalance(20000); 
    setTransactions(sampleDemoTransactions || []); 
    showToast('Optional sample entries loaded'); 
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-[#fcf9f4] flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#03241a] border-t-transparent rounded-full animate-spin mb-4" />
        <span className="font-serif text-[#03241a] font-bold text-lg">Verifying secure session...</span>
      </div>
    );
  }

  if (!currentUser) return <AuthPage />;

  return (
    <div className="flex bg-[#fcf9f4] min-h-screen font-sans text-[#1c1c19]">
      <Sidebar currentRoute={currentRoute} setCurrentRoute={setCurrentRoute} userProfile={userProfile} currentUser={currentUser} isMobileOpen={isMobileMenuOpen} onCloseMobile={() => setIsMobileMenuOpen(false)} onLogout={handleLogout} />
      
      <main className="flex-1 min-h-screen bg-[#fcf9f4] lg:ml-[260px] w-full lg:w-[calc(100%-260px)] pb-24 lg:pb-0">
        <div className="max-w-[1200px] mx-auto px-4 py-6 md:px-8 md:py-8">
          <Header 
            period={period} setPeriod={setPeriod} 
            selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth} 
            searchQuery={searchQuery} setSearchQuery={setSearchQuery} 
            onOpenAddEntry={() => setIsAddEntryOpen(true)} 
            currentRoute={currentRoute} 
            onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            userProfile={userProfile} 
          />
          
          <AppRoutes
            currentRoute={currentRoute}
            startingBalance={startingBalance}
            transactions={filteredTransactions}
            allTransactions={transactions}
            monthlyTransactions={monthlyTransactions}
            allowancePools={dynamicallyComputedPools}
            currencySymbol={currencySymbol}
            onOpenSetStarting={() => setIsSetStartingOpen(true)}
            onOpenReconcile={() => setIsReconcileOpen(true)}
            onOpenAdjustPool={(pool) => { setActivePool(pool || null); setIsAdjustPoolOpen(true); }}
            onOpenSetMilestone={() => setIsMilestoneOpen(true)} 
            onNavigateToTransactions={() => setCurrentRoute('transactions')}
            onOpenAddEntry={() => setIsAddEntryOpen(true)}
            searchQuery={searchQuery}
            onToggleReconciled={handleToggleReconciled}
            onDeleteTransaction={handleDeleteTransaction}
            dynamicallyComputedBudgets={dynamicallyComputedBudgets}
            upcomingAdjustments={upcomingAdjustments}
            onOpenAdjustBudget={(budget) => setActiveAdjustBudget(budget)}
            onAcceptAdjustment={handleAcceptAdjustment}
            onReconcileCategory={handleReconcileCategory}
            onAddAllowancePool={() => { setActivePool(null); setIsAdjustPoolOpen(true); }}
            onDeletePool={handleDeletePool}
            userProfile={userProfile}
            setUserProfile={setUserProfile}
            setCurrencySymbol={setCurrencySymbol}
            setStartingBalance={setStartingBalance}
            onResetData={handleResetData}
            onLoadSampleDemo={handleLoadSampleDemo}
            onLogout={handleLogout}
            showToast={showToast}
            milestoneTarget={milestoneTarget}
            emergencyFund={emergencyFund}
          />
        </div>
      </main>

      <MobileNav currentRoute={currentRoute} setCurrentRoute={setCurrentRoute} onOpenAddEntry={() => setIsAddEntryOpen(true)} />
      
      <AddEntryModal 
        isOpen={isAddEntryOpen} 
        onClose={() => setIsAddEntryOpen(false)} 
        onAddEntry={handleAddEntry} 
        currencySymbol={currencySymbol} 
        allowancePools={dynamicallyComputedPools} 
        currentBalance={lifetimeCalculatedBalance} 
      />
      
      <SetStartingModal isOpen={isSetStartingOpen} onClose={() => setIsSetStartingOpen(false)} startingBalance={startingBalance} onSave={handleSetStartingBalance} currencySymbol={currencySymbol} />
      
      <ReconcileModal isOpen={isReconcileOpen} onClose={() => setIsReconcileOpen(false)} currentBalance={currentCalculatedBalance} onReconciled={handleReconcile} currencySymbol={currencySymbol} />

      <MilestoneDetailModal 
        isOpen={isMilestoneOpen} 
        onClose={() => setIsMilestoneOpen(false)} 
        targetAmount={milestoneTarget}
        currentBalance={emergencyFund}
        availableBalance={lifetimeCalculatedBalance}
        isLocked={isFundLocked}
        onToggleLock={() => setIsFundLocked(!isFundLocked)}
        currencySymbol={currencySymbol}
        onContribute={handleContributeMilestone}
        onWithdraw={handleWithdrawMilestone}
        onAdjustTarget={() => { setIsMilestoneOpen(false); setTimeout(() => setIsAdjustTargetOpen(true), 100); }}
      />

      <SetMilestoneModal 
        isOpen={isAdjustTargetOpen} 
        onClose={() => setIsAdjustTargetOpen(false)} 
        currentTarget={milestoneTarget} 
        onSave={(target) => { setMilestoneTarget(target); setIsAdjustTargetOpen(false); showToast(`Milestone target set`); }} 
        currencySymbol={currencySymbol} 
      />

      <AdjustPoolModal 
        isOpen={isAdjustPoolOpen} 
        onClose={() => { setIsAdjustPoolOpen(false); setActivePool(null); }} 
        pool={activePool} 
        onSave={handleSavePool} 
        onDelete={handleDeletePool}
        currencySymbol={currencySymbol} 
      />
      
      <AdjustBudgetModal isOpen={activeAdjustBudget !== null} onClose={() => setActiveAdjustBudget(null)} budget={activeAdjustBudget} onSave={(updatedBudget) => { setBudgetGoals((prev) => prev.map((b) => (b.id === updatedBudget.id ? updatedBudget : b))); showToast(`Budget limit updated`); }} currencySymbol={currencySymbol} />

      <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div key={t.id} className="bg-[#03241a] text-white px-5 py-3 rounded-xl shadow-xl text-[13px] font-medium animate-in slide-in-from-right-8 fade-in">
            {t.message}
          </div>
        ))}
      </div>
    </div>
  );
}