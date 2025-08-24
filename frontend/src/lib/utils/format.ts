import { formatDistanceToNow, format } from "date-fns";

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount / 100); // Assuming cost is in cents
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${seconds.toFixed(1)}s`;
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds.toFixed(1)}s`;
  } else {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  }
}

export function timeAgo(dateString: string): string {
  try {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  } catch {
    return 'Unknown';
  }
}

export function formatDateTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    return format(date, 'MMM d, yyyy HH:mm:ss');
  } catch {
    return 'Invalid date';
  }
}

export function formatISODateTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toISOString();
  } catch {
    return 'Invalid date';
  }
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'completed':
      return 'success';
    case 'running':
      return 'primary';
    case 'failed':
      return 'destructive';
    case 'pending':
    case 'queued':
      return 'warning';
    default:
      return 'secondary';
  }
}