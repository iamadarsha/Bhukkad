"use client";

import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, Edit, Trash2, Loader2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

export default function InventoryPage() {
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchInventory() {
      try {
        const res = await apiClient.get("/inventory");
        setItems(res.data);
      } catch (error) {
        toast.error("Failed to load inventory");
      } finally {
        setIsLoading(false);
      }
    }
    fetchInventory();
  }, []);

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const deleteItem = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      await apiClient.delete(`/inventory/${id}`);
      setItems(items.filter(i => i.id !== id));
      toast.success("Item deleted");
    } catch (error) {
      toast.error("Failed to delete item");
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
          <p className="text-text-secondary mt-1">Manage stock levels and ingredients.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <Input
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" /> Add Item
          </Button>
        </div>
      </div>

      <Card className="border-border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead>Name</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-text-muted">
                  No inventory items found.
                </TableCell>
              </TableRow>
            ) : (
              filteredItems.map((item) => (
                <TableRow key={item.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="font-medium text-primary">
                    {item.name}
                  </TableCell>
                  <TableCell className="text-text-secondary">
                    {item.sku || '-'}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-surface">
                      {item.category || 'Uncategorized'}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-semibold">
                    {item.currentStock}
                  </TableCell>
                  <TableCell className="text-text-secondary">
                    {item.unit}
                  </TableCell>
                  <TableCell>
                    {item.currentStock <= (item.minimumStock || 0) ? (
                      <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20 gap-1">
                        <AlertTriangle className="w-3 h-3" /> Low Stock
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                        In Stock
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-text-secondary hover:text-primary">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => deleteItem(item.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
