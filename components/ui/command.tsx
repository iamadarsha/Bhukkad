"use client";

import * as React from "react";
import { Command as CommandPrimitive } from "cmdk";
import { cn } from "@/lib/utils";
import { Modal, ModalContent } from "@/components/ui/modal";

/**
 * MD3 Command / Search dialog
 * Uses surface-container for background, MD3 state layers for selection
 */

const Command = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    className={cn(
      "flex h-full w-full flex-col overflow-hidden",
      "rounded-[var(--md-sys-shape-corner-extra-small)]",
      "bg-[var(--md-sys-color-surface-container)]",
      "text-[var(--md-sys-color-on-surface)]",
      className
    )}
    {...props}
  />
));
Command.displayName = CommandPrimitive.displayName;

interface CommandDialogProps extends React.ComponentPropsWithoutRef<typeof Modal> {}

const CommandDialog = ({ children, ...props }: CommandDialogProps) => {
  return (
    <Modal {...props}>
      <ModalContent className="overflow-hidden p-0 shadow-elevation-3">
        <Command
          className={[
            "[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-1.5",
            "[&_[cmdk-group-heading]]:text-label-sm [&_[cmdk-group-heading]]:font-medium",
            "[&_[cmdk-group-heading]]:text-[var(--md-sys-color-on-surface-variant)]",
            "[&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0",
            "[&_[cmdk-group]]:px-2",
            "[&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5",
            "[&_[cmdk-input]]:h-12",
            "[&_[cmdk-item]]:px-3 [&_[cmdk-item]]:py-3",
            "[&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5",
          ].join(" ")}
        >
          {children}
        </Command>
      </ModalContent>
    </Modal>
  );
};

const CommandInput = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
  <div
    className="flex items-center border-b border-[var(--md-sys-color-outline-variant)] px-3"
    cmdk-input-wrapper=""
  >
    <span className="material-symbols-rounded mr-2 text-[20px] text-[var(--md-sys-color-on-surface-variant)] shrink-0">
      search
    </span>
    <CommandPrimitive.Input
      ref={ref}
      className={cn(
        "flex h-11 w-full rounded-md bg-transparent py-3 outline-none",
        "text-body-lg text-[var(--md-sys-color-on-surface)]",
        "placeholder:text-[var(--md-sys-color-on-surface-variant)]",
        "disabled:cursor-not-allowed disabled:opacity-38",
        className
      )}
      {...props}
    />
  </div>
));
CommandInput.displayName = CommandPrimitive.Input.displayName;

const CommandList = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    className={cn("max-h-[300px] overflow-y-auto overflow-x-hidden", className)}
    {...props}
  />
));
CommandList.displayName = CommandPrimitive.List.displayName;

const CommandEmpty = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>((props, ref) => (
  <CommandPrimitive.Empty
    ref={ref}
    className="py-6 text-center text-body-md text-[var(--md-sys-color-on-surface-variant)]"
    {...props}
  />
));
CommandEmpty.displayName = CommandPrimitive.Empty.displayName;

const CommandGroup = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    className={cn(
      "overflow-hidden p-1",
      "text-[var(--md-sys-color-on-surface)]",
      "[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-1.5",
      "[&_[cmdk-group-heading]]:text-label-sm [&_[cmdk-group-heading]]:font-medium",
      "[&_[cmdk-group-heading]]:text-[var(--md-sys-color-on-surface-variant)]",
      className
    )}
    {...props}
  />
));
CommandGroup.displayName = CommandPrimitive.Group.displayName;

const CommandSeparator = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 h-px bg-[var(--md-sys-color-outline-variant)]", className)}
    {...props}
  />
));
CommandSeparator.displayName = CommandPrimitive.Separator.displayName;

const CommandItem = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center gap-2",
      "rounded-[var(--md-sys-shape-corner-extra-small)]",
      "px-3 py-3 text-body-md text-[var(--md-sys-color-on-surface)]",
      "outline-none transition-colors",
      "aria-selected:bg-[color-mix(in_srgb,var(--md-sys-color-on-surface)_8%,transparent)]",
      "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-38",
      className
    )}
    {...props}
  />
));
CommandItem.displayName = CommandPrimitive.Item.displayName;

const CommandShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn(
        "ml-auto text-label-sm tracking-widest text-[var(--md-sys-color-on-surface-variant)]",
        className
      )}
      {...props}
    />
  );
};
CommandShortcut.displayName = "CommandShortcut";

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
};
