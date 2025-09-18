import React, { useEffect, useRef, useState } from 'react';

type Option = {
  label: string;
  value: string;
  highlight?: boolean;
};

type Props = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
};

export default function Dropdown({ label, value, onChange, options, placeholder }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  const filtered = options.filter(o => o.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="block" ref={containerRef}>
      <span className="block text-sm font-medium text-gray-700">{label}</span>
      <div className="mt-1 relative">
        <input
          value={value || query}
          onChange={(e) => {
            setQuery(e.target.value);
            onChange(e.target.value);
          }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500"
        />
        {open && (
          <div className="absolute z-20 mt-2 w-full bg-white border rounded-md shadow-card max-h-60 overflow-auto">
            {filtered.length === 0 && (
              <div className="px-3 py-2 text-sm text-gray-500">No results</div>
            )}
            {filtered.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => { onChange(opt.label); setOpen(false); }}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${opt.highlight ? 'bg-brand-50 text-brand-700' : 'text-gray-700'}`}
              >
                {opt.label}
                {opt.highlight && <span className="ml-2 inline-flex items-center rounded bg-brand-100 text-brand-700 px-1.5 py-0.5 text-xs">Nearest</span>}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

