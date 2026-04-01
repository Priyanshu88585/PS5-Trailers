"use client";

import { forwardRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/utils/cn";

// ---- INPUT ----
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon, rightIcon, className, ...props }, ref) => (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-ps5-text-secondary">
          {label}
          {props.required && <span className="text-ps5-danger ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-ps5-text-muted">{leftIcon}</div>
        )}
        <input
          ref={ref}
          className={cn(
            "w-full bg-ps5-surface border rounded-lg px-4 py-3 text-white placeholder-ps5-text-muted text-sm",
            "focus:outline-none focus:ring-1 transition-all duration-200",
            error
              ? "border-ps5-danger focus:border-ps5-danger focus:ring-ps5-danger/30"
              : "border-ps5-border focus:border-ps5-blue/60 focus:ring-ps5-blue/20",
            leftIcon && "pl-10",
            rightIcon && "pr-10",
            className
          )}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-ps5-text-muted">{rightIcon}</div>
        )}
      </div>
      {error && <p className="text-ps5-danger text-xs">{error}</p>}
      {hint && !error && <p className="text-ps5-text-muted text-xs">{hint}</p>}
    </div>
  )
);
Input.displayName = "Input";

// ---- TEXTAREA ----
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className, ...props }, ref) => (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-ps5-text-secondary">
          {label}
          {props.required && <span className="text-ps5-danger ml-1">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        className={cn(
          "w-full bg-ps5-surface border rounded-lg px-4 py-3 text-white placeholder-ps5-text-muted text-sm resize-none",
          "focus:outline-none focus:ring-1 transition-all duration-200",
          error
            ? "border-ps5-danger focus:border-ps5-danger focus:ring-ps5-danger/30"
            : "border-ps5-border focus:border-ps5-blue/60 focus:ring-ps5-blue/20",
          className
        )}
        {...props}
      />
      {error && <p className="text-ps5-danger text-xs">{error}</p>}
      {hint && !error && <p className="text-ps5-text-muted text-xs">{hint}</p>}
    </div>
  )
);
Textarea.displayName = "Textarea";

// ---- SELECT ----
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className, ...props }, ref) => (
    <div className="space-y-1.5">
      {label && <label className="block text-sm font-medium text-ps5-text-secondary">{label}</label>}
      <select
        ref={ref}
        className={cn(
          "w-full bg-ps5-surface border border-ps5-border rounded-lg px-4 py-3 text-white text-sm",
          "focus:outline-none focus:border-ps5-blue/60 focus:ring-1 focus:ring-ps5-blue/20 transition-all duration-200",
          "appearance-none cursor-pointer",
          error && "border-ps5-danger",
          className
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-ps5-surface">
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-ps5-danger text-xs">{error}</p>}
    </div>
  )
);
Select.displayName = "Select";

// ---- MODAL ----
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  showClose?: boolean;
}

const modalSizes = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-2xl",
  full: "max-w-5xl",
};

export function Modal({ isOpen, onClose, title, children, size = "md", showClose = true }: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              className={cn(
                "relative w-full bg-ps5-elevated border border-ps5-border rounded-2xl shadow-2xl overflow-hidden",
                modalSizes[size]
              )}
            >
              {(title || showClose) && (
                <div className="flex items-center justify-between px-6 py-4 border-b border-ps5-border">
                  {title && <h3 className="text-white font-display font-bold text-lg">{title}</h3>}
                  {showClose && (
                    <button
                      onClick={onClose}
                      className="p-1.5 rounded-lg text-ps5-text-muted hover:text-white hover:bg-ps5-muted transition-all ml-auto"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
              )}
              <div className="overflow-y-auto max-h-[80vh]">{children}</div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
