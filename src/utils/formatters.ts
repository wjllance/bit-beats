/**
 * Format a market cap number to a human-readable string with appropriate suffix (T, B, M)
 * @param marketCap - The market cap value to format
 * @returns Formatted market cap string with appropriate suffix
 */
export const formatMarketCap = (marketCap: number): string => {
  if (marketCap === null || marketCap === undefined) {
    return '';
  } else if (marketCap >= 1e12) {
    return `$${(marketCap / 1e12).toFixed(3)}T`;
  } else if (marketCap >= 1e9) {
    return `$${(marketCap / 1e9).toFixed(3)}B`;
  } else if (marketCap >= 1e6) {
    return `$${(marketCap / 1e6).toFixed(3)}M`;
  } else {
    return `$${marketCap.toLocaleString()}`;
  }
};

/**
 * Format a price number to a human-readable string with appropriate decimals
 * @param price - The price value to format
 * @returns Formatted price string
 */
export const formatPrice = (price: number): string => {
  return `$${price.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

/**
 * Format a percentage change to a human-readable string
 * @param percentage - The percentage value to format
 * @returns Formatted percentage string
 */
export const formatPercentageChange = (percentage: number): string => {
  const sign = percentage >= 0 ? '+' : '';
  return `${sign}${percentage.toFixed(2)}%`;
};
