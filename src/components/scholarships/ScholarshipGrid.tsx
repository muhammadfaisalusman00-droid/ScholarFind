import React from 'react';
import { Scholarship } from '../../types/scholarship';
import { ScholarshipCard } from './ScholarshipCard';
import { EmptyState } from './EmptyState';

interface ScholarshipGridProps {
  scholarships: Scholarship[];
  showDateAdded?: boolean;
  onResetFilters?: () => void;
}

export const ScholarshipGrid: React.FC<ScholarshipGridProps> = ({
  scholarships,
  showDateAdded = false,
  onResetFilters
}) => {
  if (scholarships.length === 0) {
    return <EmptyState onResetFilters={onResetFilters} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {scholarships.map((scholarship) => (
        <ScholarshipCard
          key={scholarship.id}
          scholarship={scholarship}
          showDateAdded={showDateAdded}
        />
      ))}
    </div>
  );
};
