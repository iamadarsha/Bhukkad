"use client";

import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Save, Store, Receipt, Users, Bell } from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState({
    restaurantName: "My Restaurant",
    phone: "+91 98765 43210",
    address: "123 Main St, City",
    gstNumber: "27AAAAA0000A1Z5",
    fssaiNumber: "10012022000001",
    taxRate: 5,
    serviceCharge: 0,
    printReceiptAutomatically: true,
    enableKDS: true,
    enableOnlineOrders: false,
  });

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await apiClient.get("/settings");
        const data = res.data;
        setSettings({
          restaurantName: data.name || "",
          phone: data.phone || "",
          address: data.address || "",
          gstNumber: data.gstin || "",
          fssaiNumber: data.fssaiNumber || "",
          taxRate: data.settings?.taxRate || 5,
          serviceCharge: data.settings?.serviceCharge || 0,
          printReceiptAutomatically: data.settings?.printReceiptAutomatically ?? true,
          enableKDS: data.settings?.enableKDS ?? true,
          enableOnlineOrders: data.settings?.enableOnlineOrders ?? false,
        });
      } catch (error) {
        toast.error("Failed to load settings");
      } finally {
        setIsLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = {
        name: settings.restaurantName,
        phone: settings.phone,
        address: settings.address,
        gstin: settings.gstNumber,
        fssaiNumber: settings.fssaiNumber,
        settings: {
          taxRate: settings.taxRate,
          serviceCharge: settings.serviceCharge,
          printReceiptAutomatically: settings.printReceiptAutomatically,
          enableKDS: settings.enableKDS,
          enableOnlineOrders: settings.enableOnlineOrders,
        }
      };
      await apiClient.patch("/settings", payload);
      toast.success("Settings saved successfully");
    } catch (error) {
      toast.error("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-text-secondary mt-1">Manage your restaurant configuration.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button onClick={handleSave} disabled={isSaving} className="gap-2">
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="general" className="gap-2"><Store className="w-4 h-4" /> General</TabsTrigger>
          <TabsTrigger value="billing" className="gap-2"><Receipt className="w-4 h-4" /> Billing & Taxes</TabsTrigger>
          <TabsTrigger value="users" className="gap-2"><Users className="w-4 h-4" /> Users & Roles</TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2"><Bell className="w-4 h-4" /> Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card className="border-border shadow-sm">
            <CardHeader>
              <CardTitle>Restaurant Details</CardTitle>
              <CardDescription>Basic information about your business.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="restaurantName">Restaurant Name</Label>
                  <Input 
                    id="restaurantName" 
                    value={settings.restaurantName} 
                    onChange={(e) => handleChange("restaurantName", e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone" 
                    value={settings.phone} 
                    onChange={(e) => handleChange("phone", e.target.value)} 
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Input 
                    id="address" 
                    value={settings.address} 
                    onChange={(e) => handleChange("address", e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gstNumber">GST Number</Label>
                  <Input 
                    id="gstNumber" 
                    value={settings.gstNumber} 
                    onChange={(e) => handleChange("gstNumber", e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fssaiNumber">FSSAI Number</Label>
                  <Input 
                    id="fssaiNumber" 
                    value={settings.fssaiNumber} 
                    onChange={(e) => handleChange("fssaiNumber", e.target.value)} 
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border shadow-sm">
            <CardHeader>
              <CardTitle>Features</CardTitle>
              <CardDescription>Enable or disable core system features.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="space-y-0.5">
                  <Label className="text-base font-medium">Kitchen Display System (KDS)</Label>
                  <p className="text-sm text-text-secondary">Send orders directly to digital kitchen screens.</p>
                </div>
                <Switch 
                  checked={settings.enableKDS} 
                  onCheckedChange={(checked) => handleChange("enableKDS", checked)} 
                />
              </div>
              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="space-y-0.5">
                  <Label className="text-base font-medium">Online Orders</Label>
                  <p className="text-sm text-text-secondary">Accept orders from food delivery aggregators.</p>
                </div>
                <Switch 
                  checked={settings.enableOnlineOrders} 
                  onCheckedChange={(checked) => handleChange("enableOnlineOrders", checked)} 
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <Card className="border-border shadow-sm">
            <CardHeader>
              <CardTitle>Taxes & Charges</CardTitle>
              <CardDescription>Configure default tax rates and additional charges.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="taxRate">Default GST Rate (%)</Label>
                  <Input 
                    id="taxRate" 
                    type="number" 
                    value={settings.taxRate} 
                    onChange={(e) => handleChange("taxRate", parseFloat(e.target.value))} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="serviceCharge">Service Charge (%)</Label>
                  <Input 
                    id="serviceCharge" 
                    type="number" 
                    value={settings.serviceCharge} 
                    onChange={(e) => handleChange("serviceCharge", parseFloat(e.target.value))} 
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border shadow-sm">
            <CardHeader>
              <CardTitle>Receipt Printing</CardTitle>
              <CardDescription>Configure how receipts are handled.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="space-y-0.5">
                  <Label className="text-base font-medium">Auto-print Receipts</Label>
                  <p className="text-sm text-text-secondary">Automatically print receipt when payment is completed.</p>
                </div>
                <Switch 
                  checked={settings.printReceiptAutomatically} 
                  onCheckedChange={(checked) => handleChange("printReceiptAutomatically", checked)} 
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card className="border-border shadow-sm p-6 text-center text-text-muted">
            <h3 className="text-lg font-medium text-text-primary mb-2">Users & Roles Management</h3>
            <p>Manage staff accounts, PINs, and permissions.</p>
            <Button className="mt-4" variant="outline">Manage Users</Button>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="border-border shadow-sm p-6 text-center text-text-muted">
            <h3 className="text-lg font-medium text-text-primary mb-2">Notification Settings</h3>
            <p>Configure sound and visual alerts for new orders and updates.</p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
