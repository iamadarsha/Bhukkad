"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, Clock, User } from "lucide-react";

const MOCK_RESERVATIONS = [
  { id: 1, name: "John Doe", time: "19:00", pax: 4, status: "confirmed" },
  { id: 2, name: "Jane Smith", time: "20:00", pax: 2, status: "pending" },
];

export default function ReservationsPage() {
  const [reservations, setReservations] = useState(MOCK_RESERVATIONS);

  return (
    <div className="p-8 bg-[#F4F7FA] h-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-black">Reservations</h1>
        <Button className="font-bold">
          <Plus className="w-4 h-4 mr-2" />
          Add Reservation
        </Button>
      </div>
      <div className="grid gap-4">
        {reservations.map((res) => (
          <Card key={res.id} className="border-none shadow-sm">
            <CardContent className="p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{res.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {res.time}
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {res.pax} Pax
                    </div>
                  </div>
                </div>
              </div>
              <Badge className={res.status === 'confirmed' ? 'bg-success' : 'bg-warning'}>
                {res.status}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
