import React from 'react';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary';
};

export default function Button({ variant = 'primary', className = '', ...props }: Props) {
  const base = 'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  const styles =
    variant === 'primary'
      ? 'bg-brand-600 text-white hover:bg-brand-700 focus:ring-brand-500'
      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-brand-300';
  return <button className={`${base} ${styles} ${className}`} {...props} />;
}

