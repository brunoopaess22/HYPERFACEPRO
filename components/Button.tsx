
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  fullWidth?: boolean;
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  isLoading = false,
  className = '',
  disabled,
  ...props 
}) => {
  const baseStyles = "font-sans font-bold tracking-wide rounded-xl transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 uppercase text-xs md:text-sm";
  
  const variants = {
    primary: "bg-gradient-to-r from-hyper-blue to-hyper-purple hover:from-blue-400 hover:to-purple-500 text-white shadow-[0_0_20px_rgba(112,0,255,0.4)] border border-transparent",
    secondary: "bg-hyper-card hover:bg-gray-800 text-white border border-hyper-gray",
    outline: "bg-transparent border border-hyper-blue text-hyper-blue hover:bg-hyper-blue/10",
    danger: "bg-red-900/20 hover:bg-red-900/40 text-red-500 border border-red-900/50"
  };

  const sizes = "px-6 py-4";
  const width = fullWidth ? "w-full" : "w-auto";

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes} ${width} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
           <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-hyper-blue opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-hyper-blue"></span>
            </span>
            PROCESSANDO...
        </div>
      ) : children}
    </button>
  );
};

export default Button;