import React from 'react';

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export default function FileInput({ label, className = '', ...props }: Props) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-gray-700">{label}</span>
      <input
        type="file"
        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100 ${className}`}
        {...props}
      />
    </label>
  );
}


