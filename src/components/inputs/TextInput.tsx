import { InputHTMLAttributes, ReactNode } from 'react';

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hint?: ReactNode;
};

export function TextInput({ label, hint, className = '', ...props }: Props) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-gray-700">{label}</span>
      <input
        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${className}`}
        {...props}
      />
      {hint && <div className="text-xs text-gray-500 mt-1">{hint}</div>}
    </label>
  );
}


