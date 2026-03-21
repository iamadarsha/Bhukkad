"use client";

import { useState } from "react";
import { Order } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Calendar, Receipt, User, Clock, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils/currency";
import { format } from "date-fns";

// Mock Orders for demo
const MOCK_ORDERS: Order[] = [
  {
    id: "ord1",
    orderNumber: "ORD-2026-001",
    orderType: "dine_in",
    status: "paid",
    paxCount: 4,
    subtotal: 1250,
    taxAmount: 62.5,
    discountAmount: 0,
    totalAmount: 1312.5,
    createdAt: new Date(Date.now() - 60 * 60000).toISOString(),
    items: []
  },
  {
    id: "ord2",
    orderNumber: "ORD-2026-002",
    orderType: "takeaway",
    status: "paid",
    paxCount: 1,
    subtotal: 450,
    taxAmount: 22.5,
    discountAmount: 50,
    totalAmount: 422.5,
    createdAt: new Date(Date.now() - 120 * 60000).toISOString(),
    items: []
  },
  {
    id: "ord3",
    orderNumber: "ORD-2026-003",
    orderType: "delivery",
    status: "active",
    paxCount: 1,
    subtotal: 890,
    taxAmount: 44.5,
    discountAmount: 0,
    totalAmount: 934.5,
    createdAt: new Date(Date.now() - 30 * 60000).toISOString(),
    items: []
  }
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOrders = orders.filter(order => 
    order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F4F7FA]">
      {/* Header */}
      <div className="p-6 bg-white border-b border-border">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900">Order History</h1>
            <p className="text-slate-500 font-medium">View and manage all outlet orders</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                placeholder="Search by order ID..." 
                className="pl-9 bg-slate-50 border-slate-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="font-bold" onClick={() => alert("Date Range clicked")}>
              <Calendar className="w-4 h-4 mr-2" />
              Date Range
            </Button>
            <Button variant="outline" className="font-bold" onClick={() => alert("Filter clicked")}>
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>
      </div>

      {/* Table-like List */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-4">
          {filteredOrders.map((order) => (
            <Card key={order.id} className="hover:shadow-md transition-all cursor-pointer group border-none shadow-sm overflow-hidden" onClick={() => alert(`Order ${order.orderNumber} clicked`)}>
              <CardContent className="p-0">
                <div className="flex items-center p-5 gap-6">
                  {/* Status Icon */}
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                    order.status === 'paid' ? 'bg-success/10 text-success' : 
                    order.status === 'active' ? 'bg-primary/10 text-primary' : 
                    'bg-slate-100 text-slate-400'
                  }`}>
                    <Receipt className="w-6 h-6" />
                  </div>

                  {/* Order Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-black text-slate-900 truncate">{order.orderNumber}</h3>
                      <Badge variant="outline" className={`
                        text-[10px] font-bold uppercase px-2 py-0.5
                        ${order.status === 'paid' ? 'text-success border-success/20 bg-success/5' : 
                          order.status === 'active' ? 'text-primary border-primary/20 bg-primary/5' : ''}
                      `}>
                        {order.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {format(new Date(order.createdAt), "hh:mm a")}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5" />
                        {order.orderType.replace('_', ' ')}
                      </div>
                    </div>
                  </div>

                  {/* Pax & Amount */}
                  <div className="text-right hidden sm:block">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">Total Amount</p>
                    <p className="text-xl font-black text-slate-900">{formatCurrency(order.totalAmount)}</p>
                  </div>

                  {/* Action */}
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-50 group-hover:bg-primary group-hover:text-white transition-all">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredOrders.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 py-20">
              <Receipt className="w-20 h-20 mb-4 opacity-20" />
              <p className="font-black text-xl uppercase tracking-widest opacity-30">No Orders Found</p>
              <p className="text-sm">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
