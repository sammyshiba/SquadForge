interface IconProps {
  className?: string;
}

export const DemandIcon = ({ className = 'w-5 h-5' }: IconProps): JSX.Element => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} aria-hidden="true">
    <rect x="3" y="3" width="14" height="14" rx="2" />
    <path d="M7 7h6M7 10h6M7 13h4" strokeLinecap="round" />
  </svg>
);

export const QueueIcon = ({ className = 'w-5 h-5' }: IconProps): JSX.Element => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} aria-hidden="true">
    <circle cx="7" cy="7" r="2.5" />
    <circle cx="13" cy="7" r="2.5" />
    <circle cx="10" cy="14" r="2.5" />
    <path d="M7 9.5v1.5a3 3 0 003 3M13 9.5v1.5a3 3 0 01-3 3" strokeLinecap="round" />
  </svg>
);

export const AnalyticsIcon = ({ className = 'w-5 h-5' }: IconProps): JSX.Element => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} aria-hidden="true">
    <rect x="3" y="10" width="3" height="7" rx="0.5" />
    <rect x="8.5" y="6" width="3" height="11" rx="0.5" />
    <rect x="14" y="3" width="3" height="14" rx="0.5" />
  </svg>
);

export const ConfigIcon = ({ className = 'w-5 h-5' }: IconProps): JSX.Element => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} aria-hidden="true">
    <circle cx="10" cy="10" r="3" />
    <path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.93 4.93l1.41 1.41M13.66 13.66l1.41 1.41M4.93 15.07l1.41-1.41M13.66 6.34l1.41-1.41" strokeLinecap="round" />
  </svg>
);

export const BellIcon = ({ className = 'w-5 h-5' }: IconProps): JSX.Element => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} aria-hidden="true">
    <path d="M10 2a5 5 0 00-5 5v3l-1.5 2.5h13L15 10V7a5 5 0 00-5-5zM8.5 17a1.5 1.5 0 003 0" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ChevronLeftIcon = ({ className = 'w-5 h-5' }: IconProps): JSX.Element => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} aria-hidden="true">
    <path d="M13 4l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ChevronRightIcon = ({ className = 'w-5 h-5' }: IconProps): JSX.Element => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} aria-hidden="true">
    <path d="M7 4l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const SquadIcon = ({ className = 'w-5 h-5' }: IconProps): JSX.Element => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} aria-hidden="true">
    <path d="M10 2l6 3.5v5c0 4.5-3 8-6 9.5-3-1.5-6-5-6-9.5v-5L10 2z" strokeLinejoin="round" />
    <circle cx="10" cy="8" r="1.5" />
    <path d="M7.5 13h5M8.5 11h3" strokeLinecap="round" />
  </svg>
);
