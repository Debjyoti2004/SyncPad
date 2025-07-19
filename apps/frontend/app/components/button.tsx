import React from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'icon';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  children,
  disabled,
  className = '',
  ...props
}) => {
  const baseStyles = `
    inline-flex items-center justify-center font-medium rounded-lg
    transition-all duration-200 ease-in-out
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background
    disabled:opacity-50 disabled:cursor-not-allowed
    active:scale-[0.98] hover:shadow-lg
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `;

  const variants = {
    primary: `
      bg-gradient-to-r from-blue-600 to-blue-700 text-white
      hover:from-blue-700 hover:to-blue-800
      focus:ring-blue-500
      shadow-lg shadow-blue-500/25
    `,
    secondary: `
      bg-gradient-to-r from-gray-100 to-gray-200 text-gray-900
      hover:from-gray-200 hover:to-gray-300
      focus:ring-gray-500
      border border-gray-300
    `,
    outline: `
      border-2 border-gray-300 bg-transparent text-gray-700
      hover:bg-gray-50 hover:border-gray-400
      focus:ring-gray-500
    `,
    ghost: `
      bg-transparent text-gray-700
      hover:bg-gray-100
      focus:ring-gray-500
    `,
    destructive: `
      bg-gradient-to-r from-red-600 to-red-700 text-white
      hover:from-red-700 hover:to-red-800
      focus:ring-red-500
      shadow-lg shadow-red-500/25
    `,
    success: `
      bg-gradient-to-r from-green-600 to-green-700 text-white
      hover:from-green-700 hover:to-green-800
      focus:ring-green-500
      shadow-lg shadow-green-500/25
    `
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm gap-2 min-h-[32px]',
    md: 'px-4 py-2.5 text-sm gap-2 min-h-[40px]',
    lg: 'px-6 py-3 text-base gap-3 min-h-[44px]',
    xl: 'px-8 py-4 text-lg gap-3 min-h-[52px]',
    icon: 'p-2 min-h-[40px] w-10'
  };

  const isDisabled = disabled || loading;

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]}`}
      disabled={isDisabled}
      {...props}
    >
      {loading && (
        <Loader2 className="w-4 h-4 animate-spin" />
      )}
      
      {!loading && leftIcon && (
        <span className="flex-shrink-0">
          {leftIcon}
        </span>
      )}
      
      {size !== 'icon' && (
        <span className={loading ? 'opacity-0' : ''}>
          {children}
        </span>
      )}
      
      {!loading && rightIcon && size !== 'icon' && (
        <span className="flex-shrink-0">
          {rightIcon}
        </span>
      )}
    </button>
  );
};

// Compound component for button groups
export const ButtonGroup: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return (
    <div className={`inline-flex rounded-lg shadow-sm ${className}`}>
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child)) {
          const isFirst = index === 0;
          const isLast = index === React.Children.count(children) - 1;
          
          return React.cloneElement(child as React.ReactElement<any>, {
            className: `${(child.props as any).className || ''} ${
              isFirst ? 'rounded-r-none' : isLast ? 'rounded-l-none' : 'rounded-none'
            } ${!isFirst ? 'border-l-0' : ''}`,
          });
        }
        return child;
      })}
    </div>
  );
};

export default Button;