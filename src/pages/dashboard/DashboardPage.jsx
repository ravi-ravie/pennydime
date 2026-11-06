import React from 'react';
import TotalBalanceHero from '../../components/dashboard/TotalBalanceHero';
import MilestoneCard from '../../components/dashboard/MilestoneCard';
import StatMetricsRow from '../../components/dashboard/StatMetricsRow';
import AllowancePoolBanner from '../../components/dashboard/AllowancePoolBanner';
import DebitAllocationDonut from '../../components/dashboard/DebitAllocationDonut';
import RecentEntriesList from '../../components/dashboard/RecentEntriesList';

export default function DashboardPage({
  startingBalance,
  transactions,
  allTransactions,
  monthlyTransactions,
  allowancePools = [],
  currencySymbol = '₹',
  onOpenSetStarting,
  onOpenReconcile,
  onOpenAdjustPool,
  onOpenSetMilestone,
  onNavigateToTransactions,
  onOpenAddEntry,
  milestoneTarget = 0,
  emergencyFund = 0
}) {
  const crAllTime = allTransactions.filter((t) => t.type === 'CR');
  const drAllTime = allTransactions.filter((t) => t.type === 'DR');

  const totalCR = crAllTime.reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0);
  const totalDR = drAllTime.reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0);
  const currentBalance = startingBalance + totalCR - totalDR;

  const primaryPool = allowancePools.length > 0 ? allowancePools[0] : null;

  return (
    <div className="flex flex-col gap-6">
      
      {/* Changed lg: to xl: for the hero grid */}
      <section className="grid grid-cols-1 xl:grid-cols-[1.65fr_1fr] gap-6">
        <TotalBalanceHero 
          startingBalance={startingBalance} 
          totalCR={totalCR} 
          totalDR={totalDR} 
          currentBalance={currentBalance} 
          currencySymbol={currencySymbol} 
          onOpenSetStarting={onOpenSetStarting} 
        />
        <MilestoneCard 
          currentBalance={emergencyFund}
          targetAmount={milestoneTarget} 
          currencySymbol={currencySymbol} 
          onOpenSetMilestone={onOpenSetMilestone} 
        />
      </section>

      <StatMetricsRow 
        totalCR={totalCR} 
        totalDR={totalDR} 
        crCount={crAllTime.length} 
        drCount={drAllTime.length} 
        currencySymbol={currencySymbol} 
      />

      {primaryPool ? (
        <AllowancePoolBanner 
          allowancePool={primaryPool} 
          currencySymbol={currencySymbol} 
          onOpenAdjustPool={() => onOpenAdjustPool(primaryPool)} 
        />
      ) : (
        <div className="bg-white border border-[#eae6df] rounded-2xl p-5 shadow-sm text-center text-[#727974]">
          No allowance pools created yet.
        </div>
      )}

      {/* Changed lg: to xl: for the bottom grid */}
      <section className="grid grid-cols-1 xl:grid-cols-[1fr_1.2fr] gap-6 items-stretch">
        <DebitAllocationDonut 
          transactions={monthlyTransactions} 
          totalDR={totalDR} 
          currencySymbol={currencySymbol} 
        />
        <RecentEntriesList 
          transactions={transactions} 
          currencySymbol={currencySymbol} 
          onNavigateToTransactions={onNavigateToTransactions} 
          onOpenAddEntry={onOpenAddEntry} 
        />
      </section>
    </div>
  );
}