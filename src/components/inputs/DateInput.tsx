import { InputHTMLAttributes } from 'react';

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export function DateInput({ label, className = '', ...props }: Props) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-gray-700">{label}</span>
      <input
        type="date"
        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${className}`}
        {...props}
      />
    </label>
  );
}


