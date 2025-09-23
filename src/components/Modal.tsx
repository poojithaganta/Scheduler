import { ReactNode, useEffect } from 'react';

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
};

export function Modal({ open, onClose, title, children }: ModalProps) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (open) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
        {title && (
          <div className="px-5 py-4 border-b">
            <h3 className="text-lg font-semibold">{title}</h3>
          </div>
        )}
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}


