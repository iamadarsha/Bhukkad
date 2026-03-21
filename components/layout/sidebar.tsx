"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  MonitorSmartphone, 
  ChefHat, 
  ClipboardList, 
  Utensils, 
  Package, 
  Users, 
  Settings,
  CalendarDays
} from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "POS", href: "/pos", icon: MonitorSmartphone },
  { name: "KOT", href: "/kot", icon: ChefHat },
  { name: "Orders", href: "/orders", icon: ClipboardList },
  { name: "Reservations", href: "/reservations", icon: CalendarDays },
  { name: "Menu", href: "/menu", icon: Utensils },
  { name: "Inventory", href: "/inventory", icon: Package },
  { name: "Customers", href: "/customers", icon: Users },
  { name: "Reports", href: "/reports", icon: LayoutDashboard },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-20 lg:w-24 h-screen bg-[#1E293B] flex flex-col transition-all duration-300 z-30">
      <div className="h-16 flex items-center justify-center border-b border-white/10">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold shrink-0 shadow-lg shadow-primary/20">
          S
        </div>
      </div>

      <nav className="flex-1 py-6 flex flex-col gap-4 px-2 overflow-y-auto scrollbar-hide">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link key={item.name} href={item.href} className="relative group">
              <div className={cn(
                "relative flex flex-col items-center justify-center gap-1 py-3 rounded-xl transition-all duration-200",
                isActive 
                  ? "bg-primary text-white shadow-lg shadow-primary/20" 
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              )}>
                <Icon className={cn("w-6 h-6 shrink-0 transition-transform group-hover:scale-110")} />
                <span className="text-[10px] font-bold uppercase tracking-tighter">{item.name}</span>
                
                {item.name === "KOT" && !isActive && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full" />
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <div className="w-12 h-12 mx-auto rounded-xl bg-white/5 flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors">
          <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold shrink-0">
            A
          </div>
        </div>
      </div>
    </aside>
  );
}
