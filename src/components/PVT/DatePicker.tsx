import React from 'react';

interface DatePickerProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

/**
 * PVT DatePicker Component
 * Branded date picker with consistent styling
 */
export const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(
  ({ label, error, icon, className = '', ...props }, ref) => {
    const inputId = props.id || `datepicker-${Math.random().toString(36).substr(2, 9)}`;

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
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none">
              {icon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            type="date"
            className={`
              w-full
              rounded-input
              border border-border-medium
              px-4 py-3
              ${icon ? 'pl-10' : ''}
              text-text-primary
              bg-background-secondary
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

DatePicker.displayName = 'DatePicker';
