"use client";

import { useState, useEffect } from "react";
import { Category, MenuItem } from "@/types";
import { apiClient } from "@/lib/api-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Edit, Trash2, MoreVertical, Filter, Loader2, UtensilsCrossed } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency } from "@/lib/utils/currency";
import { toast } from "sonner";

export default function MenuPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [catsRes, itemsRes] = await Promise.all([
        apiClient.get("/menu/categories"),
        apiClient.get("/menu/items"),
      ]);
      setCategories(catsRes.data);
      setItems(itemsRes.data);
    } catch (error) {
      toast.error("Failed to load menu data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.shortCode?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="app-canvas flex-1 overflow-y-auto">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-6">
        <section className="app-panel relative overflow-hidden rounded-[var(--radius-xxl)] p-6 sm:p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,77,0,0.14),_transparent_36%),radial-gradient(circle_at_top_right,_rgba(56,178,172,0.12),_transparent_30%),linear-gradient(135deg,rgba(255,255,255,0.98),rgba(255,245,238,0.94))]" />
          <div className="relative flex flex-col gap-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-black tracking-tight text-text-primary sm:text-4xl">
                  Menu Management
                </h1>
                <p className="mt-2 max-w-2xl text-sm font-medium leading-7 text-text-secondary sm:text-base">
                  Configure your categories, items, and modifiers with calmer surfaces and clearer contrast.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Button className="font-bold shadow-lg shadow-primary/20">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item
                </Button>
                <Button variant="outline" className="border-border/70 bg-card/85 font-bold">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Category
                </Button>
              </div>
            </div>
          </div>
        </section>

        <div className="app-panel-subtle rounded-[var(--radius-xxl)] p-4 sm:p-5">
          <Tabs defaultValue="items" className="w-full">
            <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <TabsList className="h-auto flex-wrap gap-2 rounded-[var(--radius-large)] border border-border/70 bg-card/95 p-1 shadow-[var(--shadow-elevation-1)]">
                <TabsTrigger value="items" className="font-bold px-6">Items ({items.length})</TabsTrigger>
                <TabsTrigger value="categories" className="font-bold px-6">Categories ({categories.length})</TabsTrigger>
                <TabsTrigger value="modifiers" className="font-bold px-6">Modifiers</TabsTrigger>
              </TabsList>

              <div className="relative w-full lg:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <Input 
                  placeholder="Search menu..." 
                  className="pl-9 border-border/70 bg-card/95"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <TabsContent value="items" className="mt-0">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredItems.map(item => (
                  <Card
                    key={item.id}
                    className="group overflow-hidden border-border/70 bg-card/95 shadow-[var(--shadow-elevation-1)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-elevation-2)]"
                  >
                    <CardContent className="p-0">
                      <div className="p-4 flex items-start justify-between">
                        <div className="flex gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-light text-primary shadow-[var(--shadow-elevation-1)]">
                            <UtensilsCrossed className="w-6 h-6" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-0.5">
                              <div className={`w-2 h-2 rounded-full ${item.foodType === 'veg' ? 'bg-success' : 'bg-error'}`} />
                              <h3 className="font-bold leading-tight text-text-primary">{item.name}</h3>
                            </div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                              {categories.find(c => c.id === item.categoryId)?.name || 'Uncategorized'}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full opacity-0 transition-opacity hover:bg-accent/70 group-hover:opacity-100"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="px-4 pb-4 flex items-center justify-between">
                        <span className="font-black text-primary-dark">{formatCurrency(item.basePrice)}</span>
                        {item.isActive ? (
                          <Badge className="text-[10px] font-bold uppercase">Active</Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="border-border/70 bg-muted/70 text-[10px] font-bold uppercase text-text-secondary"
                          >
                            Inactive
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="categories" className="mt-0">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {categories.map(cat => (
                  <Card
                    key={cat.id}
                    className="group overflow-hidden border-border/70 bg-card/95 shadow-[var(--shadow-elevation-1)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-elevation-2)]"
                  >
                    <CardContent className="p-5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-light text-xl shadow-[var(--shadow-elevation-1)]">
                          {cat.emoji}
                        </div>
                        <div>
                          <h3 className="font-bold text-text-primary">{cat.name}</h3>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                            {items.filter(i => i.categoryId === cat.id).length} Items
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full opacity-0 transition-opacity hover:bg-accent/70 group-hover:opacity-100"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
