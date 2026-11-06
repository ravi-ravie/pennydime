/**
 * Real Sovereign Data Model for PennyDime
 * Zero fake transactions by default - clean, real double-entry books.
 */

const getInitialCurrentMonth = () => {
  const now = new Date();
  return now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
};

export const defaultCategories = [
  { id: 'b-1', category: 'Housing', type: 'Fixed Expense', allocated: 0, status: 'normal' },
  { id: 'b-2', category: 'Food & Dining', type: 'Variable Budget', allocated: 0, status: 'normal' },
  { id: 'b-3', category: 'Bills & Utilities', type: 'Fixed Expense', allocated: 0, status: 'normal' },
  { id: 'b-4', category: 'Travel', type: 'Discretionary', allocated: 0, status: 'normal' },
  { id: 'b-5', category: 'Shopping', type: 'Discretionary', allocated: 0, status: 'normal' },
  { id: 'b-6', category: 'Entertainment', type: 'Discretionary', allocated: 0, status: 'normal' },
  { id: 'b-7', category: 'Others', type: 'Variable Budget', allocated: 0, status: 'normal' }
];

export const initialRealData = {
  startingBalance: 0,
  currencySymbol: '₹',
  selectedPeriod: 'Month',
  selectedMonth: getInitialCurrentMonth(),
  userProfile: {
    name: '',
    email: '',
    tier: 'Private Ledger Member',
    avatar: ''
  },
  allowancePool: {
    id: 'pool-1',
    name: 'Travel & Discretionary Pool',
    category: 'Travel',
    allocated: 5000,
    spent: 0,
    reconcileDate: 'End of Month',
    warningThreshold: 75
  },
  budgetGoals: defaultCategories.map((c) => ({ ...c, spent: 0 })),
  upcomingAdjustments: [],
  transactions: [] // Pristine empty transactions array! Real user entries only.
};

// Backwards-compatibility alias
export const initialData = initialRealData;

// Sample demo pack strictly for optional testing in Settings
export const sampleDemoTransactions = [
  {
    id: 'tx-sample-1',
    title: 'Salary Deposit / Client Retainer',
    type: 'CR',
    category: 'Salary',
    amount: 55000,
    date: new Date().toISOString().split('T')[0],
    displayDate: 'Today',
    note: 'Direct Bank Transfer',
    method: 'Direct IMPS',
    isReconciled: true,
    runningBal: 55000
  },
  {
    id: 'tx-sample-2',
    title: 'Organic Grocery & Fresh Market',
    type: 'DR',
    category: 'Food & Dining',
    amount: 2450,
    date: new Date().toISOString().split('T')[0],
    displayDate: 'Today',
    note: 'UPI Payment',
    method: 'UPI HDFC',
    isReconciled: true,
    runningBal: 52550
  },
  {
    id: 'tx-sample-3',
    title: 'High-speed Fiber Internet & Utility',
    type: 'DR',
    category: 'Bills & Utilities',
    amount: 1499,
    date: new Date().toISOString().split('T')[0],
    displayDate: 'Yesterday',
    note: 'Auto-Debit BBPS',
    method: 'Auto-Debit',
    isReconciled: true,
    runningBal: 51051
  }
];
