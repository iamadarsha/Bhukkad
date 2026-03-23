import { cn } from "@/lib/utils";

type BrandMarkProps = {
  className?: string;
  compact?: boolean;
  withTagline?: boolean;
};

export function BrandMark({
  className,
  compact = false,
  withTagline = false,
}: BrandMarkProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="flex h-12 w-12 items-center justify-center rounded-[var(--radius-large)] bg-gradient-to-br from-primary via-primary-dark to-tertiary text-primary-foreground shadow-[var(--shadow-brand)]">
        <span className="brand-display text-xl font-semibold">B</span>
      </div>
      {!compact && (
        <div className="min-w-0">
          <div className="brand-display text-xl font-semibold leading-tight text-foreground">
            Bhukkad
          </div>
          <div className="mt-1 text-[10px] font-black uppercase tracking-[0.24em] text-muted-foreground">
            Restaurant OS
          </div>
          {withTagline && (
            <p className="mt-2 max-w-xs text-xs font-medium leading-relaxed text-muted-foreground">
              Built for hungry dining rooms, fast kitchens, and operators who need service clarity.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
