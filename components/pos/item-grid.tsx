"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Category, MenuItem } from "@/types";
import { usePosStore } from "@/hooks/use-pos-store";
import { ModifierSheet } from "./modifier-sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Search, Zap } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { itemEntry } from "@/lib/utils/motion";
import { formatCurrency } from "@/lib/utils/currency";
import Fuse from "fuse.js";

interface ItemGridProps {
  categories: Category[];
  items: MenuItem[];
  activeCategoryId: string;
}

export function ItemGrid({ categories, items, activeCategoryId }: ItemGridProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<string>("all"); // all, veg, non_veg, bestseller
  const [selectedItemForModifiers, setSelectedItemForModifiers] = useState<MenuItem | null>(null);
  const { addToCart, cart, updateQuantity } = usePosStore();

  const fuse = useMemo(() => new Fuse(items, {
    keys: ['name', 'shortCode', 'tags'],
    threshold: 0.3,
  }), [items]);

  const filteredItems = useMemo(() => {
    let result = items;

    if (searchQuery) {
      result = fuse.search(searchQuery).map(res => res.item);
    } else if (activeCategoryId !== "all") {
      result = result.filter(item => item.categoryId === activeCategoryId);
    }

    if (filter === "veg") result = result.filter(i => i.foodType === "veg");
    if (filter === "non_veg") result = result.filter(i => i.foodType === "non_veg");
    if (filter === "bestseller") result = result.filter(i => i.isBestseller);

    return result;
  }, [items, searchQuery, activeCategoryId, filter, fuse]);

  const handleItemClick = (item: MenuItem) => {
    if (item.modifierGroups && item.modifierGroups.length > 0) {
      setSelectedItemForModifiers(item);
    } else {
      addToCart(item);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Top Bar */}
      <div className="p-4 bg-surface border-b border-border z-10 shadow-sm">
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input 
            placeholder="Search items, codes, tags... (Press / to focus)" 
            className="pl-10 bg-muted/50 border-transparent focus-visible:bg-surface h-12 text-lg rounded-xl"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <FilterChip label="All" active={filter === "all"} onClick={() => setFilter("all")} />
          <FilterChip label="🟢 Veg" active={filter === "veg"} onClick={() => setFilter("veg")} />
          <FilterChip label="🔴 Non-Veg" active={filter === "non_veg"} onClick={() => setFilter("non_veg")} />
          <FilterChip label="⭐ Bestseller" active={filter === "bestseller"} onClick={() => setFilter("bestseller")} />
          <FilterChip label="⚡ Quick" active={filter === "quick"} onClick={() => setFilter("quick")} icon={<Zap className="w-3 h-3 mr-1" />} />
        </div>
      </div>

      {/* Grid */}
      <ScrollArea className="flex-1 p-4">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4 pb-20">
          <AnimatePresence mode="popLayout">
            {filteredItems.map(item => {
              const cartItem = cart.find(i => i.itemId === item.id);
              
              return (
                <motion.div
                  key={item.id}
                  layout
                  {...itemEntry}
                  className="bg-surface rounded-2xl border border-border overflow-hidden flex flex-col hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer group"
                  onClick={() => !cartItem && handleItemClick(item)}
                >
                  <div className="relative h-32 bg-muted">
                    {/* Placeholder for image */}
                    {item.imageUrl ? (
                      <div className="relative w-full h-full">
                        <Image 
                          src={item.imageUrl} 
                          alt={item.name} 
                          fill 
                          className="object-cover" 
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground/30">
                        <Zap className="w-8 h-8" />
                      </div>
                    )}
                    
                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      <div className="bg-white p-1 rounded-sm shadow-sm">
                        <div className={`w-3 h-3 rounded-full ${item.foodType === 'veg' ? 'bg-success' : item.foodType === 'non_veg' ? 'bg-error' : 'bg-warning'}`} />
                      </div>
                    </div>
                    {item.isBestseller && (
                      <div className="absolute top-2 right-2 bg-warning text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
                        BESTSELLER
                      </div>
                    )}
                  </div>

                  <div className="p-3 flex flex-col flex-1">
                    <h3 className="font-bold text-sm leading-tight line-clamp-2 mb-1 group-hover:text-primary transition-colors">{item.name}</h3>
                    <div className="mt-auto flex items-end justify-between">
                      <span className="font-bold text-primary">{formatCurrency(item.basePrice)}</span>
                      
                      {cartItem ? (
                        <div className="flex items-center bg-primary text-white rounded-full overflow-hidden shadow-sm" onClick={(e) => e.stopPropagation()}>
                          <button 
                            className="w-8 h-8 flex items-center justify-center hover:bg-primary-dark transition-colors"
                            onClick={() => updateQuantity(cartItem.id, Math.max(0, cartItem.quantity - 1))}
                          >
                            -
                          </button>
                          <span className="w-6 text-center text-sm font-bold">{cartItem.quantity}</span>
                          <button 
                            className="w-8 h-8 flex items-center justify-center hover:bg-primary-dark transition-colors"
                            onClick={() => updateQuantity(cartItem.id, cartItem.quantity + 1)}
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <button className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                          <PlusIcon />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </ScrollArea>

      <ModifierSheet 
        key={selectedItemForModifiers?.id}
        isOpen={!!selectedItemForModifiers}
        onClose={() => setSelectedItemForModifiers(null)}
        item={selectedItemForModifiers}
      />
    </div>
  );
}

function FilterChip({ label, active, onClick, icon }: any) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors flex items-center border ${
        active ? "bg-secondary text-white border-secondary" : "bg-surface text-text-secondary border-border hover:bg-muted"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 1V13M1 7H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
