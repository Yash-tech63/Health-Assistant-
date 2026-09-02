import React from 'react';
export const Card = ({ children, className = '', hoverable = false, onClick, }) => {
    return (<div onClick={onClick} className={`
        bg-white dark:bg-slate-900 
        border border-slate-200 dark:border-slate-800 
        rounded-2xl shadow-xs 
        transition-all duration-200 
        ${hoverable || onClick ? 'hover:shadow-sm hover:border-slate-300 dark:hover:border-slate-700 cursor-pointer' : ''} 
        ${className}
      `}>
      {children}
    </div>);
};
export const CardHeader = ({ children, className = '', }) => (<div className={`px-5 py-4 border-b border-slate-100 dark:border-slate-800/85 ${className}`}>
    {children}
  </div>);
export const CardBody = ({ children, className = '', }) => (<div className={`p-5 ${className}`}>
    {children}
  </div>);
export const CardFooter = ({ children, className = '', }) => (<div className={`px-5 py-3 border-t border-slate-100 dark:border-slate-800/85 bg-slate-50/30 dark:bg-slate-900/30 rounded-b-2xl ${className}`}>
    {children}
  </div>);
