import React from 'react';
import { Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { getDeadlineInfo } from '../../utils/dateUtils';

interface DeadlineBadgeProps {
  deadline: string;
  showIcon?: boolean;
  size?: 'sm' | 'md';
}

export const DeadlineBadge: React.FC<DeadlineBadgeProps> = ({ 
  deadline, 
  showIcon = true,
  size = 'sm' 
}) => {
  const info = getDeadlineInfo(deadline);

  const sizeClasses = size === 'sm' 
    ? 'px-2.5 py-1 text-xs' 
    : 'px-3 py-1.5 text-sm';

  const iconSize = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4';

  let Icon = Clock;
  if (info.status === 'urgent') Icon = AlertTriangle;
  if (info.status === 'normal') Icon = CheckCircle2;

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border shadow-2xs font-medium ${info.badgeColorClass} ${sizeClasses}`}>
      {showIcon && <Icon className={iconSize} />}
      <span>{info.badgeLabel}</span>
    </span>
  );
};
