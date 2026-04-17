import { ReactNode, useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { IconButton } from "./IconButton";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
  footer?: ReactNode;
}

export const Modal = ({ open, onClose, title, description, children, className, footer }: ModalProps) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={onClose} />
      <div
        className={cn(
          "relative w-full max-w-lg rounded-2xl bg-card shadow-elegant animate-slide-up-fade",
          className,
        )}
      >
        {(title || description) && (
          <div className="flex items-start justify-between p-6 pb-2">
            <div>
              {title && <h2 className="text-lg font-semibold text-foreground">{title}</h2>}
              {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
            </div>
            <IconButton aria-label="Close" onClick={onClose} size="sm">
              <X className="h-4 w-4" />
            </IconButton>
          </div>
        )}
        <div className="p-6 pt-4">{children}</div>
        {footer && <div className="px-6 pb-6 pt-2 flex items-center justify-end gap-2">{footer}</div>}
      </div>
    </div>
  );
};
