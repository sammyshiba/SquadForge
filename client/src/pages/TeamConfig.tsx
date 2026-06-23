export const TeamConfig = (): JSX.Element => {
  return (
    <div className="p-sm md:p-lg">
      <div className="mx-auto max-w-grid">
        <header className="mb-lg">
          <h2 className="font-headline text-headline-lg text-on-surface">Team Config</h2>
          <p className="mt-xs font-body text-body-md text-on-surface-variant">
            Configure the mock candidate pool and scoring assumptions.
          </p>
        </header>
        <div className="text-center py-xl">
          <p className="font-body text-body-lg text-on-surface-variant">
            Team configuration coming soon. Scoring weights: Skills 50%, Availability 30%, Role 20%.
          </p>
        </div>
      </div>
    </div>
  );
};
