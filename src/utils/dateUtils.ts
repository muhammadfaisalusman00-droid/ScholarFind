/**
 * Date utility functions for ScholarFind
 */

export interface DeadlineInfo {
  daysRemaining: number;
  status: 'urgent' | 'warning' | 'normal' | 'expired';
  formattedDeadline: string;
  badgeLabel: string;
  badgeColorClass: string;
}

export function getDeadlineInfo(deadlineIsoDate: string, baseDateStr: string = '2026-08-10'): DeadlineInfo {
  const targetDate = new Date(deadlineIsoDate);
  const baseDate = new Date(baseDateStr);

  // Time difference in days
  const diffTime = targetDate.getTime() - baseDate.getTime();
  const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDeadline = targetDate.toLocaleDateString('en-US', options);

  if (daysRemaining < 0) {
    return {
      daysRemaining,
      status: 'expired',
      formattedDeadline,
      badgeLabel: 'Closed',
      badgeColorClass: 'bg-slate-100 text-slate-600 border-slate-200'
    };
  }

  if (daysRemaining < 7) {
    return {
      daysRemaining,
      status: 'urgent',
      formattedDeadline,
      badgeLabel: daysRemaining === 0 ? 'Closes Today' : daysRemaining === 1 ? '1 day left' : `${daysRemaining} days left`,
      badgeColorClass: 'bg-rose-50 text-rose-700 border-rose-200/80 font-medium'
    };
  }

  if (daysRemaining <= 30) {
    return {
      daysRemaining,
      status: 'warning',
      formattedDeadline,
      badgeLabel: `${daysRemaining} days left`,
      badgeColorClass: 'bg-amber-50 text-amber-800 border-amber-200/80 font-medium'
    };
  }

  return {
    daysRemaining,
    status: 'normal',
    formattedDeadline,
    badgeLabel: `${daysRemaining} days left`,
    badgeColorClass: 'bg-emerald-50 text-emerald-800 border-emerald-200/80 font-medium'
  };
}

export function formatDate(dateIsoStr: string): string {
  const date = new Date(dateIsoStr);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}
