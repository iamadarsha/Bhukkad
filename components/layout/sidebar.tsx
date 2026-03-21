"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { MaterialIcon } from "@/components/ui/material-icon";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { formatCurrency } from "@/lib/utils/currency";
import { getSocket } from "@/lib/socket";

interface NavItem {
  name: string;
  href: string;
  icon: string;        // Material Symbol name (inactive = outlined)
  iconFilled: string;  // Same symbol name (filled variant via FILL=1)
}

const navItems: NavItem[] = [
  { name: "Dashboard", href: "/dashboard",     icon: "dashboard",         iconFilled: "dashboard" },
  { name: "POS",       href: "/pos",           icon: "point_of_sale",     iconFilled: "point_of_sale" },
  { name: "Kitchen",   href: "/kitchen",       icon: "soup_kitchen",      iconFilled: "soup_kitchen" },
  { name: "KOT",       href: "/kot",           icon: "receipt_long",      iconFilled: "receipt_long" },
  { name: "Orders",    href: "/orders",        icon: "receipt_long",      iconFilled: "receipt_long" },
  { name: "Tables",    href: "/tables",        icon: "table_restaurant",  iconFilled: "table_restaurant" },
  { name: "Menu",      href: "/menu",          icon: "menu_book",         iconFilled: "menu_book" },
  { name: "Inventory", href: "/inventory",     icon: "inventory_2",       iconFilled: "inventory_2" },
  { name: "Customers", href: "/customers",     icon: "group",             iconFilled: "group" },
  { name: "Reports",   href: "/reports",       icon: "bar_chart",         iconFilled: "bar_chart" },
  { name: "Settings",  href: "/settings",      icon: "settings",          iconFilled: "settings" },
];

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [todayRevenue, setTodayRevenue] = useState(0);
  const [prevRevenue, setPrevRevenue] = useState(0);
  const [revenueUpdated, setRevenueUpdated] = useState(false);

  const firstName = session?.user?.name?.split(" ")[0] ?? "Chef";

  // Live revenue ticker via Socket.io
  useEffect(() => {
    const socket = getSocket();

    socket.on("payment:completed", ({ amount }: { amount: number }) => {
      setTodayRevenue(prev => {
        setPrevRevenue(prev);
        setRevenueUpdated(true);
        setTimeout(() => setRevenueUpdated(false), 1500);
        return prev + amount;
      });
    });

    // Fetch today's revenue on mount
    fetch("/api/orders/history?date=today")
      .then(r => r.json())
      .then((data: { totalRevenue?: number }) => {
        if (data?.totalRevenue) setTodayRevenue(data.totalRevenue);
      })
      .catch(() => {});

    return () => {
      socket.off("payment:completed");
    };
  }, []);

  return (
    <aside className="w-20 lg:w-24 h-screen flex flex-col shrink-0 z-30 bg-[var(--md-sys-color-surface-container-low)] border-r border-[var(--md-sys-color-outline-variant)]">
      {/* Logo / Brand */}
      <div className="h-16 flex items-center justify-center border-b border-[var(--md-sys-color-outline-variant)] shrink-0">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="w-10 h-10 rounded-[var(--md-sys-shape-corner-medium)] flex items-center justify-center text-lg font-bold shadow-elevation-2 shrink-0"
          style={{
            background: "var(--md-sys-color-primary)",
            color: "var(--md-sys-color-on-primary)",
          }}
        >
          B
        </motion.div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 py-4 flex flex-col gap-1 px-2 overflow-y-auto scrollbar-hide">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const hasKotBadge = item.href === "/kot";

          return (
            <Link key={item.name} href={item.href} className="relative group block">
              <div
                className={cn(
                  "relative flex flex-col items-center justify-center gap-1 py-2 rounded-[var(--md-sys-shape-corner-large)] transition-colors duration-200",
                  isActive
                    ? "text-[var(--md-sys-color-on-secondary-container)]"
                    : "text-[var(--md-sys-color-on-surface-variant)] hover:text-[var(--md-sys-color-on-surface)]"
                )}
              >
                {/* MD3 Active Indicator pill behind icon */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      layoutId="nav-active-indicator"
                      className="absolute inset-x-0 top-0 h-8 mx-1 rounded-full"
                      style={{ background: "var(--md-sys-color-secondary-container)" }}
                      initial={{ opacity: 0, scaleX: 0.8 }}
                      animate={{ opacity: 1, scaleX: 1 }}
                      exit={{ opacity: 0, scaleX: 0.8 }}
                      transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
                    />
                  )}
                </AnimatePresence>

                {/* Icon with FILL animation — the signature MD3 interaction */}
                <div className="relative z-10 h-8 flex items-center justify-center">
                  <MaterialIcon
                    icon={item.icon}
                    fill={isActive ? 1 : 0}
                    size={22}
                    className="transition-all duration-200"
                    style={{
                      color: isActive
                        ? "var(--md-sys-color-on-secondary-container)"
                        : "var(--md-sys-color-on-surface-variant)",
                    }}
                  />
                  {/* KOT notification dot */}
                  {hasKotBadge && !isActive && (
                    <span
                      className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full"
                      style={{ background: "var(--md-sys-color-error)" }}
                    />
                  )}
                </div>

                {/* Label */}
                <span
                  className={cn(
                    "text-[10px] font-medium tracking-wider leading-none transition-colors",
                    isActive
                      ? "text-[var(--md-sys-color-on-secondary-container)]"
                      : "text-[var(--md-sys-color-on-surface-variant)]"
                  )}
                >
                  {item.name}
                </span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Live Revenue Ticker + User avatar */}
      <div className="p-2 pb-4 border-t border-[var(--md-sys-color-outline-variant)] space-y-2 shrink-0">
        {/* Revenue ticker */}
        <div
          className={cn(
            "px-2 py-1.5 rounded-[var(--md-sys-shape-corner-small)] text-center",
            "bg-[var(--md-sys-color-primary-container)]"
          )}
        >
          <p className="text-[8px] font-semibold uppercase tracking-widest text-[var(--md-sys-color-on-primary-container)] opacity-70">
            Today
          </p>
          <motion.p
            key={todayRevenue}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={cn(
              "text-[10px] font-bold revenue-ticker text-[var(--md-sys-color-on-primary-container)]",
              revenueUpdated && "text-[var(--md-sys-color-primary)]"
            )}
          >
            {formatCurrency(todayRevenue)}
          </motion.p>
        </div>

        {/* User avatar */}
        <div className="flex items-center justify-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title={`${getGreeting()}, ${firstName}`}
            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold cursor-pointer shadow-elevation-1"
            style={{
              background: "var(--md-sys-color-tertiary-container)",
              color: "var(--md-sys-color-on-tertiary-container)",
            }}
          >
            {firstName.charAt(0).toUpperCase()}
          </motion.div>
        </div>
      </div>
    </aside>
  );
}
