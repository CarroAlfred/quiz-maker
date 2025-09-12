import { InputHTMLAttributes, forwardRef } from 'react';

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className='flex flex-col gap-1 w-full'>
        {label && <label className='text-sm font-medium text-gray-700'>{label}</label>}

        <input
          ref={ref}
          onWheel={(e) => (e.target as HTMLElement).blur()}
          className={`w-full px-2.5 py-2 border border-gray-300 rounded-md text-gray-600 text-sm tracking-tight focus:outline-none focus:ring-1 focus:ring-gray-500 ${className}`}
          {...props}
        />

        {error && <span className='text-xs text-red-500'>{error}</span>}
      </div>
    );
  },
);

TextInput.displayName = 'TextInput';
