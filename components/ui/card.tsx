import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * MD3 Card — three variants per spec:
 * elevated (default) | filled | outlined
 */

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: "elevated" | "filled" | "outlined"
  }
>(({ className, variant = "elevated", ...props }, ref) => {
  const base = "rounded-[var(--md-sys-shape-corner-medium)] text-[var(--md-sys-color-on-surface)] transition-shadow duration-200"
  const variants = {
    elevated: "bg-[var(--md-sys-color-surface-container-low)] shadow-elevation-1 hover:shadow-elevation-2",
    filled: "bg-[var(--md-sys-color-surface-container-highest)] shadow-none",
    outlined: "bg-[var(--md-sys-color-surface)] border border-[var(--md-sys-color-outline-variant)] shadow-none",
  }
  return (
    <div
      ref={ref}
      className={cn(base, variants[variant], className)}
      {...props}
    />
  )
})
Card.displayName = "Card"

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5 p-6", className)}
      {...props}
    />
  )
)
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("text-title-lg font-medium leading-none text-[var(--md-sys-color-on-surface)]", className)}
      {...props}
    />
  )
)
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-body-sm text-[var(--md-sys-color-on-surface-variant)]", className)}
      {...props}
    />
  )
)
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
  )
)
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center p-6 pt-0", className)}
      {...props}
    />
  )
)
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }
