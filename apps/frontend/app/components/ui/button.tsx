import React from "react";
import { LucideIcon } from "lucide-react";

interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: "primary" | "secondary" | "outline";
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
  const baseClasses = "font-semibold rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 focus:outline-none focus:ring-4 disabled:cursor-not-allowed";
  
  const variantClasses = {
    primary: loading || disabled
      ? "bg-slate-700 text-slate-400 opacity-50"
      : "bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-500 hover:via-blue-500 hover:to-indigo-500 text-white transform hover:scale-[1.02] hover:-translate-y-0.5 shadow-xl hover:shadow-2xl shadow-purple-500/25 focus:ring-purple-500/40",
    secondary: loading || disabled
      ? "bg-slate-700 text-slate-400 opacity-50"
      : "bg-slate-800 hover:bg-slate-700 text-white border-2 border-slate-700 hover:border-slate-600 focus:ring-slate-500/40",
    outline: loading || disabled
      ? "border-2 border-slate-700 text-slate-400 opacity-50"
      : "border-2 border-purple-500/50 hover:border-purple-500 text-purple-400 hover:text-white hover:bg-purple-500/10 focus:ring-purple-500/40",
  };
  
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
        <DisplayIcon className={`${loading && !LoadingIcon ? "animate-spin" : ""} ${size === "sm" ? "w-4 h-4" : size === "lg" ? "w-6 h-6" : "w-5 h-5"}`} />
      )}
      {displayText}
    </button>
  );
};

export default Button;