import React from 'react';

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export default function DateInput({ label, className = '', ...props }: Props) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-gray-700">{label}</span>
      <input
        type="date"
        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 ${className}`}
        {...props}
      />
    </label>
  );
}


