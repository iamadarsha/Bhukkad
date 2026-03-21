"use client";

import { useState, useEffect } from "react";
import { Category, MenuItem } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Edit, Trash2, MoreVertical, Filter, Loader2, UtensilsCrossed } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency } from "@/lib/utils/currency";

export default function MenuPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const loadData = () => {
    // Demo data — no database required
    setCategories([
      { id: "cat-1", name: "Starters",    emoji: "🥗", displayOrder: 1, isActive: true },
      { id: "cat-2", name: "Main Course", emoji: "🍛", displayOrder: 2, isActive: true },
      { id: "cat-3", name: "Breads",      emoji: "🫓", displayOrder: 3, isActive: true },
      { id: "cat-4", name: "Beverages",   emoji: "🥤", displayOrder: 4, isActive: true },
      { id: "cat-5", name: "Desserts",    emoji: "🍮", displayOrder: 5, isActive: true },
      { id: "cat-6", name: "Combos",      emoji: "🍱", displayOrder: 6, isActive: true },
    ]);
    setItems([
      { id: "item-1", name: "Paneer Tikka",    categoryId: "cat-1", basePrice: 220, foodType: "veg",     isActive: true, isBestseller: true,  isChefsSpecial: false, spiceLevel: 2, prepTimeMinutes: 15, tags: [], shortCode: "PNTK" },
      { id: "item-2", name: "Chicken Tikka",   categoryId: "cat-1", basePrice: 280, foodType: "non_veg", isActive: true, isBestseller: true,  isChefsSpecial: false, spiceLevel: 3, prepTimeMinutes: 20, tags: [], shortCode: "CHTK" },
      { id: "item-3", name: "Butter Chicken",  categoryId: "cat-2", basePrice: 320, foodType: "non_veg", isActive: true, isBestseller: true,  isChefsSpecial: true,  spiceLevel: 2, prepTimeMinutes: 20, tags: [], shortCode: "BTCH" },
      { id: "item-4", name: "Dal Makhani",     categoryId: "cat-2", basePrice: 240, foodType: "veg",     isActive: true, isBestseller: false, isChefsSpecial: false, spiceLevel: 1, prepTimeMinutes: 25, tags: [], shortCode: "DLMK" },
      { id: "item-5", name: "Chicken Biryani", categoryId: "cat-2", basePrice: 350, foodType: "non_veg", isActive: true, isBestseller: true,  isChefsSpecial: true,  spiceLevel: 3, prepTimeMinutes: 30, tags: [], shortCode: "CHBR" },
      { id: "item-6", name: "Garlic Naan",     categoryId: "cat-3", basePrice:  60, foodType: "veg",     isActive: true, isBestseller: false, isChefsSpecial: false, spiceLevel: 0, prepTimeMinutes: 8,  tags: [], shortCode: "GNAN" },
      { id: "item-7", name: "Butter Naan",     categoryId: "cat-3", basePrice:  50, foodType: "veg",     isActive: true, isBestseller: false, isChefsSpecial: false, spiceLevel: 0, prepTimeMinutes: 8,  tags: [], shortCode: "BNAN" },
      { id: "item-8", name: "Lassi",           categoryId: "cat-4", basePrice:  80, foodType: "veg",     isActive: true, isBestseller: false, isChefsSpecial: false, spiceLevel: 0, prepTimeMinutes: 5,  tags: [], shortCode: "LSSI" },
      { id: "item-9", name: "Gulab Jamun",     categoryId: "cat-5", basePrice:  90, foodType: "veg",     isActive: true, isBestseller: false, isChefsSpecial: false, spiceLevel: 0, prepTimeMinutes: 5,  tags: [], shortCode: "GLJM" },
    ]);
    setIsLoading(false);
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
    <div className="flex-1 flex flex-col h-full bg-[#F4F7FA]">
      {/* Header */}
      <div className="p-6 bg-white border-b border-border">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900">Menu Management</h1>
            <p className="text-slate-500 font-medium">Configure your categories, items, and modifiers</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button className="font-bold shadow-lg shadow-primary/20">
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
            <Button variant="outline" className="font-bold">
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        <Tabs defaultValue="items" className="w-full">
          <div className="flex items-center justify-between mb-6">
            <TabsList className="bg-white border border-slate-200">
              <TabsTrigger value="items" className="font-bold px-6">Items ({items.length})</TabsTrigger>
              <TabsTrigger value="categories" className="font-bold px-6">Categories ({categories.length})</TabsTrigger>
              <TabsTrigger value="modifiers" className="font-bold px-6">Modifiers</TabsTrigger>
            </TabsList>

            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                placeholder="Search menu..." 
                className="pl-9 bg-white border-slate-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <TabsContent value="items" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredItems.map(item => (
                <Card key={item.id} className="group hover:shadow-md transition-all border-none shadow-sm overflow-hidden">
                  <CardContent className="p-0">
                    <div className="p-4 flex items-start justify-between">
                      <div className="flex gap-3">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                          <UtensilsCrossed className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-0.5">
                            <div className={`w-2 h-2 rounded-full ${item.foodType === 'veg' ? 'bg-success' : 'bg-error'}`} />
                            <h3 className="font-bold text-slate-900 leading-tight">{item.name}</h3>
                          </div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            {categories.find(c => c.id === item.categoryId)?.name || 'Uncategorized'}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="px-4 pb-4 flex items-center justify-between">
                      <span className="font-black text-primary">{formatCurrency(item.basePrice)}</span>
                      <Badge variant={item.isActive ? "default" : "secondary"} className="text-[10px] font-bold uppercase">
                        {item.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="categories" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {categories.map(cat => (
                <Card key={cat.id} className="group hover:shadow-md transition-all border-none shadow-sm overflow-hidden">
                  <CardContent className="p-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-xl">
                        {cat.emoji}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900">{cat.name}</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          {items.filter(i => i.categoryId === cat.id).length} Items
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
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
  );
}
