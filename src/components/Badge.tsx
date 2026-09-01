import React from 'react';

type BadgeColor = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';

interface BadgeProps {
  children: React.ReactNode;
  color?: BadgeColor;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  color = 'primary',
  className = '',
}) => {
  const styles: Record<BadgeColor, string> = {
    primary: 'bg-pink-100 text-rose-900 border-pink-300 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900',
    secondary: 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900',
    success: 'bg-pink-100 text-rose-900 border-pink-300 dark:bg-rose-900/50 dark:text-rose-200 dark:border-rose-800',
    danger: 'bg-rose-100 text-rose-900 border-rose-200 dark:bg-rose-900/50 dark:text-rose-200 dark:border-rose-800',
    warning: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-900',
    info: 'bg-sky-50 text-sky-800 border-sky-200 dark:bg-sky-950/30 dark:text-sky-300 dark:border-sky-900',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles[color]} ${className}`}>
      {children}
    </span>
  );
};
