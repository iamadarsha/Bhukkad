import { cn } from "@/lib/utils";

interface MaterialIconProps {
  icon: string;
  fill?: 0 | 1;
  weight?: 100 | 200 | 300 | 400 | 500 | 600 | 700;
  grade?: -50 | 0 | 200;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Material Symbols Rounded icon component.
 * Uses font-variation-settings for FILL animation — the signature MD3 interaction detail.
 *
 * @example
 * <MaterialIcon icon="restaurant" fill={1} size={24} />
 * <MaterialIcon icon="settings" fill={isActive ? 1 : 0} className="transition-all duration-200" />
 */
export function MaterialIcon({
  icon,
  fill = 0,
  weight = 400,
  grade = 0,
  size = 24,
  className,
  style,
}: MaterialIconProps) {
  return (
    <span
      className={cn("material-symbols-rounded select-none", className)}
      style={{
        fontSize: size,
        fontVariationSettings: `'FILL' ${fill}, 'wght' ${weight}, 'GRAD' ${grade}, 'opsz' ${size}`,
        lineHeight: 1,
        display: "inline-block",
        ...style,
      }}
      aria-hidden="true"
    >
      {icon}
    </span>
  );
}
