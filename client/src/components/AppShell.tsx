import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';

import { Logo } from './Logo';
import { DemandIcon, QueueIcon, AnalyticsIcon, ConfigIcon, SquadIcon, BellIcon, ChevronLeftIcon, ChevronRightIcon } from './Icons';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell = ({ children }: AppShellProps): JSX.Element => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Demand Center', icon: <DemandIcon /> },
    { path: '/candidates', label: 'Resource Queue', icon: <QueueIcon /> },
    { path: '/squad-summary', label: 'Squad Summary', icon: <SquadIcon /> },
    { path: '/analytics', label: 'Analytics', icon: <AnalyticsIcon /> },
    { path: '/team-config', label: 'Team Config', icon: <ConfigIcon /> },
  ];

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside className={clsx(
        'flex flex-col border-r border-outline-variant bg-surface-container-lowest transition-all duration-300',
        sidebarCollapsed ? 'w-16' : 'w-64',
      )}>
        {/* Brand */}
        <div className="flex items-center gap-xs px-sm py-md border-b border-outline-variant">
          <Logo size={32} />
          {!sidebarCollapsed && (
            <div className="flex flex-col">
              <span className="font-headline text-sm font-semibold text-on-surface">SquadForge</span>
              <span className="font-mono text-label-sm text-on-surface-variant">Resource Optimization</span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-xs py-sm space-y-base" aria-label="Main navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => clsx(
                'flex items-center gap-xs rounded-lg px-sm py-xs font-body text-body-sm transition-colors',
                isActive
                  ? 'bg-secondary-container/10 text-secondary font-medium'
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface',
              )}
              end={item.path === '/'}
            >
              {item.icon}
              {!sidebarCollapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Collapse toggle */}
        <div className="border-t border-outline-variant px-xs py-sm">
          <button
            type="button"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="flex w-full items-center justify-center rounded-lg px-sm py-xs text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors"
          >
            {sidebarCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <header className="flex h-14 items-center justify-between border-b border-outline-variant bg-surface-container-lowest px-md">
          {/* Breadcrumb / page title */}
          <div className="flex items-center gap-xs">
            <h1 className="font-headline text-body-lg font-semibold text-on-surface">
              {navItems.find((item) => {
                if (item.path === '/') return location.pathname === '/';
                return location.pathname.startsWith(item.path);
              })?.label || 'SquadForge'}
            </h1>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-sm">
            {/* Search */}
            <div className="relative hidden md:block">
              <input
                type="text"
                placeholder="Search resources..."
                aria-label="Search resources"
                className="w-56 rounded-lg border border-outline-variant bg-surface-container-low px-sm py-xs font-body text-body-sm text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
              />
            </div>
            {/* Notification bell */}
            <button
              type="button"
              aria-label="Notifications"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors"
            >
              <BellIcon className="w-5 h-5" />
            </button>
            {/* User avatar */}
            <div
              className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-on-primary font-body text-xs font-medium"
              title="Delivery Lead"
              aria-label="User menu"
            >
              DL
            </div>
          </div>
        </header>

        {/* Page content (scrollable) */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
