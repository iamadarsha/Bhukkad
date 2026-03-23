"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  Plus,
  User,
  Users,
} from "lucide-react";

const MOCK_RESERVATIONS = [
  { id: 1, name: "John Doe", time: "19:00", pax: 4, status: "confirmed" },
  { id: 2, name: "Jane Smith", time: "20:00", pax: 2, status: "pending" },
];

function getStatusClasses(status: string) {
  return status === "confirmed"
    ? "border-transparent bg-tertiary/15 text-tertiary"
    : "border-transparent bg-secondary/10 text-secondary";
}

export default function ReservationsPage() {
  const reservations = MOCK_RESERVATIONS;
  const confirmedCount = reservations.filter((reservation) => reservation.status === "confirmed")
    .length;
  const pendingCount = reservations.filter((reservation) => reservation.status === "pending")
    .length;
  const totalCovers = reservations.reduce((sum, reservation) => sum + reservation.pax, 0);

  return (
    <div className="min-h-full bg-background p-6 md:p-8">
      <div className="mb-8">
        <Card className="overflow-hidden border-border/70 bg-gradient-to-br from-primary/14 via-card to-accent/16 shadow-[var(--shadow-elevation-2)]">
          <CardContent className="flex flex-col gap-6 p-6 md:flex-row md:items-end md:justify-between md:p-8">
            <div className="space-y-4">
              <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.24em] text-primary">
                Bhukkad Guest Book
              </div>
              <div className="space-y-2">
                <h1 className="brand-display text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
                  Reservations
                </h1>
                <p className="max-w-2xl text-sm font-medium leading-relaxed text-muted-foreground md:text-base">
                  Track tonight&apos;s bookings, confirm covers quickly, and keep the front-of-house
                  team aligned.
                </p>
              </div>
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Reservation
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-3">
        <SummaryCard label="Confirmed bookings" value={confirmedCount.toString()} />
        <SummaryCard label="Pending follow-up" value={pendingCount.toString()} />
        <SummaryCard label="Expected covers" value={totalCovers.toString()} />
      </div>

      <div className="grid gap-4">
        {reservations.map((reservation) => (
          <Card key={reservation.id} className="border-border/70 bg-card/95">
            <CardContent className="flex flex-col gap-5 p-5 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-[var(--radius-medium)] bg-primary/10 text-primary">
                  <User className="h-6 w-6" />
                </div>
                <div className="space-y-2">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">{reservation.name}</h2>
                    <p className="text-sm font-medium text-muted-foreground">
                      Front desk handoff ready for service.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-primary" />
                      {reservation.time}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="h-4 w-4 text-primary" />
                      {reservation.pax} covers
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4 text-primary" />
                      Today
                    </div>
                  </div>
                </div>
              </div>
              <Badge className={getStatusClasses(reservation.status)}>
                {reservation.status}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <Card className="border-border/70 bg-card/95">
      <CardContent className="p-5">
        <p className="text-[11px] font-black uppercase tracking-[0.22em] text-muted-foreground">
          {label}
        </p>
        <h2 className="mt-3 brand-display text-3xl font-semibold text-foreground">{value}</h2>
      </CardContent>
    </Card>
  );
}
