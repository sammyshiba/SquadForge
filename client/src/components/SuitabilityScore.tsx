import { getScoreColor } from '../utils/generate-reason';

interface SuitabilityScoreProps {
  value: number;
}

export const SuitabilityScore = ({ value }: SuitabilityScoreProps): JSX.Element => {
  const colorClass = getScoreColor(value);
  return (
    <span
      className={`font-headline text-headline-md font-bold ${colorClass}`}
      aria-label={`Suitability score: ${value} percent`}
    >
      {value.toFixed(1)}%
    </span>
  );
};
