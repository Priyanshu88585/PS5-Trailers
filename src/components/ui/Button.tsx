"use client";

import { forwardRef } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "@/utils/cn";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline" | "danger" | "gold";
  size?: "xs" | "sm" | "md" | "lg";
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
  pulse?: boolean;
}

const variants = {
  primary: "bg-ps5-blue hover:bg-ps5-blue-light text-white shadow-ps5-blue-sm hover:shadow-ps5-blue active:scale-[0.98]",
  secondary: "bg-ps5-elevated hover:bg-ps5-muted text-white border border-ps5-border",
  ghost: "bg-transparent hover:bg-ps5-muted text-ps5-text-secondary hover:text-white",
  outline: "bg-transparent border border-ps5-border hover:border-ps5-blue text-ps5-text-secondary hover:text-ps5-blue",
  danger: "bg-ps5-danger hover:bg-red-600 text-white active:scale-[0.98]",
  gold: "bg-ps5-gold/20 hover:bg-ps5-gold/30 text-ps5-gold border border-ps5-gold/40",
};

const sizes = {
  xs: "px-2.5 py-1 text-xs rounded-md gap-1.5",
  sm: "px-3.5 py-2 text-sm rounded-lg gap-2",
  md: "px-5 py-2.5 text-sm rounded-lg gap-2",
  lg: "px-6 py-3 text-base rounded-xl gap-2.5",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      icon,
      iconPosition = "left",
      fullWidth = false,
      pulse = false,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          "inline-flex items-center justify-center font-semibold transition-all duration-200 select-none outline-none focus-visible:ring-2 focus-visible:ring-ps5-blue/50 focus-visible:ring-offset-1 focus-visible:ring-offset-ps5-void",
          variants[variant],
          sizes[size],
          fullWidth && "w-full",
          isDisabled && "opacity-50 cursor-not-allowed pointer-events-none",
          pulse && "animate-pulse-blue",
          className
        )}
        {...props}
      >
        {loading ? (
          <Loader2 size={16} className="animate-spin flex-shrink-0" />
        ) : (
          icon && iconPosition === "left" && <span className="flex-shrink-0">{icon}</span>
        )}
        {children && <span>{children}</span>}
        {!loading && icon && iconPosition === "right" && (
          <span className="flex-shrink-0">{icon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
