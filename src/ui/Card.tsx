import { HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...rest }, ref) => (
    <div
      ref={ref}
      className={cn("rounded-2xl bg-card text-card-foreground shadow-card", className)}
      {...rest}
    />
  ),
);
Card.displayName = "Card";

export const CardHeader = ({ className, ...rest }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("p-6 pb-2", className)} {...rest} />
);
export const CardTitle = ({ className, ...rest }: HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className={cn("text-lg font-semibold tracking-tight", className)} {...rest} />
);
export const CardDescription = ({ className, ...rest }: HTMLAttributes<HTMLParagraphElement>) => (
  <p className={cn("text-sm text-muted-foreground", className)} {...rest} />
);
export const CardContent = ({ className, ...rest }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("p-6 pt-4", className)} {...rest} />
);
export const CardFooter = ({ className, ...rest }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("p-6 pt-2 flex items-center", className)} {...rest} />
);
