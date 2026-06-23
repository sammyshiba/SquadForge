import { clsx } from 'clsx';

interface SquadMember {
  employeeId: string;
  fullName: string;
  primaryRole: string;
  sTotal: number;
}

interface ProposedSquadBarProps {
  squad: SquadMember[];
  onRemove: (employeeId: string) => void;
  onReset: () => void;
  onFinalize: () => void;
}

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const ProposedSquadBar = ({ squad, onRemove, onReset, onFinalize }: ProposedSquadBarProps): JSX.Element => {
  const maxSeats = 5;
  const filledSeats = squad.length;
  const percentage = Math.round((filledSeats / maxSeats) * 100);
  const isEmpty = filledSeats === 0;
  const visibleMembers = squad.slice(0, 5);
  const overflow = squad.length > 5 ? squad.length - 5 : 0;

  return (
    <div
      className={clsx(
        'fixed bottom-0 left-0 right-0 z-50 bg-inverse-surface text-inverse-on-surface px-md py-xs',
        'transition-transform duration-300 ease-in-out',
      )}
      role="region"
      aria-label="Proposed Squad Builder"
    >
      <div className="mx-auto flex max-w-grid items-center justify-between gap-sm">
        {/* Left: Title and seat count */}
        <div className="flex flex-col gap-base">
          <span className="font-body text-label-md text-inverse-on-surface">
            Proposed Delivery Squad
          </span>
          <span
            className="font-mono text-label-sm text-inverse-on-surface/80"
            aria-live="polite"
          >
            {isEmpty
              ? 'No candidates selected'
              : `${filledSeats} of ${maxSeats} seats filled (${percentage}%)`}
          </span>
        </div>

        {/* Middle: Member chips */}
        <div className="flex items-center gap-xs">
          {visibleMembers.map((member) => (
            <div
              key={member.employeeId}
              className="group relative flex items-center gap-base rounded-full bg-inverse-on-surface/20 px-xs py-base"
              title={member.fullName}
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-on-secondary text-label-sm font-body">
                {getInitials(member.fullName)}
              </span>
              <span className="hidden font-body text-label-sm text-inverse-on-surface sm:inline">
                {member.fullName.split(' ')[0]}
              </span>
              <button
                type="button"
                onClick={() => onRemove(member.employeeId)}
                aria-label={`Remove ${member.fullName} from squad`}
                className="ml-base text-inverse-on-surface/60 hover:text-inverse-on-surface focus:outline-none focus:ring-1 focus:ring-inverse-on-surface/40 rounded-full"
              >
                ×
              </button>
            </div>
          ))}
          {overflow > 0 && (
            <span className="font-mono text-label-sm text-inverse-on-surface/70">
              +{overflow}
            </span>
          )}
        </div>

        {/* Right: Action buttons */}
        <div className="flex items-center gap-xs">
          <button
            type="button"
            onClick={onReset}
            disabled={isEmpty}
            aria-label="Reset squad"
            className={clsx(
              'rounded border border-outline-variant px-sm py-xs font-body text-label-md text-inverse-on-surface',
              'focus:outline-none focus:ring-2 focus:ring-inverse-on-surface/30',
              isEmpty && 'opacity-50 cursor-not-allowed',
            )}
          >
            Reset
          </button>
          <button
            type="button"
            onClick={onFinalize}
            disabled={isEmpty}
            aria-label="Finalize squad"
            className={clsx(
              'rounded bg-secondary px-sm py-xs font-body text-label-md text-on-secondary',
              'focus:outline-none focus:ring-2 focus:ring-secondary/30',
              isEmpty && 'opacity-50 cursor-not-allowed',
            )}
          >
            Finalize Squad
          </button>
        </div>
      </div>
    </div>
  );
};
