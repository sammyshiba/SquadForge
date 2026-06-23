interface LogoProps {
  size?: number;
  className?: string;
}

export const Logo = ({ size = 32, className = '' }: LogoProps): JSX.Element => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="SquadForge logo"
    >
      {/* Shield shape */}
      <path
        d="M16 2L4 7v9c0 7.73 5.12 14.96 12 17 6.88-2.04 12-9.27 12-17V7L16 2z"
        fill="#00216e"
      />
      {/* Connected nodes representing squad members */}
      <circle cx="16" cy="11" r="2.5" fill="#ffffff" />
      <circle cx="11" cy="18" r="2" fill="#72fa92" />
      <circle cx="21" cy="18" r="2" fill="#72fa92" />
      <circle cx="13" cy="24" r="1.5" fill="#ffffff" opacity="0.7" />
      <circle cx="19" cy="24" r="1.5" fill="#ffffff" opacity="0.7" />
      {/* Connection lines */}
      <line x1="16" y1="13.5" x2="11" y2="16" stroke="#ffffff" strokeWidth="0.8" opacity="0.6" />
      <line x1="16" y1="13.5" x2="21" y2="16" stroke="#ffffff" strokeWidth="0.8" opacity="0.6" />
      <line x1="11" y1="20" x2="13" y2="22.5" stroke="#72fa92" strokeWidth="0.6" opacity="0.5" />
      <line x1="21" y1="20" x2="19" y2="22.5" stroke="#72fa92" strokeWidth="0.6" opacity="0.5" />
      <line x1="11" y1="18" x2="21" y2="18" stroke="#ffffff" strokeWidth="0.6" opacity="0.4" />
    </svg>
  );
};
