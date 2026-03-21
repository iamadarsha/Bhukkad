"use client";

import { useState, useEffect } from "react";
import { 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  Utensils,
  Calendar
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area
} from "recharts";
import { formatCurrency } from "@/lib/utils/currency";

const data = [
  { name: "10 AM", sales: 4000 },
  { name: "12 PM", sales: 7000 },
  { name: "2 PM", sales: 5000 },
  { name: "4 PM", sales: 3000 },
  { name: "6 PM", sales: 9000 },
  { name: "8 PM", sales: 12000 },
  { name: "10 PM", sales: 8000 },
];

const topItems = [
  { name: "Paneer Tikka", orders: 145, revenue: 36250 },
  { name: "Butter Chicken", orders: 128, revenue: 51200 },
  { name: "Dal Makhani", orders: 98, revenue: 24500 },
  { name: "Garlic Naan", orders: 342, revenue: 17100 },
  { name: "Veg Biryani", orders: 86, revenue: 21500 },
];

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  return (
    <div className="flex-1 p-8 bg-[#F4F7FA] overflow-y-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Outlet Dashboard</h1>
          <p className="text-slate-500 font-medium">Welcome back! Here&apos;s what&apos;s happening today.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="bg-white font-bold">
            <Calendar className="w-4 h-4 mr-2" />
            Today
          </Button>
          <Button className="font-bold shadow-lg shadow-primary/20">
            Download Report
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Today's Sales" 
          value={formatCurrency(48250)} 
          change="+12.5%" 
          isUp={true} 
          icon={<DollarSign className="w-5 h-5" />} 
          color="bg-blue-500"
        />
        <StatCard 
          title="Total Orders" 
          value="156" 
          change="+8.2%" 
          isUp={true} 
          icon={<ShoppingBag className="w-5 h-5" />} 
          color="bg-orange-500"
        />
        <StatCard 
          title="Avg. Order Value" 
          value={formatCurrency(309)} 
          change="-2.4%" 
          isUp={false} 
          icon={<TrendingUp className="w-5 h-5" />} 
          color="bg-emerald-500"
        />
        <StatCard 
          title="New Customers" 
          value="42" 
          change="+18.7%" 
          isUp={true} 
          icon={<Users className="w-5 h-5" />} 
          color="bg-violet-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Chart */}
        <Card className="lg:col-span-2 border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-bold">Sales Overview</CardTitle>
            <div className="flex gap-2">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-xs font-bold text-slate-500">Today</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-slate-200" />
                <span className="text-xs font-bold text-slate-500">Yesterday</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fontWeight: 600, fill: '#64748B' }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fontWeight: 600, fill: '#64748B' }}
                    tickFormatter={(value) => `₹${value/1000}k`}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                    itemStyle={{ fontWeight: 'bold' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="sales" 
                    stroke="var(--primary)" 
                    strokeWidth={4}
                    fillOpacity={1} 
                    fill="url(#colorSales)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Items */}
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Top Selling Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {topItems.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-lg">
                      {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : '🍲'}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-slate-900">{item.name}</p>
                      <p className="text-xs font-bold text-slate-500">{item.orders} orders</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm text-slate-900">{formatCurrency(item.revenue)}</p>
                    <div className="w-24 h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full" 
                        style={{ width: `${(item.revenue / 51200) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-6 font-bold text-primary hover:text-primary-dark hover:bg-primary/5">
              View All Items
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ title, value, change, isUp, icon, color }: any) {
  return (
    <Card className="border-none shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center text-white shadow-lg shadow-${color.split('-')[1]}-500/20 group-hover:scale-110 transition-transform`}>
            {icon}
          </div>
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-black ${isUp ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
            {isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {change}
          </div>
        </div>
        <div>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">{title}</p>
          <h3 className="text-2xl font-black text-slate-900">{value}</h3>
        </div>
      </CardContent>
    </Card>
  );
}
