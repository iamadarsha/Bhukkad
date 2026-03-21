"use client";

import { AnimatePresence, motion } from "motion/react";
import { MaterialIcon } from "./material-icon";
import { cn } from "@/lib/utils";
import { snackbarAnim } from "@/lib/theme/motion";

interface SnackbarAction {
  label: string;
  onClick: () => void;
}

interface SnackbarProps {
  message: string;
  icon?: string;
  action?: SnackbarAction;
  open: boolean;
  onClose?: () => void;
  className?: string;
}

/**
 * MD3 Snackbar — bottom-center, inverse-surface background
 * Auto-dismiss is handled by the caller (e.g. setTimeout → setOpen(false))
 */
export function Snackbar({ message, icon, action, open, onClose, className }: SnackbarProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="snackbar"
          {...snackbarAnim}
          className={cn(
            "fixed bottom-6 left-1/2 -translate-x-1/2 z-[200]",
            "flex items-center gap-3 px-4 py-3 min-w-[280px] max-w-[560px]",
            "rounded-[var(--md-sys-shape-corner-extra-small)]",
            "bg-[var(--md-sys-color-inverse-surface)] text-[var(--md-sys-color-inverse-on-surface)]",
            "shadow-elevation-3",
            "text-body-md",
            className
          )}
          role="status"
          aria-live="polite"
        >
          {icon && (
            <MaterialIcon
              icon={icon}
              size={20}
              className="text-[var(--md-sys-color-inverse-on-surface)] shrink-0"
            />
          )}
          <span className="flex-1 text-body-md">{message}</span>
          {action && (
            <button
              onClick={() => {
                action.onClick();
                onClose?.();
              }}
              className="text-label-lg font-medium text-[var(--md-sys-color-inverse-primary)] hover:opacity-80 transition-opacity shrink-0 ml-2"
            >
              {action.label}
            </button>
          )}
          {onClose && !action && (
            <button
              onClick={onClose}
              className="text-[var(--md-sys-color-inverse-on-surface)] opacity-60 hover:opacity-100 transition-opacity ml-1"
            >
              <MaterialIcon icon="close" size={18} />
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
