import React from 'react';

interface ModalTemplateProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export const ModalTemplate: React.FC<ModalTemplateProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  className = ''
}) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      <div
        role="dialog"
        aria-labelledby="modal-title"
        className={`fixed left-1/2 top-1/2 z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 bg-background shadow-lg duration-200 animate-in fade-in-0 zoom-in-95 slide-in-from-left-1/2 slide-in-from-top-[48%] sm:rounded-lg sm:max-w-[1000px] lg:max-w-[1200px] p-0 flex flex-col h-[800px] max-h-[90vh] overflow-auto bg-gradient-to-br from-orange-50 to-blue-100 ${className}`}
        style={{ pointerEvents: 'auto' }}
      >
        <div className="px-4 py-2 rounded-t-xl">
          <h2 id="modal-title" className="text-base font-semibold text-gray-900">
            {title}
          </h2>
        </div>

        <div className="flex flex-1 min-h-0 overflow-hidden gap-6 p-4">
          <div className="min-w-0 p-6 space-y-4 bg-white rounded-xl border border-gray-200 shadow-sm h-full flex flex-col w-full">
            {children}
          </div>
        </div>

        {footer && (
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 py-2.5 px-4">
            {footer}
          </div>
        )}

        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span className="sr-only">Close</span>
        </button>
      </div>
    </>
  );
};