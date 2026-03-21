"use client";

import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { MaterialIcon } from "@/components/ui/material-icon";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Breadcrumb } from "./breadcrumb";
import { usePathname } from "next/navigation";

export function Header() {
  const { data: sessionData } = useSession();
  const pathname = usePathname();

  const mockUser = {
    name: 'admin',
    email: 'admin@admin.com',
    image: null,
  };

  const user = sessionData?.user || mockUser;
  const session = sessionData || { user: mockUser };

  // Hide header on POS and Kitchen screens for full-screen experience
  if (pathname === "/pos" || pathname === "/kitchen") {
    return null;
  }

  return (
    <header
      className="h-14 border-b flex items-center justify-between px-6 shrink-0 z-10"
      style={{
        background: "var(--md-sys-color-surface-container-low)",
        borderColor: "var(--md-sys-color-outline-variant)",
      }}
    >
      <div className="flex items-center gap-4">
        <Breadcrumb />
      </div>

      <div className="flex items-center gap-2">
        {/* MD3 Search bar hint */}
        <button
          className="hidden md:flex items-center gap-2 h-9 px-4 rounded-full text-body-md transition-colors"
          style={{
            background: "var(--md-sys-color-surface-container)",
            color: "var(--md-sys-color-on-surface-variant)",
          }}
        >
          <MaterialIcon icon="search" size={18} />
          <span className="w-40 text-left">Search...</span>
        </button>

        <Button variant="ghost" size="icon" className="relative">
          <MaterialIcon icon="notifications" size={22} style={{ color: "var(--md-sys-color-on-surface-variant)" }} />
          <span
            className="absolute top-2 right-2 w-2 h-2 rounded-full"
            style={{ background: "var(--md-sys-color-error)" }}
          />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || ""} />
                <AvatarFallback className="bg-primary/10 text-primary font-medium">
                  {session?.user?.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{session?.user?.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {session?.user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <MaterialIcon icon="person" size={16} className="mr-2" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <MaterialIcon icon="settings" size={16} className="mr-2" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/dashboard" })} className="text-destructive focus:text-destructive">
              <MaterialIcon icon="logout" size={16} className="mr-2" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
