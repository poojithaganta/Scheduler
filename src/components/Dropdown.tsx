import { useEffect, useMemo, useRef, useState } from 'react';

type Option = {
  id: string;
  label: string;
  isNearest?: boolean;
};

type Props = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
};

export function Dropdown({ label, value, onChange, options, placeholder }: Props) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const nearest = useMemo(() => options.find(o => o.isNearest), [options]);
  const others = useMemo(() => options.filter(o => !o.isNearest), [options]);

  return (
    <div className="relative" ref={containerRef}>
      <label className="block">
        <span className="block text-sm font-medium text-gray-700">{label}</span>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </label>
      {open && (
        <div className="absolute z-10 mt-1 w-full rounded-md border bg-white shadow-lg">
          {nearest && (
            <button
              type="button"
              onClick={() => { onChange(nearest.label); setOpen(false); }}
              className="w-full text-left px-3 py-2 bg-blue-50 hover:bg-blue-100"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-blue-800">{nearest.label}</span>
                <span className="text-xs text-blue-700">Nearest</span>
              </div>
            </button>
          )}
          {others.map(opt => (
            <button
              key={opt.id}
              type="button"
              onClick={() => { onChange(opt.label); setOpen(false); }}
              className="w-full text-left px-3 py-2 hover:bg-gray-50"
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}


