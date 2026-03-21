"use client";

import { useState, useEffect, useRef } from "react";
import { getSocket } from "@/lib/socket";
import { apiClient } from "@/lib/api-client";
import { KotCard } from "@/components/kitchen/kot-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MaterialIcon } from "@/components/ui/material-icon";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { fadeThrough } from "@/lib/theme/motion";

interface KOT {
  id: string;
  status: "pending" | "preparing" | "ready" | "served";
  orderType?: string;
  createdAt?: string;
  items?: { name: string; quantity: number }[];
}

const URGENCY_THRESHOLD_MS = 10 * 60 * 1000; // 10 minutes

function isUrgent(kot: KOT): boolean {
  if (!kot.createdAt) return false;
  return Date.now() - new Date(kot.createdAt).getTime() > URGENCY_THRESHOLD_MS;
}

export default function KitchenPage() {
  const [kots, setKots] = useState<KOT[]>([]);
  const [filter, setFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const urgentChimeRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    async function fetchKots() {
      try {
        const sessionRes = await fetch("/api/auth/session");
        const session = await sessionRes.json();
        const outletId = session?.user?.outletId;

        if (outletId) {
          const socket = getSocket();
          socket.emit("kitchen:join", { outletId });

          socket.on("kot:new", (data: KOT) => {
            setKots(prev => [data, ...prev]);
            toast("New Order Received!", { icon: "🔔" });
          });

          socket.on("kot:updated", ({ id, status }: { id: string; status: KOT["status"] }) => {
            setKots(prev => prev.map(k => k.id === id ? { ...k, status } : k));
          });
        }

        const res = await apiClient.get("/kitchen/kots");
        setKots(res.data);
      } catch {
        toast.error("Failed to load KOTs");
      } finally {
        setIsLoading(false);
      }
    }
    fetchKots();

    return () => {
      const socket = getSocket();
      socket.off("kot:new");
      socket.off("kot:updated");
      if (urgentChimeRef.current) clearInterval(urgentChimeRef.current);
    };
  }, []);

  // Periodic urgency check — chime every 2 minutes if there are urgent KOTs
  useEffect(() => {
    urgentChimeRef.current = setInterval(() => {
      const urgentCount = kots.filter(k => k.status !== "served" && k.status !== "ready" && isUrgent(k)).length;
      if (urgentCount > 0) {
        toast.warning(`⚠️ ${urgentCount} delayed order${urgentCount > 1 ? "s" : ""} need attention!`);
      }
    }, 2 * 60 * 1000);

    return () => {
      if (urgentChimeRef.current) clearInterval(urgentChimeRef.current);
    };
  }, [kots]);

  const handleStatusChange = async (kotId: string, newStatus: string) => {
    setKots(prev => prev.map(k => k.id === kotId ? { ...k, status: newStatus as KOT["status"] } : k));
    try {
      await apiClient.patch(`/kitchen/kots/${kotId}`, { status: newStatus });
    } catch {
      toast.error("Failed to update status");
    }
  };

  const filteredKots = kots.filter(k => {
    if (k.status === "served") return false;
    if (filter !== "all" && k.orderType !== filter) return false;
    return true;
  });

  const pendingCount = kots.filter(k => k.status === "pending").length;
  const preparingCount = kots.filter(k => k.status === "preparing").length;
  const readyCount = kots.filter(k => k.status === "ready").length;
  const urgentCount = filteredKots.filter(k => isUrgent(k) && k.status !== "ready").length;

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center" style={{ background: "var(--md-sys-color-surface-dim)" }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-[var(--md-sys-color-surface-container)] border-t-[var(--md-sys-color-primary)] animate-spin" />
          <p className="text-body-md" style={{ color: "var(--md-sys-color-on-surface-variant)" }}>Loading kitchen…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full" style={{ background: "var(--md-sys-color-surface-dim)" }}>
      {/* ── Stats Bar ── */}
      <div
        className="flex items-center justify-between px-6 py-3 shrink-0 z-10"
        style={{
          background: "var(--md-sys-color-surface-container)",
          borderBottom: "1px solid var(--md-sys-color-outline-variant)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-[var(--md-sys-shape-corner-medium)] flex items-center justify-center"
            style={{ background: "var(--md-sys-color-primary-container)" }}
          >
            <MaterialIcon icon="soup_kitchen" size={20} fill={1} style={{ color: "var(--md-sys-color-on-primary-container)" }} />
          </div>
          <div>
            <h1 className="text-title-md font-medium" style={{ color: "var(--md-sys-color-on-surface)" }}>
              Kitchen Display
            </h1>
            {urgentCount > 0 && (
              <p className="text-label-sm font-medium" style={{ color: "var(--md-sys-color-error)" }}>
                ⚠️ {urgentCount} delayed order{urgentCount > 1 ? "s" : ""}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-6">
          <KitchenStat icon="pending" label="Pending" count={pendingCount} color="var(--md-sys-color-error)" />
          <KitchenStat icon="play_circle" label="Preparing" count={preparingCount} color="#005DB6" />
          <KitchenStat icon="check_circle" label="Ready" count={readyCount} color="#386A20" />
          <div className="w-px h-8" style={{ background: "var(--md-sys-color-outline-variant)" }} />
          <div className="text-right">
            <p className="text-label-sm font-medium" style={{ color: "var(--md-sys-color-outline)" }}>Avg Prep</p>
            <p className="text-title-sm font-semibold font-mono" style={{ color: "var(--md-sys-color-on-surface)" }}>14m 30s</p>
          </div>
        </div>
      </div>

      {/* ── Filter chips ── */}
      <div
        className="px-6 py-2 flex items-center gap-2 overflow-x-auto scrollbar-hide shrink-0"
        style={{ borderBottom: "1px solid var(--md-sys-color-outline-variant)" }}
      >
        <MaterialIcon icon="tune" size={16} style={{ color: "var(--md-sys-color-outline)" }} />
        {[
          { key: "all", label: "All Orders" },
          { key: "dine_in", label: "Dine In" },
          { key: "takeaway", label: "Takeaway" },
          { key: "delivery", label: "Delivery" },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={cn(
              "px-4 py-1.5 rounded-full text-label-md font-medium whitespace-nowrap transition-all duration-150",
              filter === key ? "shadow-elevation-1" : ""
            )}
            style={
              filter === key
                ? {
                    background: "var(--md-sys-color-secondary-container)",
                    color: "var(--md-sys-color-on-secondary-container)",
                  }
                : {
                    background: "transparent",
                    color: "var(--md-sys-color-on-surface-variant)",
                    border: "1px solid var(--md-sys-color-outline-variant)",
                  }
            }
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── KOT Grid ── */}
      <ScrollArea className="flex-1 p-6">
        <AnimatePresence mode="wait">
          {filteredKots.length === 0 ? (
            <motion.div
              key="empty"
              {...fadeThrough}
              className="flex flex-col items-center justify-center py-24 gap-4"
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="text-6xl"
              >
                ☕
              </motion.div>
              <div className="text-center">
                <p className="text-title-md font-medium" style={{ color: "var(--md-sys-color-on-surface)" }}>
                  The calm before the rush
                </p>
                <p className="text-body-sm mt-1" style={{ color: "var(--md-sys-color-on-surface-variant)" }}>
                  No active orders right now. First order incoming…
                </p>
              </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4 pb-6">
              <AnimatePresence mode="popLayout">
                {filteredKots.map(kot => (
                  <motion.div
                    key={kot.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25 }}
                    className={cn(isUrgent(kot) && kot.status !== "ready" ? "kot-urgent" : "")}
                  >
                    <KotCard
                      kot={kot}
                      onStatusChange={handleStatusChange}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </AnimatePresence>
      </ScrollArea>
    </div>
  );
}

function KitchenStat({ icon, label, count, color }: { icon: string; label: string; count: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <MaterialIcon icon={icon} size={20} style={{ color }} />
      <div>
        <p className="text-label-sm font-medium leading-none" style={{ color: "var(--md-sys-color-outline)" }}>
          {label}
        </p>
        <p className="text-title-sm font-semibold leading-tight" style={{ color: "var(--md-sys-color-on-surface)" }}>
          {count}
        </p>
      </div>
    </div>
  );
}
