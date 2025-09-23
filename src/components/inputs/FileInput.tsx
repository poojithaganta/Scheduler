import { InputHTMLAttributes } from 'react';

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export function FileInput({ label, className = '', ...props }: Props) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-gray-700">{label}</span>
      <input
        type="file"
        className={`mt-1 block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 ${className}`}
        {...props}
      />
    </label>
  );
}


