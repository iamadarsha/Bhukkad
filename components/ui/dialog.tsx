import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { cn } from "@/lib/utils"

/**
 * MD3 Dialog
 * https://m3.material.io/components/dialogs/overview
 *
 * - Shape: extra-large (28px)
 * - Background: surface-container-high
 * - Scrim: black/32 (MD3 scrim spec)
 * - Motion: emphasized easing for enter, emphasized-accelerate for exit
 */

const Dialog = DialogPrimitive.Root
const DialogTrigger = DialogPrimitive.Trigger
const DialogPortal = DialogPrimitive.Portal
const DialogClose = DialogPrimitive.Close

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50",
      "bg-[var(--md-sys-color-scrim)]/32",
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      "data-[state=open]:duration-[var(--md-sys-motion-duration-medium2)]",
      "data-[state=closed]:duration-[var(--md-sys-motion-duration-short4)]",
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2",
        "w-full max-w-[560px] min-w-[280px]",
        "rounded-[var(--md-sys-shape-corner-extra-large)]",
        "bg-[var(--md-sys-color-surface-container-high)]",
        "text-[var(--md-sys-color-on-surface)]",
        "shadow-elevation-3",
        "p-6 flex flex-col gap-4",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-[state=open]:duration-[var(--md-sys-motion-duration-medium2)]",
        "data-[state=closed]:duration-[var(--md-sys-motion-duration-short4)]",
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close
        className={cn(
          "absolute right-4 top-4",
          "inline-flex h-10 w-10 items-center justify-center rounded-full",
          "text-[var(--md-sys-color-on-surface-variant)]",
          "opacity-70 hover:opacity-100",
          "hover:bg-[color-mix(in_srgb,var(--md-sys-color-on-surface)_8%,transparent)]",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--md-sys-color-primary)]",
          "transition-opacity disabled:pointer-events-none"
        )}
      >
        <span className="material-symbols-rounded text-[20px]">close</span>
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex flex-col gap-2 pr-8", className)}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex flex-row justify-end gap-2", className)}
    {...props}
  />
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-headline-sm font-medium text-[var(--md-sys-color-on-surface)]",
      className
    )}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-body-md text-[var(--md-sys-color-on-surface-variant)]", className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
