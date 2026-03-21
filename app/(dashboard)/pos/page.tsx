"use client";

import { useState, useEffect } from "react";
import { TableFloorPlan } from "@/components/pos/table-floor-plan";
import { ItemGrid } from "@/components/pos/item-grid";
import { OrderCart } from "@/components/pos/order-cart";
import type { Category, MenuItem, Table } from "@/types";
import { MaterialIcon } from "@/components/ui/material-icon";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { usePosStore } from "@/hooks/use-pos-store";
import { CustomerModal } from "@/components/pos/customer-modal";
import { AIChatbot } from "@/components/pos/ai-chatbot";
import { motion } from "motion/react";
import { fadeThrough } from "@/lib/theme/motion";

type OrderType = "dine_in" | "takeaway" | "delivery";

const ORDER_TYPES: { key: OrderType; label: string; icon: string }[] = [
  { key: "dine_in",   label: "Dine In",   icon: "table_restaurant" },
  { key: "takeaway",  label: "Takeaway",  icon: "takeout_dining" },
  { key: "delivery",  label: "Delivery",  icon: "delivery_dining" },
];

export default function POSPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [sections, setSections] = useState<{ id: string; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [showFloorPlan, setShowFloorPlan] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<{ name: string; id: string } | null>(null);

  const { selectedTableId, orderType, setOrderType } = usePosStore();

  const loadData = async () => {
    setIsRefreshing(true);
    // Demo data — no database required
    const demoCategories: Category[] = [
      { id: "cat-1", name: "Starters",    emoji: "🥗", displayOrder: 1, isActive: true },
      { id: "cat-2", name: "Main Course", emoji: "🍛", displayOrder: 2, isActive: true },
      { id: "cat-3", name: "Breads",      emoji: "🫓", displayOrder: 3, isActive: true },
      { id: "cat-4", name: "Beverages",   emoji: "🥤", displayOrder: 4, isActive: true },
      { id: "cat-5", name: "Desserts",    emoji: "🍮", displayOrder: 5, isActive: true },
      { id: "cat-6", name: "Combos",      emoji: "🍱", displayOrder: 6, isActive: true },
    ];
    const demoItems: MenuItem[] = [
      { id: "item-1", name: "Paneer Tikka",    categoryId: "cat-1", basePrice: 220, foodType: "veg",     isActive: true, isBestseller: true,  isChefsSpecial: false, spiceLevel: 2, prepTimeMinutes: 15, tags: [], shortCode: "PNTK" },
      { id: "item-2", name: "Chicken Tikka",   categoryId: "cat-1", basePrice: 280, foodType: "non_veg", isActive: true, isBestseller: true,  isChefsSpecial: false, spiceLevel: 3, prepTimeMinutes: 20, tags: [], shortCode: "CHTK" },
      { id: "item-3", name: "Butter Chicken",  categoryId: "cat-2", basePrice: 320, foodType: "non_veg", isActive: true, isBestseller: true,  isChefsSpecial: true,  spiceLevel: 2, prepTimeMinutes: 20, tags: [], shortCode: "BTCH" },
      { id: "item-4", name: "Dal Makhani",     categoryId: "cat-2", basePrice: 240, foodType: "veg",     isActive: true, isBestseller: false, isChefsSpecial: false, spiceLevel: 1, prepTimeMinutes: 25, tags: [], shortCode: "DLMK" },
      { id: "item-5", name: "Chicken Biryani", categoryId: "cat-2", basePrice: 350, foodType: "non_veg", isActive: true, isBestseller: true,  isChefsSpecial: true,  spiceLevel: 3, prepTimeMinutes: 30, tags: [], shortCode: "CHBR" },
      { id: "item-6", name: "Garlic Naan",     categoryId: "cat-3", basePrice:  60, foodType: "veg",     isActive: true, isBestseller: false, isChefsSpecial: false, spiceLevel: 0, prepTimeMinutes: 8,  tags: [], shortCode: "GNAN" },
      { id: "item-7", name: "Butter Naan",     categoryId: "cat-3", basePrice:  50, foodType: "veg",     isActive: true, isBestseller: false, isChefsSpecial: false, spiceLevel: 0, prepTimeMinutes: 8,  tags: [], shortCode: "BNAN" },
      { id: "item-8", name: "Lassi",           categoryId: "cat-4", basePrice:  80, foodType: "veg",     isActive: true, isBestseller: false, isChefsSpecial: false, spiceLevel: 0, prepTimeMinutes: 5,  tags: [], shortCode: "LSSI" },
      { id: "item-9", name: "Gulab Jamun",     categoryId: "cat-5", basePrice:  90, foodType: "veg",     isActive: true, isBestseller: false, isChefsSpecial: false, spiceLevel: 0, prepTimeMinutes: 5,  tags: [], shortCode: "GLJM" },
    ];
    const demoTables: Table[] = [
      { id: "t1", name: "T1", capacity: 4, shape: "square",    status: "available", sectionId: "sec-1", positionX: 100, positionY: 100, width: 80, height: 80 },
      { id: "t2", name: "T2", capacity: 2, shape: "circle",    status: "available", sectionId: "sec-1", positionX: 250, positionY: 100, width: 70, height: 70 },
      { id: "t3", name: "T3", capacity: 6, shape: "rectangle", status: "occupied",  sectionId: "sec-1", positionX: 400, positionY: 100, width: 120, height: 70 },
      { id: "t4", name: "T4", capacity: 4, shape: "square",    status: "available", sectionId: "sec-1", positionX: 100, positionY: 250, width: 80, height: 80 },
      { id: "t5", name: "T5", capacity: 2, shape: "circle",    status: "reserved",  sectionId: "sec-1", positionX: 250, positionY: 250, width: 70, height: 70 },
    ];
    setCategories(demoCategories);
    setItems(demoItems);
    setTables(demoTables);
    setSections([{ id: "sec-1", name: "Ground Floor" }]);
    setIsLoading(false);
    setIsRefreshing(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center" style={{ background: "var(--md-sys-color-surface)" }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-[var(--md-sys-color-primary-container)] border-t-[var(--md-sys-color-primary)] animate-spin" />
          <p className="text-body-md text-[var(--md-sys-color-on-surface-variant)]">Loading POS…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden" style={{ background: "var(--md-sys-color-surface-container-low)" }}>
      {/* ── Top Bar ── */}
      <div
        className="h-14 flex items-center justify-between px-4 shrink-0 z-20"
        style={{
          background: "var(--md-sys-color-surface-container-low)",
          borderBottom: "1px solid var(--md-sys-color-outline-variant)",
        }}
      >
        {/* MD3 Segmented Button — Order Type */}
        <div className="flex items-center gap-3">
          <div className="segmented-btn">
            {ORDER_TYPES.map(({ key, label, icon }) => (
              <button
                key={key}
                onClick={() => setOrderType(key)}
                className={cn("segmented-btn-item", orderType === key && "active")}
              >
                <MaterialIcon
                  icon={icon}
                  fill={orderType === key ? 1 : 0}
                  size={16}
                />
                <span>{label}</span>
              </button>
            ))}
          </div>

          {orderType === "dine_in" && (
            <>
              <div className="w-px h-6" style={{ background: "var(--md-sys-color-outline-variant)" }} />
              <Button
                variant={selectedTableId ? "tonal" : "outlined"}
                size="sm"
                onClick={() => setShowFloorPlan(true)}
              >
                <MaterialIcon icon="table_restaurant" fill={selectedTableId ? 1 : 0} size={16} />
                {selectedTableId ? `Table ${selectedTableId.replace("t", "")}` : "Select Table"}
              </Button>
            </>
          )}

          <Button
            variant={selectedCustomer ? "tonal" : "outlined"}
            size="sm"
            onClick={() => setShowCustomerModal(true)}
            style={selectedCustomer ? {
              background: "color-mix(in srgb, var(--md-sys-color-tertiary) 15%, transparent)",
              color: "var(--md-sys-color-tertiary)",
              borderColor: "var(--md-sys-color-tertiary)",
            } : undefined}
          >
            <MaterialIcon icon={selectedCustomer ? "person_check" : "person_add"} fill={selectedCustomer ? 1 : 0} size={16} />
            {selectedCustomer ? selectedCustomer.name : "Add Customer"}
          </Button>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <div
            className="flex items-center gap-1.5 px-3 py-1 rounded-full text-label-sm font-medium"
            style={{
              background: "color-mix(in srgb, #386A20 15%, transparent)",
              color: "#386A20",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#386A20] animate-pulse" />
            Online
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={loadData}
            disabled={isRefreshing}
          >
            <MaterialIcon
              icon="refresh"
              size={20}
              className={isRefreshing ? "animate-spin" : ""}
              style={{ color: "var(--md-sys-color-on-surface-variant)" }}
            />
          </Button>
        </div>
      </div>

      {/* ── Three-panel layout ── */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Category Rail (vertical) */}
        <div
          className="w-20 lg:w-24 flex-shrink-0 flex flex-col h-full overflow-y-auto scrollbar-hide"
          style={{
            background: "var(--md-sys-color-surface-container-lowest)",
            borderRight: "1px solid var(--md-sys-color-outline-variant)",
          }}
        >
          {/* All category */}
          <CategoryChip
            emoji="🍽️"
            label="All"
            active={activeCategory === "all"}
            onClick={() => setActiveCategory("all")}
          />
          {categories.map(cat => (
            <CategoryChip
              key={cat.id}
              emoji={cat.emoji ?? "🍴"}
              label={cat.name}
              active={activeCategory === cat.id}
              onClick={() => setActiveCategory(cat.id)}
            />
          ))}
        </div>

        {/* Center Panel: Menu Items Grid */}
        <motion.div
          key={activeCategory}
          {...fadeThrough}
          className="flex-1 flex flex-col h-full min-w-0"
        >
          <ItemGrid
            categories={categories}
            items={items}
            activeCategoryId={activeCategory}
          />
        </motion.div>

        {/* Right Panel: Order Cart */}
        <div
          className="w-[360px] lg:w-[400px] flex-shrink-0 flex flex-col h-full z-10"
          style={{
            background: "var(--md-sys-color-surface-container-lowest)",
            borderLeft: "1px solid var(--md-sys-color-outline-variant)",
            boxShadow: "var(--md-sys-elevation-2)",
          }}
        >
          <OrderCart />
        </div>
      </div>

      {/* Floor Plan Dialog */}
      <Dialog open={showFloorPlan} onOpenChange={setShowFloorPlan}>
        <DialogContent
          className="max-w-4xl h-[80vh] p-0 overflow-hidden flex flex-col"
          style={{
            borderRadius: "var(--md-sys-shape-corner-extra-large)",
            background: "var(--md-sys-color-surface-container-low)",
          }}
        >
          <div
            className="p-6 flex items-center justify-between shrink-0"
            style={{ borderBottom: "1px solid var(--md-sys-color-outline-variant)" }}
          >
            <div>
              <DialogTitle className="text-headline-sm font-medium" style={{ color: "var(--md-sys-color-on-surface)" }}>
                Table Management
              </DialogTitle>
              <p className="text-body-sm mt-0.5" style={{ color: "var(--md-sys-color-on-surface-variant)" }}>
                Select a table to start an order
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setShowFloorPlan(false)}>
              <MaterialIcon icon="close" size={20} style={{ color: "var(--md-sys-color-on-surface-variant)" }} />
            </Button>
          </div>
          <div className="flex-1 overflow-hidden">
            <TableFloorPlan
              tables={tables}
              sections={sections}
              onSelect={() => setShowFloorPlan(false)}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Customer Modal */}
      <CustomerModal
        isOpen={showCustomerModal}
        onClose={() => setShowCustomerModal(false)}
        onSelect={(customer: { name: string; id: string }) => {
          if (customer?.name && customer?.id) setSelectedCustomer(customer);
        }}
      />

      <AIChatbot />
    </div>
  );
}

// ── Category Chip ────────────────────────────────────────────────────────────
function CategoryChip({
  emoji,
  label,
  active,
  onClick,
}: {
  emoji: string;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex flex-col items-center justify-center gap-1.5 py-3 px-1 transition-colors duration-150 relative",
        active ? "text-[var(--md-sys-color-on-secondary-container)]" : "text-[var(--md-sys-color-on-surface-variant)] hover:text-[var(--md-sys-color-on-surface)]"
      )}
      style={active ? { background: "color-mix(in srgb, var(--md-sys-color-secondary-container) 60%, transparent)" } : undefined}
    >
      {/* Active indicator bar on right edge */}
      {active && (
        <motion.div
          layoutId="category-indicator"
          className="absolute right-0 top-2 bottom-2 w-1 rounded-full"
          style={{ background: "var(--md-sys-color-primary)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        />
      )}
      <span className="text-xl">{emoji}</span>
      <span
        className="text-[9px] font-semibold text-center uppercase tracking-wider line-clamp-1 leading-tight"
      >
        {label}
      </span>
    </button>
  );
}
