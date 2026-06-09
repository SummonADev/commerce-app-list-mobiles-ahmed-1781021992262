// Platform commission percentage that goes to the app owner per product sale.
export const PLATFORM_FEE_PERCENT = 8;

export const formatCurrency = (n: number): string =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
