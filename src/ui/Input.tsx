import { InputHTMLAttributes, forwardRef, useId } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, ...rest }, ref) => {
    const auto = useId();
    const inputId = id ?? auto;
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-foreground">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "w-full h-10 px-3.5 rounded-xl border border-input bg-card text-sm text-foreground placeholder:text-muted-foreground",
            "transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-danger focus:ring-danger",
            className,
          )}
          aria-invalid={!!error || undefined}
          aria-describedby={error ? `${inputId}-err` : hint ? `${inputId}-hint` : undefined}
          {...rest}
        />
        {error ? (
          <p id={`${inputId}-err`} className="text-xs text-danger">{error}</p>
        ) : hint ? (
          <p id={`${inputId}-hint`} className="text-xs text-muted-foreground">{hint}</p>
        ) : null}
      </div>
    );
  },
);
Input.displayName = "Input";
