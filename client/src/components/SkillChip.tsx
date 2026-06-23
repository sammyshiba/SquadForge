import { clsx } from 'clsx';

interface SkillChipProps {
  name: string;
  level: number;
  isMatched?: boolean;
}

export const SkillChip = ({ name, level, isMatched = false }: SkillChipProps): JSX.Element => {
  return (
    <span className={clsx(
      'inline-flex items-center rounded-full px-3 py-1 font-mono text-label-sm',
      isMatched
        ? 'bg-secondary-container/10 text-secondary border border-secondary/20'
        : 'bg-surface-container text-on-surface-variant',
    )}>
      {name} (L{level})
    </span>
  );
};
