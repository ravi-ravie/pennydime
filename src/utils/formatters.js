/**
 * Formatting utilities for PennyDime Ledger
 */

export const formatCurrency = (val, symbol = '₹') => {
  const num = Number(val) || 0;
  return (
    symbol +
    num.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
};

export const formatCurrencyInteger = (val, symbol = '₹') => {
  const num = Math.round(Number(val) || 0);
  return symbol + num.toLocaleString('en-IN');
};

export const formatDateDisplay = (dateStr) => {
  if (!dateStr) return 'Today';
  if (dateStr.includes('Mar') || dateStr.includes('Oct') || dateStr.includes('2026')) {
    return dateStr;
  }
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
};
