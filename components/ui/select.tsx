"use client"

import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { cn } from "@/lib/utils"

/**
 * MD3 Select / Dropdown
 * https://m3.material.io/components/menus/overview
 *
 * Trigger uses filled text field style (surface-container-highest + bottom border)
 * Menu uses surface-container (elevation 2) with extra-small shape
 */

const Select = SelectPrimitive.Root
const SelectGroup = SelectPrimitive.Group
const SelectValue = SelectPrimitive.Value

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex h-14 w-full items-center justify-between",
      "rounded-t-[var(--md-sys-shape-corner-extra-small)] rounded-b-none",
      "bg-[var(--md-sys-color-surface-container-highest)]",
      "border-b border-[var(--md-sys-color-on-surface-variant)]",
      "px-4 text-body-lg text-[var(--md-sys-color-on-surface)]",
      "focus:outline-none focus:border-b-2 focus:border-[var(--md-sys-color-primary)]",
      "disabled:cursor-not-allowed disabled:opacity-38",
      "[&>span]:line-clamp-1",
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <span className="material-symbols-rounded text-[20px] text-[var(--md-sys-color-on-surface-variant)]">
        expand_more
      </span>
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn("flex cursor-default items-center justify-center py-1", className)}
    {...props}
  >
    <span className="material-symbols-rounded text-[18px]">expand_less</span>
  </SelectPrimitive.ScrollUpButton>
))
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn("flex cursor-default items-center justify-center py-1", className)}
    {...props}
  >
    <span className="material-symbols-rounded text-[18px]">expand_more</span>
  </SelectPrimitive.ScrollDownButton>
))
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "relative z-50 max-h-96 min-w-[8rem] overflow-hidden",
        "rounded-[var(--md-sys-shape-corner-extra-small)]",
        "bg-[var(--md-sys-color-surface-container)]",
        "text-[var(--md-sys-color-on-surface)]",
        "shadow-elevation-2",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=top]:-translate-y-1",
        className
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          "p-1",
          position === "popper" &&
            "h-[var(--radix-select-content-available-height)] w-full min-w-[var(--radix-select-trigger-width)]"
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn(
      "px-3 py-1.5 text-label-sm font-medium text-[var(--md-sys-color-on-surface-variant)]",
      className
    )}
    {...props}
  />
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center",
      "rounded-[var(--md-sys-shape-corner-extra-small)]",
      "py-3 pl-10 pr-3",
      "text-body-lg text-[var(--md-sys-color-on-surface)]",
      "outline-none",
      "hover:bg-[color-mix(in_srgb,var(--md-sys-color-on-surface)_8%,transparent)]",
      "focus:bg-[color-mix(in_srgb,var(--md-sys-color-on-surface)_8%,transparent)]",
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-38",
      className
    )}
    {...props}
  >
    <span className="absolute left-3 flex h-4 w-4 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <span className="material-symbols-rounded text-[18px] text-[var(--md-sys-color-primary)]">
          check
        </span>
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-[var(--md-sys-color-outline-variant)]", className)}
    {...props}
  />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
}
