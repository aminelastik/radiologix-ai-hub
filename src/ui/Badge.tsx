import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "info" | "warning" | "danger" | "success" | "neutral" | "primary";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: Variant;
  dot?: boolean;
}

const styles: Record<Variant, string> = {
  info: "bg-info/10 text-info",
  warning: "bg-warning/15 text-warning",
  danger: "bg-danger/15 text-danger",
  success: "bg-success/15 text-success",
  neutral: "bg-muted text-muted-foreground",
  primary: "bg-primary/10 text-primary",
};

const dotStyles: Record<Variant, string> = {
  info: "bg-info",
  warning: "bg-warning",
  danger: "bg-danger",
  success: "bg-success",
  neutral: "bg-muted-foreground",
  primary: "bg-primary",
};

export const Badge = ({ className, variant = "neutral", dot, children, ...rest }: BadgeProps) => (
  <span
    className={cn(
      "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
      styles[variant],
      className,
    )}
    {...rest}
  >
    {dot && <span className={cn("h-1.5 w-1.5 rounded-full", dotStyles[variant])} />}
    {children}
  </span>
);
