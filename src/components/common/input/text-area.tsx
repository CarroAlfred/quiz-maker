import { forwardRef, TextareaHTMLAttributes } from 'react';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className='flex flex-col gap-1 w-full'>
        {label && <label className='text-sm font-medium text-gray-700'>{label}</label>}
        <textarea
          ref={ref}
          className={`w-full resize-y rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:ring-1 focus:ring-gray-500 focus:outline-none  ${className}`}
          {...props}
        />
        {error && <p className='text-xs text-red-500'>{error}</p>}
      </div>
    );
  },
);

TextArea.displayName = 'TextArea';
