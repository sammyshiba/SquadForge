import { getScoreBarColor } from '../utils/generate-reason';

interface ScoreBarProps {
  label: string;
  value: number;
  max: number;
}

export const ScoreBar = ({ label, value, max }: ScoreBarProps): JSX.Element => {
  const percentage = (value / max) * 100;
  const barColor = getScoreBarColor(value);

  return (
    <div className="flex items-center gap-xs" aria-label={`${label}: ${value} out of ${max}`}>
      <span className="w-24 font-body text-label-sm text-on-surface-variant">{label}</span>
      <div className="flex-1 h-2 rounded-full bg-surface-container-high">
        <div
          className={`h-2 rounded-full transition-all ${barColor}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="w-12 text-right font-mono text-label-sm text-on-surface">{value}/{max}</span>
    </div>
  );
};
