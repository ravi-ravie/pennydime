export function deriveLedger({ transactions = [], startingBalance = 0 }) {
  const cr = transactions.filter((t) => t.type === 'CR');
  const dr = transactions.filter((t) => t.type === 'DR');
  const totalCR = cr.reduce((s, t) => s + (parseFloat(t.amount) || 0), 0);
  const totalDR = dr.reduce((s, t) => s + (parseFloat(t.amount) || 0), 0);
  const currentBalance = startingBalance + totalCR - totalDR;
  const netFlow = totalCR - totalDR;
  const savingsRate = totalCR > 0 ? (netFlow / totalCR) * 100 : 0;
  return { cr, dr, totalCR, totalDR, currentBalance, netFlow, savingsRate };
}
export function deriveCategories(transactions = []) {
  const dr = transactions.filter((t) => t.type === 'DR');
  const totalDR = dr.reduce((s, t) => s + (parseFloat(t.amount) || 0), 0);
  const map = {};
  dr.forEach((t) => {
    const cat = t.category || 'Others';
    map[cat] = (map[cat] || 0) + (parseFloat(t.amount) || 0);
  });
  const PALETTE = ['#e8703a', '#03241a', '#1b3a2f', '#456558', '#83a496', '#fd8048', '#727974'];
  return Object.entries(map)
    .map(([name, amount], i) => ({
      name, amount, pctVal: totalDR > 0 ? (amount / totalDR) * 100 : 0, color: PALETTE[i % PALETTE.length]
    }))
    .sort((a, b) => b.amount - a.amount);
}
export function deriveMonthlyBreakdown(transactions = []) {
  const map = {};
  transactions.forEach((t) => {
    const d = new Date(t.date);
    if (isNaN(d)) return;
    const key = d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    if (!map[key]) map[key] = { CR: 0, DR: 0 };
    map[key][t.type] = (map[key][t.type] || 0) + (parseFloat(t.amount) || 0);
  });
  return map;
}