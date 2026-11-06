import React, { useMemo } from 'react';
import ReportStatsCards from '../../components/reports/ReportStatsCards';
import MonthlyTrendChart from '../../components/reports/MonthlyTrendChart';
import CategoryBreakdownCard from '../../components/reports/CategoryBreakdownCard';
import ComparisonCard from '../../components/reports/ComparisonCard';
import { deriveLedger, deriveCategories, deriveMonthlyBreakdown } from '../../utils/calculations';

export default function ReportsPage({
  transactions = [],
  currencySymbol = '₹'
}) {
  const derived = useMemo(
    () => deriveLedger({ transactions, startingBalance: 0 }),
    [transactions]
  );
  const categories = useMemo(() => deriveCategories(transactions), [transactions]);
  const monthly = useMemo(() => deriveMonthlyBreakdown(transactions), [transactions]);

  return (
    <div className="flex flex-col w-full relative pb-10">
      
      <div className="flex flex-col mb-6 md:mb-8 pt-2">
        <h1 className="font-serif text-[32px] md:text-[42px] font-bold text-[#03241a] leading-tight tracking-tight mb-1">Financial Flow</h1>
        <p className="text-[13px] md:text-[15px] text-[#727974]">Income and expenditure analytics from your real ledger entries</p>
      </div>

      <ReportStatsCards
        totalCR={derived.totalCR}
        totalDR={derived.totalDR}
        netFlow={derived.netFlow}
        currencySymbol={currencySymbol}
      />

      <section className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-4 md:gap-6 mt-4 md:mt-6">
        <MonthlyTrendChart
          transactions={transactions}
          currencySymbol={currencySymbol}
        />
        <CategoryBreakdownCard
          categories={categories}
          totalDR={derived.totalDR}
          currencySymbol={currencySymbol}
        />
      </section>

      <div className="mt-4 md:mt-6">
        <ComparisonCard monthly={monthly} currencySymbol={currencySymbol} />
      </div>
    </div>
  );
}