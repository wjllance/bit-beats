export const formatDate = (timestamp: number, days: number): string => {
  const date = new Date(timestamp);
  if (days <= 1) {
    return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  } else if (days <= 7) {
    return date.toLocaleDateString(undefined, { weekday: 'short', hour: '2-digit', minute: '2-digit' });
  } else if (days <= 30) {
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  } else {
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  }
};

export const getMaxTicksLimit = (days: number): number => {
  if (days <= 1) return 12; // Reduced from 24 to show every 2 hours
  if (days <= 7) return 7;  // One label per day for week view
  if (days <= 30) return 10; // Reduced from 15 for month view
  return 8; // Reduced from 12 for longer periods
};
