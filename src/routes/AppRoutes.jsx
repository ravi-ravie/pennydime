import React from 'react';
import DashboardPage from '../pages/dashboard/DashboardPage';
import TransactionsPage from '../pages/transaction/TransactionsPage';
import BudgetsPage from '../pages/budget/BudgetsPage';
import ReportsPage from '../pages/reports/ReportsPage';
import SettingsPage from '../pages/settings/SettingsPage';

export const VALID_ROUTES = ['dashboard', 'transactions', 'budgets', 'reports', 'settings'];

export default function AppRoutes({
  currentRoute,
  startingBalance,
  transactions,
  allTransactions,
  monthlyTransactions,
  allowancePools,
  dynamicallyComputedBudgets,
  currencySymbol,
  onOpenSetStarting,
  onOpenReconcile,
  onOpenAdjustPool,
  onOpenSetMilestone, 
  onNavigateToTransactions,
  onOpenAddEntry,
  searchQuery,
  onToggleReconciled,
  onDeleteTransaction,
  upcomingAdjustments,
  onOpenAdjustBudget,
  onAcceptAdjustment,
  onReconcileCategory,
  onAddAllowancePool,
  onDeletePool,
  userProfile,
  setUserProfile,
  setCurrencySymbol,
  setStartingBalance,
  onResetData,
  onLoadSampleDemo,
  onLogout,
  showToast,
  milestoneTarget = 0,
  emergencyFund = 0
}) {
  switch (currentRoute) {
    case 'dashboard':
      return (
        <DashboardPage
          startingBalance={startingBalance}
          transactions={transactions}
          allTransactions={allTransactions} 
          monthlyTransactions={monthlyTransactions}
          allowancePools={allowancePools}
          currencySymbol={currencySymbol}
          onOpenSetStarting={onOpenSetStarting}
          onOpenReconcile={onOpenReconcile}
          onOpenAdjustPool={onOpenAdjustPool}
          onOpenSetMilestone={onOpenSetMilestone}
          onNavigateToTransactions={onNavigateToTransactions}
          onOpenAddEntry={onOpenAddEntry}
          milestoneTarget={milestoneTarget}
          emergencyFund={emergencyFund}
        />
      );

    case 'transactions':
      return (
        <TransactionsPage
          transactions={transactions}
          currencySymbol={currencySymbol}
          searchQuery={searchQuery}
          onOpenAddEntry={onOpenAddEntry}
          onToggleReconciled={onToggleReconciled}
          onDeleteTransaction={onDeleteTransaction}
        />
      );

    case 'budgets':
      return (
        <BudgetsPage
          allowancePools={allowancePools}
          budgetGoals={dynamicallyComputedBudgets}
          transactions={monthlyTransactions}
          upcomingAdjustments={upcomingAdjustments}
          currencySymbol={currencySymbol}
          onOpenAdjustPool={onOpenAdjustPool}
          onOpenAdjustBudget={onOpenAdjustBudget}
          onAcceptAdjustment={onAcceptAdjustment}
          onReconcileCategory={onReconcileCategory}
          onAddAllowancePool={onAddAllowancePool}
          onDeletePool={onDeletePool}
          onOpenAddEntry={onOpenAddEntry}
          searchQuery={searchQuery}
        />
      );

    case 'reports':
      return (
        <ReportsPage
          transactions={monthlyTransactions}
          currencySymbol={currencySymbol}
          onOpenAddEntry={onOpenAddEntry}
        />
      );

    case 'settings':
      return (
        <SettingsPage
          userProfile={userProfile}
          setUserProfile={setUserProfile}
          currencySymbol={currencySymbol}
          setCurrencySymbol={setCurrencySymbol}
          startingBalance={startingBalance}
          setStartingBalance={setStartingBalance}
          transactions={transactions}
          onResetData={onResetData}
          onLoadSampleDemo={onLoadSampleDemo}
          onLogout={onLogout}
          showToast={showToast}
        />
      );

    default:
      return (
        <DashboardPage
          startingBalance={startingBalance}
          transactions={transactions}
          allTransactions={allTransactions}
          monthlyTransactions={monthlyTransactions}
          allowancePools={allowancePools}
          currencySymbol={currencySymbol}
          onOpenSetStarting={onOpenSetStarting}
          onOpenReconcile={onOpenReconcile}
          onOpenAdjustPool={onOpenAdjustPool}
          onOpenSetMilestone={onOpenSetMilestone}
          onNavigateToTransactions={onNavigateToTransactions}
          onOpenAddEntry={onOpenAddEntry}
          milestoneTarget={milestoneTarget}
          emergencyFund={emergencyFund}
        />
      );
  }
}