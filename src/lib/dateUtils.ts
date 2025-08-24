// Utility functions for consistent date formatting across server and client
export function formatDateConsistent(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.toLocaleString('en-US', { month: 'long' });
  const day = date.getDate();
  
  return `${month} ${day}, ${year}`;
}

export function formatDateShort(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

// For sorting purposes - consistent across server/client
export function getDateTimestamp(dateString: string): number {
  return new Date(dateString).getTime();
}
