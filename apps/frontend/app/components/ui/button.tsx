import React from "react";
import { LucideIcon } from "lucide-react";

interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: "primary" | "secondary" | "outline" | "green" | "blue";
  size?: "sm" | "md" | "lg";
  icon?: LucideIcon;
  loadingIcon?: LucideIcon;
  loadingText?: string;
  className?: string;
  type?: "button" | "submit" | "reset";
}

const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  disabled = false,
  loading = false,
  variant = "primary",
  size = "md",
  icon: Icon,
  loadingIcon: LoadingIcon,
  loadingText,
  className = "",
  type = "button",
}) => {
  const baseClasses =
    "font-semibold rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 focus:outline-none focus:ring-4 disabled:cursor-not-allowed";

  const variantClasses = {
    primary:
      loading || disabled
        ? "bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white/50 cursor-not-allowed opacity-50"
        : `bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 
       text-white 
       px-6 py-3 
       shadow-xl shadow-blue-500/20 
       hover:shadow-2xl hover:shadow-purple-500/30 
       hover:from-blue-500 hover:via-purple-500 hover:to-indigo-500 
       hover:-translate-y-0.5 hover:scale-[1.02] 
       backdrop-blur-md bg-opacity-80 
       focus:ring-4 focus:ring-purple-500/50 
       transition-all duration-300 ease-in-out
       "font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-3 focus:outline-none disabled:cursor-not-allowed"
`
    ,
    secondary:
      loading || disabled
        ? "bg-slate-700 text-slate-400 opacity-50"
        : "bg-slate-800 hover:bg-slate-700 text-white border-2 border-slate-700 hover:border-slate-600 focus:ring-slate-500/40",
    outline:
      loading || disabled
        ? "border-2 border-slate-700 text-slate-400 opacity-50"
        : "border-2 border-purple-500/50 hover:border-purple-500 text-purple-400 hover:text-white hover:bg-purple-500/10 focus:ring-purple-500/40",
    green:
      loading || disabled
        ? "bg-emerald-700 text-emerald-200 opacity-50 cursor-not-allowed"
        : `bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 
       text-white 
       shadow-lg shadow-emerald-500/30 
       hover:from-emerald-400 hover:via-emerald-500 hover:to-emerald-600 
       hover:shadow-xl hover:shadow-emerald-400/40 
       backdrop-blur-md bg-opacity-90 
       transform hover:-translate-y-0.5 hover:scale-[1.02] 
       focus:ring-4 focus:ring-emerald-400/40 
       transition-all duration-300 ease-in-out`,

    blue:
      loading || disabled
        ? "bg-blue-700 text-blue-200 opacity-50"
        : "bg-blue-600 hover:bg-blue-500 text-white shadow-md hover:shadow-lg focus:ring-blue-400/50",
  } as const;

  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-4 text-base",
    lg: "px-8 py-5 text-lg",
  };

  const isDisabled = disabled || loading;
  const displayText = loading && loadingText ? loadingText : label;
  const DisplayIcon = loading && LoadingIcon ? LoadingIcon : Icon;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {loading && !LoadingIcon && (
        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      )}
      {DisplayIcon && (
        <DisplayIcon
          className={`${loading && !LoadingIcon ? "animate-spin" : ""
            } ${size === "sm" ? "w-4 h-4" : size === "lg" ? "w-6 h-6" : "w-5 h-5"}`}
        />
      )}
      {displayText}
    </button>
  );
};

export default Button;
