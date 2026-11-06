import React from 'react';
import { ArrowDownLeft, ArrowUpRight, BookOpen } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export default function TransactionMetrics({
  totalCR,
  totalDR,
  currencySymbol = '₹'
}) {
  const net = totalCR - totalDR;

  return (
    <div className="tx-summary-strip">
      <div className="tx-summary-col">
        <div className="tx-summary-label">TOTAL INFLOW (CR)</div>
        <div className="tx-summary-val cr">
          <ArrowDownLeft size={16} />
          <span>+{formatCurrency(totalCR, currencySymbol)}</span>
        </div>
      </div>

      <div className="tx-summary-divider" />

      <div className="tx-summary-col">
        <div className="tx-summary-label">TOTAL OUTFLOW (DR)</div>
        <div className="tx-summary-val dr">
          <ArrowUpRight size={16} />
          <span>-{formatCurrency(totalDR, currencySymbol)}</span>
        </div>
      </div>

      <div className="tx-summary-divider" />

      <div className="tx-summary-col">
        <div className="tx-summary-label">NET LEDGER BALANCE</div>
        <div className="tx-summary-val net">
          <BookOpen size={16} />
          <span>{formatCurrency(net, currencySymbol)}</span>
        </div>
      </div>
    </div>
  );
}
