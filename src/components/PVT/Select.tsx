import React from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  options: SelectOption[];
}

/**
 * PVT Select Component
 * Branded select dropdown with consistent styling
 */
export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, icon, options, className = '', ...props }, ref) => {
    const selectId = props.id || `select-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label
            htmlFor={selectId}
            className="font-medium text-text-primary text-sm"
          >
            {label}
          </label>
        )}

        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary z-10 pointer-events-none">
              {icon}
            </div>
          )}

          <select
            ref={ref}
            id={selectId}
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
              cursor-pointer
              ${error ? 'border-state-error' : ''}
              ${className}
            `}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <span className="text-sm text-state-error">{error}</span>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
