import { getAvailabilityLabel } from '../utils/generate-reason';

interface AvailabilityBadgeProps {
  allocation: number;
}

export const AvailabilityBadge = ({ allocation }: AvailabilityBadgeProps): JSX.Element => {
  const { label, className } = getAvailabilityLabel(allocation);
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 font-mono text-label-sm ${className}`}>
      {label}
    </span>
  );
};
