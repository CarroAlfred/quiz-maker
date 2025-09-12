import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { ReactNode } from 'react';

type DialogContainerProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children?: ReactNode;
  footer?: ReactNode;
  maxWidth?: string; // e.g., "max-w-md", "max-w-lg"
};

export const DialogContainer = ({
  open,
  onClose,
  title,
  children,
  footer,
  maxWidth = 'max-w-md',
}: DialogContainerProps) => {
  return (
    <Dialog
      open={open}
      as='div'
      className='relative z-50 focus:outline-none'
      onClose={onClose}
    >
      <div className='fixed inset-0 bg-black/40 backdrop-blur-sm' />

      <div className='fixed inset-0 flex items-center justify-center p-4'>
        <DialogPanel
          transition
          className={`w-full ${maxWidth} max-h-[90vh] flex flex-col rounded-xl bg-white shadow-lg duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0`}
        >
          {/* Title */}
          {title && <DialogTitle className='text-lg font-semibold text-gray-900 px-6 pt-6'>{title}</DialogTitle>}

          {/* Scrollable content */}
          {children && <div className='flex-1 overflow-y-auto px-6 py-4'>{children}</div>}

          {/* Fixed footer */}
          {footer && <div className='border-t px-6 py-4 flex justify-end gap-2'>{footer}</div>}
        </DialogPanel>
      </div>
    </Dialog>
  );
};
