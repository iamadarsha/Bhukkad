"use client";

import { useEffect, useRef } from "react";
import confetti from "canvas-confetti";

interface PaymentConfettiProps {
  trigger: boolean;
}

/**
 * Fires confetti burst when a payment is completed.
 * Uses brand primary (orange) and tertiary (gold) colors.
 */
export function PaymentConfetti({ trigger }: PaymentConfettiProps) {
  const fired = useRef(false);

  useEffect(() => {
    if (trigger && !fired.current) {
      fired.current = true;
      // Main burst
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.65 },
        colors: ["#FF6B35", "#FFB59A", "#D6C68F", "#F3E2A8", "#FFFFFF"],
        ticks: 200,
      });
      // Side bursts
      setTimeout(() => {
        confetti({ particleCount: 40, angle: 60, spread: 55, origin: { x: 0 }, colors: ["#FF6B35", "#FFB59A"] });
        confetti({ particleCount: 40, angle: 120, spread: 55, origin: { x: 1 }, colors: ["#FF6B35", "#D6C68F"] });
      }, 200);
    }
    if (!trigger) fired.current = false;
  }, [trigger]);

  return null;
}
