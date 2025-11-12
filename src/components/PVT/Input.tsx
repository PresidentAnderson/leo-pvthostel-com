import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

/**
 * PVT Input Component
 * Branded input field with consistent styling
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className = '', ...props }, ref) => {
    const inputId = props.id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label
            htmlFor={inputId}
            className="font-medium text-text-primary text-sm"
          >
            {label}
          </label>
        )}

        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">
              {icon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            className={`
              w-full
              rounded-input
              border border-border-medium
              px-4 py-3
              ${icon ? 'pl-10' : ''}
              text-text-primary
              placeholder:text-text-secondary
              focus:outline-none
              focus:ring-2
              focus:ring-state-focus
              focus:border-transparent
              transition-all duration-fast
              disabled:bg-gray-100 disabled:cursor-not-allowed
              ${error ? 'border-state-error' : ''}
              ${className}
            `}
            {...props}
          />
        </div>

        {error && (
          <span className="text-sm text-state-error">{error}</span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
