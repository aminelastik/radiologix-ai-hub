import { forwardRef, ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "ghost" | "solid" | "outline" | "primary";
type Size = "sm" | "md" | "lg";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  "aria-label": string;
  variant?: Variant;
  size?: Size;
}

const variants: Record<Variant, string> = {
  ghost: "bg-transparent text-foreground hover:bg-secondary",
  solid: "bg-card text-foreground hover:bg-secondary border border-border",
  outline: "bg-transparent border border-border text-foreground hover:bg-secondary",
  primary: "bg-primary text-primary-foreground hover:bg-primary/90",
};
const sizes: Record<Size, string> = {
  sm: "h-8 w-8 rounded-lg",
  md: "h-10 w-10 rounded-xl",
  lg: "h-12 w-12 rounded-xl",
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, variant = "ghost", size = "md", ...rest }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className,
      )}
      {...rest}
    />
  ),
);
IconButton.displayName = "IconButton";
