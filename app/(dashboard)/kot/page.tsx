"use client";

import { useState, useEffect } from "react";
import { Kot } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, ChefHat, AlertCircle, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

// Mock KOTs for demo
const MOCK_KOTS: Kot[] = [
  {
    id: "kot1",
    orderId: "ord1",
    kotNumber: "KOT-101",
    status: "preparing",
    createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
    items: [
      { name: "Paneer Tikka", quantity: 2, notes: "Extra spicy" },
      { name: "Butter Naan", quantity: 4 },
    ]
  },
  {
    id: "kot2",
    orderId: "ord2",
    kotNumber: "KOT-102",
    status: "pending",
    createdAt: new Date(Date.now() - 5 * 60000).toISOString(),
    items: [
      { name: "Chicken Biryani", quantity: 1 },
      { name: "Coke", quantity: 2 },
    ]
  },
  {
    id: "kot3",
    orderId: "ord3",
    kotNumber: "KOT-103",
    status: "ready",
    createdAt: new Date(Date.now() - 25 * 60000).toISOString(),
    items: [
      { name: "Dal Makhani", quantity: 1 },
      { name: "Jeera Rice", quantity: 1 },
    ]
  }
];

export default function KotPage() {
  const [kots, setKots] = useState<Kot[]>(MOCK_KOTS);
  const [filter, setFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredKots = kots.filter(kot => {
    const matchesFilter = filter === "all" || kot.status === filter;
    const matchesSearch = kot.kotNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         kot.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const updateKotStatus = (id: string, newStatus: Kot['status']) => {
    setKots(prev => prev.map(kot => 
      kot.id === id ? { ...kot, status: newStatus } : kot
    ));
    toast.success(`KOT ${id} updated to ${newStatus}`);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F4F7FA]">
      {/* Header */}
      <div className="p-6 bg-white border-b border-border">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900">Kitchen Display System</h1>
            <p className="text-slate-500 font-medium">Manage active orders and kitchen tickets</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                placeholder="Search KOTs..." 
                className="pl-9 bg-slate-50 border-slate-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="font-bold">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-1 scrollbar-hide">
          <StatusTab label="All Tickets" count={kots.length} active={filter === "all"} onClick={() => setFilter("all")} />
          <StatusTab label="Pending" count={kots.filter(k => k.status === "pending").length} active={filter === "pending"} onClick={() => setFilter("pending")} color="bg-warning" />
          <StatusTab label="Preparing" count={kots.filter(k => k.status === "preparing").length} active={filter === "preparing"} onClick={() => setFilter("preparing")} color="bg-primary" />
          <StatusTab label="Ready" count={kots.filter(k => k.status === "ready").length} active={filter === "ready"} onClick={() => setFilter("ready")} color="bg-success" />
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredKots.map((kot) => (
              <motion.div
                key={kot.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex"
              >
                <Card className="w-full flex flex-col border-2 border-transparent hover:border-primary/20 transition-all shadow-sm overflow-hidden">
                  <div className={`h-1.5 w-full ${
                    kot.status === 'pending' ? 'bg-warning' : 
                    kot.status === 'preparing' ? 'bg-primary' : 
                    kot.status === 'ready' ? 'bg-success' : 'bg-slate-300'
                  }`} />
                  
                  <CardHeader className="p-4 bg-white border-b border-slate-100">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{kot.kotNumber}</span>
                      <Badge variant="outline" className={`
                        text-[10px] font-bold uppercase px-2 py-0.5
                        ${kot.status === 'pending' ? 'text-warning border-warning/20 bg-warning/5' : 
                          kot.status === 'preparing' ? 'text-primary border-primary/20 bg-primary/5' : 
                          kot.status === 'ready' ? 'text-success border-success/20 bg-success/5' : ''}
                      `}>
                        {kot.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500">
                      <Clock className="w-3.5 h-3.5" />
                      <span className="text-xs font-bold">{formatDistanceToNow(new Date(kot.createdAt))} ago</span>
                    </div>
                  </CardHeader>

                  <CardContent className="p-4 flex-1 bg-white">
                    <div className="space-y-3">
                      {kot.items.map((item, idx) => (
                        <div key={idx} className="flex items-start justify-between group">
                          <div className="flex gap-3">
                            <span className="font-black text-primary text-sm">{item.quantity}x</span>
                            <div>
                              <p className="font-bold text-sm text-slate-800 leading-tight">{item.name}</p>
                              {item.notes && (
                                <p className="text-[10px] font-bold text-error uppercase mt-0.5">Note: {item.notes}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>

                  <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-2">
                    {kot.status === 'pending' && (
                      <Button 
                        className="flex-1 font-bold text-xs h-9" 
                        onClick={() => updateKotStatus(kot.id, 'preparing')}
                      >
                        <ChefHat className="w-3.5 h-3.5 mr-2" />
                        Prepare
                      </Button>
                    )}
                    {kot.status === 'preparing' && (
                      <Button 
                        className="flex-1 font-bold text-xs h-9 bg-success hover:bg-success/90" 
                        onClick={() => updateKotStatus(kot.id, 'ready')}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 mr-2" />
                        Ready
                      </Button>
                    )}
                    {kot.status === 'ready' && (
                      <Button 
                        className="flex-1 font-bold text-xs h-9 variant-outline" 
                        onClick={() => updateKotStatus(kot.id, 'served')}
                      >
                        Served
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-error hover:bg-error/5">
                      <AlertCircle className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredKots.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 py-20">
            <ChefHat className="w-20 h-20 mb-4 opacity-20" />
            <p className="font-black text-xl uppercase tracking-widest opacity-30">No Active Tickets</p>
            <p className="text-sm">Kitchen is all caught up!</p>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusTab({ label, count, active, onClick, color = "bg-slate-400" }: any) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-xl transition-all whitespace-nowrap border-2
        ${active 
          ? "bg-white border-primary shadow-sm" 
          : "bg-slate-50 border-transparent hover:bg-white hover:border-slate-200"}
      `}
    >
      <div className={`w-2 h-2 rounded-full ${color}`} />
      <span className={`text-xs font-bold ${active ? "text-slate-900" : "text-slate-500"}`}>{label}</span>
      <Badge variant="secondary" className="text-[10px] font-black h-5 px-1.5 bg-slate-100 text-slate-600">
        {count}
      </Badge>
    </button>
  );
}
