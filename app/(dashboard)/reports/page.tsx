"use client";

import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils/currency";
import { Loader2, TrendingUp, Users, ShoppingBag, IndianRupee } from "lucide-react";
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
} from "recharts";

const data = [
  { name: "Mon", sales: 4000, orders: 24 },
  { name: "Tue", sales: 3000, orders: 18 },
  { name: "Wed", sales: 2000, orders: 12 },
  { name: "Thu", sales: 2780, orders: 19 },
  { name: "Fri", sales: 1890, orders: 11 },
  { name: "Sat", sales: 2390, orders: 15 },
  { name: "Sun", sales: 3490, orders: 21 },
];

export default function ReportsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    activeCustomers: 0,
  });

  useEffect(() => {
    // Mock fetching stats
    setTimeout(() => {
      setStats({
        totalSales: 124500,
        totalOrders: 450,
        averageOrderValue: 276.66,
        activeCustomers: 312,
      });
      setIsLoading(false);
    }, 1000);
  }, []);

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
          <h1 className="text-3xl font-bold tracking-tight">Analytics & Reports</h1>
          <p className="text-text-secondary mt-1">Overview of your restaurant&apos;s performance.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Sales"
          value={formatCurrency(stats.totalSales)}
          icon={<IndianRupee className="w-5 h-5 text-primary" />}
          trend="+12.5%"
          trendUp={true}
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders.toString()}
          icon={<ShoppingBag className="w-5 h-5 text-primary" />}
          trend="+5.2%"
          trendUp={true}
        />
        <StatCard
          title="Average Order Value"
          value={formatCurrency(stats.averageOrderValue)}
          icon={<TrendingUp className="w-5 h-5 text-primary" />}
          trend="-1.2%"
          trendUp={false}
        />
        <StatCard
          title="Active Customers"
          value={stats.activeCustomers.toString()}
          icon={<Users className="w-5 h-5 text-primary" />}
          trend="+8.4%"
          trendUp={true}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <Tooltip 
                    cursor={{ fill: '#f3f4f6' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="sales" fill="#f97316" radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle>Orders Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Line type="monotone" dataKey="orders" stroke="#f97316" strokeWidth={3} dot={{ r: 4, fill: '#f97316', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, trend, trendUp }: any) {
  return (
    <Card className="border-border shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <p className="text-sm font-medium text-text-secondary">{title}</p>
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            {icon}
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <div className="text-2xl font-bold text-text-primary">{value}</div>
          <span className={`text-xs font-medium ${trendUp ? 'text-success' : 'text-destructive'}`}>
            {trend}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
