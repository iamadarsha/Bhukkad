"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  tableId: string;
  tableName: string;
}

export function ReservationModal({ isOpen, onClose, tableId, tableName }: ReservationModalProps) {
  const [formData, setFormData] = useState({
    customerName: "",
    date: "",
    time: "",
    guests: 2,
    notes: "",
  });

  const handleSubmit = async () => {
    try {
      await apiClient.post("/reservations", { ...formData, tableId });
      toast.success("Table reserved successfully");
      onClose();
    } catch (error) {
      toast.error("Failed to reserve table");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reserve Table {tableName}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Customer Name</Label>
            <Input 
              value={formData.customerName} 
              onChange={(e) => setFormData({...formData, customerName: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date</Label>
              <Input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Time</Label>
              <Input type="time" value={formData.time} onChange={(e) => setFormData({...formData, time: e.target.value})} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Number of Guests</Label>
            <Input type="number" value={formData.guests} onChange={(e) => setFormData({...formData, guests: parseInt(e.target.value)})} />
          </div>
          <div className="space-y-2">
            <Label>Special Notes</Label>
            <Textarea value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Reserve</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
