import React from 'react';
export const Alert = ({ type = 'info', title, children, className = '', }) => {
    const styles = {
        info: {
            container: 'bg-sky-50 dark:bg-sky-950/20 border-sky-200 dark:border-sky-900',
            text: 'text-sky-800 dark:text-sky-200',
            icon: 'text-sky-500'
        },
        success: {
            container: 'bg-hospital-50 dark:bg-hospital-950/20 border-hospital-200 dark:border-hospital-900',
            text: 'text-hospital-800 dark:text-hospital-200',
            icon: 'text-hospital-500'
        },
        warning: {
            container: 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900',
            text: 'text-amber-800 dark:text-amber-200',
            icon: 'text-amber-500'
        },
        error: {
            container: 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900',
            text: 'text-red-800 dark:text-red-200',
            icon: 'text-red-500'
        }
    };
    const icons = {
        info: (<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>),
        success: (<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>),
        warning: (<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
      </svg>),
        error: (<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>),
    };
    return (<div className={`flex border rounded-lg p-4 ${styles[type].container} ${className}`}>
      <div className={`flex-shrink-0 ${styles[type].icon}`}>
        {icons[type]}
      </div>
      <div className="ml-3 flex-1">
        {title && (<h5 className={`text-sm font-semibold mb-1 ${styles[type].text}`}>
            {title}
          </h5>)}
        <div className={`text-sm leading-relaxed ${styles[type].text}`}>
          {children}
        </div>
      </div>
    </div>);
};
