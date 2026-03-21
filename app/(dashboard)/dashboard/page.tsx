"use client";

import { useState, useEffect } from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MaterialIcon } from "@/components/ui/material-icon";
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
import { useSession } from "next-auth/react";

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
}

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
  const { data: session } = useSession();
  const firstName = session?.user?.name?.split(" ")[0] ?? "Chef";

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  return (
    <div className="flex-1 p-8 overflow-y-auto" style={{ background: "var(--md-sys-color-surface)" }}>
      <div className="flex items-center justify-between mb-8">
        <div>
          {/* Personalized time-sensitive greeting */}
          <p className="text-label-lg font-medium mb-1" style={{ color: "var(--md-sys-color-on-surface-variant)" }}>
            {getGreeting()}, {firstName} 👋
          </p>
          <h1 className="text-headline-sm font-medium" style={{ color: "var(--md-sys-color-on-surface)" }}>
            Outlet Dashboard
          </h1>
          <p className="text-body-md mt-0.5" style={{ color: "var(--md-sys-color-on-surface-variant)" }}>
            Here&apos;s what&apos;s happening today.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outlined">
            <MaterialIcon icon="calendar_today" size={16} />
            Today
          </Button>
          <Button variant="filled">
            <MaterialIcon icon="download" size={16} />
            Download Report
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Today's Sales"
          value={formatCurrency(48250)}
          change="+12.5%"
          isUp={true}
          icon="payments"
          color="var(--md-sys-color-primary)"
        />
        <StatCard
          title="Total Orders"
          value="156"
          change="+8.2%"
          isUp={true}
          icon="receipt_long"
          color="var(--md-sys-color-secondary)"
        />
        <StatCard
          title="Avg. Order Value"
          value={formatCurrency(309)}
          change="-2.4%"
          isUp={false}
          icon="trending_up"
          color="var(--md-sys-color-tertiary)"
        />
        <StatCard
          title="New Customers"
          value="42"
          change="+18.7%"
          isUp={true}
          icon="group"
          color="#386A20"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <Card variant="elevated" className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-title-md font-medium">Sales Overview</CardTitle>
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
        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="text-title-md font-medium">Top Selling Items</CardTitle>
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
            <Button variant="text" className="w-full mt-4">
              <MaterialIcon icon="expand_more" size={16} />
              View All Items
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ title, value, change, isUp, icon, color }: {
  title: string;
  value: string;
  change: string;
  isUp: boolean;
  icon: string;
  color: string;
}) {
  return (
    <Card variant="elevated" className="overflow-hidden group">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div
            className="w-11 h-11 rounded-[var(--md-sys-shape-corner-medium)] flex items-center justify-center group-hover:scale-110 transition-transform"
            style={{ background: color, color: "#fff" }}
          >
            <MaterialIcon icon={icon} size={20} fill={1} />
          </div>
          <div
            className="flex items-center gap-1 px-2 py-1 rounded-full text-label-sm font-semibold"
            style={
              isUp
                ? { background: "color-mix(in srgb, #386A20 12%, transparent)", color: "#386A20" }
                : { background: "color-mix(in srgb, #B3261E 12%, transparent)", color: "#B3261E" }
            }
          >
            <MaterialIcon icon={isUp ? "trending_up" : "trending_down"} size={12} />
            {change}
          </div>
        </div>
        <p className="text-label-md font-medium uppercase tracking-widest mb-1" style={{ color: "var(--md-sys-color-on-surface-variant)" }}>
          {title}
        </p>
        <h3
          className="font-semibold revenue-ticker"
          style={{
            fontSize: "clamp(20px, 2vw, 28px)",
            color: "var(--md-sys-color-on-surface)",
          }}
        >
          {value}
        </h3>
      </CardContent>
    </Card>
  );
}
