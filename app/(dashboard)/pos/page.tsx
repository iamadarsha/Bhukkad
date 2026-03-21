"use client";

import { useState, useEffect } from "react";
import { TableFloorPlan } from "@/components/pos/table-floor-plan";
import { ItemGrid } from "@/components/pos/item-grid";
import { OrderCart } from "@/components/pos/order-cart";
import { apiClient } from "@/lib/api-client";
import { Category, MenuItem, Table } from "@/types";
import { Loader2, Search, Bell, Utensils, ShoppingBag, Truck, LayoutGrid, X, UserPlus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { usePosStore } from "@/hooks/use-pos-store";
import { CustomerModal } from "@/components/pos/customer-modal";
import { AIChatbot } from "@/components/pos/ai-chatbot";

export default function POSPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [showFloorPlan, setShowFloorPlan] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);

  const { selectedTableId, orderType, setOrderType } = usePosStore();

  const loadData = async () => {
    setIsRefreshing(true);
    try {
      const sessionRes = await fetch('/api/auth/session');
      const session = await sessionRes.json();
      const outletId = session?.user?.outletId;

      if (outletId) {
        const { getSocket } = await import('@/lib/socket');
        const socket = getSocket();
        socket.emit("pos:join", { outletId });

        socket.on("table:updated", ({ tableId, status, currentOrderId }) => {
          setTables(prev => prev.map(t => t.id === tableId ? { ...t, status, currentOrderId } : t));
        });
      }

      const [catsRes, itemsRes, tablesRes] = await Promise.all([
        apiClient.get("/menu/categories"),
        apiClient.get("/menu/items"),
        apiClient.get("/tables"),
      ]);
      setCategories(catsRes.data);
      setItems(itemsRes.data);
      setTables(tablesRes.data.tables);
      setSections(tablesRes.data.sections);
    } catch (error) {
      console.error("Failed to load POS data", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();

    return () => {
      import('@/lib/socket').then(({ getSocket }) => {
        const socket = getSocket();
        socket.off("table:updated");
      });
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#F4F7FA]">
      {/* Top Bar: Order Types & Quick Actions */}
      <div className="h-16 bg-white border-b border-border flex items-center justify-between px-6 shrink-0 z-20 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex bg-[#F0F2F5] p-1 rounded-xl">
            <OrderTypeTab 
              active={orderType === 'dine_in'} 
              onClick={() => setOrderType('dine_in')} 
              label="Dine In" 
              icon={<Utensils className="w-4 h-4" />} 
            />
            <OrderTypeTab 
              active={orderType === 'takeaway'} 
              onClick={() => setOrderType('takeaway')} 
              label="Takeaway" 
              icon={<ShoppingBag className="w-4 h-4" />} 
            />
            <OrderTypeTab 
              active={orderType === 'delivery'} 
              onClick={() => setOrderType('delivery')} 
              label="Delivery" 
              icon={<Truck className="w-4 h-4" />} 
            />
          </div>
          
          {orderType === 'dine_in' && (
            <div className="h-8 w-px bg-border mx-2" />
          )}
          
          {orderType === 'dine_in' && (
            <Button 
              variant="outline" 
              size="sm" 
              className={cn(
                "rounded-lg border-primary/20 text-primary hover:bg-primary/5 h-9 font-bold",
                selectedTableId && "bg-primary text-white hover:bg-primary-dark border-transparent"
              )}
              onClick={() => setShowFloorPlan(true)}
            >
              <LayoutGrid className="w-4 h-4 mr-2" />
              {selectedTableId ? `Table ${selectedTableId.replace('t', '')}` : "Select Table"}
            </Button>
          )}

          <Button 
            variant="outline" 
            size="sm" 
            className={cn(
              "rounded-lg border-border text-text-secondary hover:bg-muted h-9 font-bold",
              selectedCustomer && "bg-success/10 text-success border-success/20"
            )}
            onClick={() => setShowCustomerModal(true)}
          >
            <UserPlus className="w-4 h-4 mr-2" />
            {selectedCustomer ? selectedCustomer.name : "Add Customer"}
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-success/10 text-success rounded-lg text-[10px] font-black uppercase border border-success/20">
            <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
            Online
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-lg h-9 w-9 text-text-secondary hover:bg-muted"
            onClick={loadData}
            disabled={isRefreshing}
          >
            <RefreshCw className={cn("w-4 h-4", isRefreshing && "animate-spin")} />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-lg h-9 w-9 text-text-secondary hover:bg-muted">
            <Search className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-lg h-9 w-9 text-text-secondary hover:bg-muted">
            <Bell className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Categories (Vertical) */}
        <div className="w-24 lg:w-32 flex-shrink-0 border-r border-border bg-white flex flex-col h-full overflow-y-auto scrollbar-hide">
          <div 
            className={cn(
              "p-4 flex flex-col items-center justify-center gap-1 cursor-pointer transition-all border-b border-transparent",
              activeCategory === 'all' ? "bg-primary/5 text-primary border-r-4 border-r-primary" : "text-text-secondary hover:bg-muted/50"
            )}
            onClick={() => setActiveCategory('all')}
          >
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-xl">🍽️</div>
            <span className="text-[10px] lg:text-xs font-bold text-center uppercase tracking-wider">All</span>
          </div>
          {categories.map(cat => (
            <div 
              key={cat.id}
              className={cn(
                "p-4 flex flex-col items-center justify-center gap-1 cursor-pointer transition-all border-b border-transparent",
                activeCategory === cat.id ? "bg-primary/5 text-primary border-r-4 border-r-primary" : "text-text-secondary hover:bg-muted/50"
              )}
              onClick={() => setActiveCategory(cat.id)}
            >
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-xl">{cat.emoji}</div>
              <span className="text-[10px] lg:text-xs font-bold text-center uppercase tracking-wider line-clamp-1">{cat.name}</span>
            </div>
          ))}
        </div>

        {/* Center Panel: Menu Items Grid */}
        <div className="flex-1 flex flex-col h-full min-w-0">
          <ItemGrid 
            categories={categories} 
            items={items} 
            activeCategoryId={activeCategory}
          />
        </div>

        {/* Right Panel: Cart / Bill Summary */}
        <div className="w-[360px] lg:w-[400px] flex-shrink-0 border-l border-border bg-white flex flex-col h-full shadow-[-4px_0_24px_rgba(0,0,0,0.02)] z-10">
          <OrderCart />
        </div>
      </div>

      {/* Floor Plan Modal */}
      <Dialog open={showFloorPlan} onOpenChange={setShowFloorPlan}>
        <DialogContent className="max-w-4xl h-[80vh] p-0 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold">Table Management</DialogTitle>
              <p className="text-sm text-muted-foreground">Select a table to start an order</p>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setShowFloorPlan(false)}>
              <X className="w-5 h-5" />
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
        onSelect={(customer) => setSelectedCustomer(customer)}
      />
      <AIChatbot />
    </div>
  );
}

function OrderTypeTab({ active, onClick, label, icon }: any) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all",
        active 
          ? "bg-white text-primary shadow-sm ring-1 ring-black/5" 
          : "text-text-secondary hover:text-text-primary"
      )}
    >
      {icon}
      {label}
    </button>
  );
}
