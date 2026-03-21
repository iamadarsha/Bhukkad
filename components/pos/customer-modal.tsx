"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, UserPlus, Phone, Mail, MapPin, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface CustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (customer: any) => void;
}

const MOCK_CUSTOMERS = [
  { id: "1", name: "Ankit Kumar", phone: "9876543210", email: "ankit@example.com", address: "Sector 62, Noida" },
  { id: "2", name: "Priya Singh", phone: "8765432109", email: "priya@example.com", address: "Indirapuram, Ghaziabad" },
  { id: "3", name: "Rahul Verma", phone: "7654321098", email: "rahul@example.com", address: "Dwarka, Delhi" },
];

export function CustomerModal({ isOpen, onClose, onSelect }: CustomerModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: "", phone: "", email: "", address: "" });

  const filteredCustomers = MOCK_CUSTOMERS.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.phone.includes(searchQuery)
  );

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would call an API
    const customer = { ...newCustomer, id: Math.random().toString() };
    onSelect(customer);
    setIsAddingNew(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0 overflow-hidden flex flex-col h-[600px]">
        <DialogHeader className="p-6 border-b border-border bg-white shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-black tracking-tight">Customer Selection</DialogTitle>
            <Button 
              variant={isAddingNew ? "ghost" : "outline"} 
              size="sm" 
              className="font-bold text-xs h-8"
              onClick={() => setIsAddingNew(!isAddingNew)}
            >
              {isAddingNew ? "Back to List" : "Add New"}
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col">
          <AnimatePresence mode="wait">
            {isAddingNew ? (
              <motion.form 
                key="add"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-6 space-y-4 overflow-y-auto"
                onSubmit={handleAddCustomer}
                suppressHydrationWarning
              >
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider">Phone Number *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input 
                      required
                      placeholder="9876543210" 
                      className="pl-10 h-11 bg-slate-50 border-slate-200"
                      value={newCustomer.phone}
                      onChange={e => setNewCustomer({...newCustomer, phone: e.target.value})}
                      suppressHydrationWarning
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider">Full Name *</Label>
                  <Input 
                    required
                    placeholder="John Doe" 
                    className="h-11 bg-slate-50 border-slate-200"
                    value={newCustomer.name}
                    onChange={e => setNewCustomer({...newCustomer, name: e.target.value})}
                    suppressHydrationWarning
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input 
                      type="email"
                      placeholder="john@example.com" 
                      className="pl-10 h-11 bg-slate-50 border-slate-200"
                      value={newCustomer.email}
                      onChange={e => setNewCustomer({...newCustomer, email: e.target.value})}
                      suppressHydrationWarning
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider">Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <textarea 
                      placeholder="Street, City, Pincode" 
                      className="w-full min-h-[80px] pl-10 p-3 rounded-md border-2 border-slate-200 bg-slate-50 resize-none focus:outline-none focus:border-primary/50 transition-colors text-sm"
                      value={newCustomer.address}
                      onChange={e => setNewCustomer({...newCustomer, address: e.target.value})}
                      suppressHydrationWarning
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full h-12 font-bold text-lg mt-4">
                  Save & Select
                </Button>
              </motion.form>
            ) : (
              <motion.div 
                key="list"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex flex-col h-full"
              >
                <div className="p-6 pb-2 shrink-0">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input 
                      placeholder="Search by name or phone..." 
                      className="pl-10 h-11 bg-slate-50 border-slate-200"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      suppressHydrationWarning
                    />
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 pt-2 space-y-3">
                  {filteredCustomers.map(customer => (
                    <button
                      key={customer.id}
                      onClick={() => {
                        onSelect(customer);
                        onClose();
                      }}
                      className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-slate-100 bg-white hover:border-primary/30 hover:bg-primary/5 transition-all text-left group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold group-hover:bg-primary group-hover:text-white transition-colors">
                          {customer.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{customer.name}</p>
                          <p className="text-xs font-bold text-slate-400">{customer.phone}</p>
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center group-hover:bg-primary group-hover:border-primary group-hover:text-white transition-all">
                        <Check className="w-4 h-4" />
                      </div>
                    </button>
                  ))}

                  {filteredCustomers.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                      <UserPlus className="w-12 h-12 mb-4 opacity-20" />
                      <p className="font-bold text-sm">No customers found</p>
                      <Button 
                        variant="link" 
                        className="text-primary font-bold"
                        onClick={() => setIsAddingNew(true)}
                      >
                        Add &quot;{searchQuery}&quot; as new customer
                      </Button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
