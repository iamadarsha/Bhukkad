"use client";

import { usePosStore } from "@/hooks/use-pos-store";
import { formatCurrency } from "@/lib/utils/currency";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { MaterialIcon } from "@/components/ui/material-icon";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";
import { PaymentModal } from "./payment-modal";
import { PaymentConfetti } from "./payment-confetti";
import { getMenuIntelligence } from "@/lib/ai";
import { cn } from "@/lib/utils";
import { itemEntry } from "@/lib/theme/motion";

export function OrderCart() {
  const {
    cart,
    selectedTableId,
    orderType,
    paxCount,
    discountAmount,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = usePosStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [showTaxBreakdown, setShowTaxBreakdown] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + item.itemTotal, 0);
  const cgst = subtotal * 0.025; // 2.5%
  const sgst = subtotal * 0.025; // 2.5%
  const tax = cgst + sgst;       // 5% total GST
  const total = Math.max(0, subtotal + tax - discountAmount);

  const handleAiSuggest = async () => {
    if (cart.length === 0) {
      toast.info("Add some items to get AI suggestions");
      return;
    }
    setIsAiLoading(true);
    try {
      const itemsList = cart.map(i => `${i.quantity}x ${i.itemName}`).join(", ");
      const suggestion = await getMenuIntelligence(
        `Based on these items: ${itemsList}. Suggest 2-3 complementary dishes or drinks from an Indian restaurant. Keep it concise and appetizing.`
      );
      setAiSuggestion(suggestion ?? null);
    } catch {
      toast.error("Failed to get AI suggestions");
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSendKOT = async () => {
    if (cart.length === 0) return;
    setIsSubmitting(true);
    try {
      await apiClient.post("/orders", {
        tableId: selectedTableId,
        orderType,
        paxCount,
        items: cart,
        subtotal,
        taxAmount: tax,
        totalAmount: total,
      });
      toast.success("KOT sent to kitchen!");
      clearCart();
    } catch {
      toast.error("Failed to send KOT");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentComplete = () => {
    setIsPaymentModalOpen(false);
    setShowConfetti(true);
    clearCart();
    setTimeout(() => setShowConfetti(false), 3000);
  };

  return (
    <>
      <PaymentConfetti trigger={showConfetti} />

      <div className="flex flex-col h-full" style={{ background: "var(--md-sys-color-surface-container-lowest)" }}>
        {/* ── Cart Header ── */}
        <div
          className="p-4 shrink-0"
          style={{ borderBottom: "1px solid var(--md-sys-color-outline-variant)" }}
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-label-sm font-semibold uppercase tracking-widest" style={{ color: "var(--md-sys-color-outline)" }}>
                Current Order
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-title-lg font-medium" style={{ color: "var(--md-sys-color-on-surface)" }}>
                  {selectedTableId ? `Table ${selectedTableId.replace("t", "")}` : "Takeaway"}
                </span>
                <span
                  className="px-2 py-0.5 rounded-full text-label-sm font-medium"
                  style={{
                    background: "var(--md-sys-color-secondary-container)",
                    color: "var(--md-sys-color-on-secondary-container)",
                  }}
                >
                  {orderType.replace("_", " ")}
                </span>
              </div>
            </div>
            <Button
              variant="text"
              size="sm"
              onClick={clearCart}
              disabled={cart.length === 0}
              style={{ color: "var(--md-sys-color-error)" }}
            >
              <MaterialIcon icon="delete" size={16} />
              Clear
            </Button>
          </div>

          {/* Pax + Staff row */}
          <div className="grid grid-cols-2 gap-2">
            <div
              className="flex items-center gap-2 p-2 rounded-[var(--md-sys-shape-corner-small)]"
              style={{ background: "var(--md-sys-color-surface-container)" }}
            >
              <MaterialIcon icon="group" size={16} style={{ color: "var(--md-sys-color-outline)" }} />
              <span className="text-label-md font-medium" style={{ color: "var(--md-sys-color-on-surface-variant)" }}>
                {paxCount} Guest{paxCount !== 1 ? "s" : ""}
              </span>
            </div>
            <div
              className="flex items-center gap-2 p-2 rounded-[var(--md-sys-shape-corner-small)]"
              style={{ background: "var(--md-sys-color-surface-container)" }}
            >
              <MaterialIcon icon="badge" size={16} style={{ color: "var(--md-sys-color-outline)" }} />
              <span className="text-label-md font-medium" style={{ color: "var(--md-sys-color-on-surface-variant)" }}>
                Staff
              </span>
            </div>
          </div>
        </div>

        {/* ── Cart Items ── */}
        <ScrollArea className="flex-1 px-4 py-2">
          {cart.length === 0 ? (
            /* MD3 Empty State */
            <div className="h-full flex flex-col items-center justify-center py-16 gap-4">
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="text-6xl"
              >
                🍽️
              </motion.div>
              <div className="text-center">
                <p className="text-title-md font-medium" style={{ color: "var(--md-sys-color-on-surface)" }}>
                  Your order canvas awaits
                </p>
                <p className="text-body-sm mt-1" style={{ color: "var(--md-sys-color-on-surface-variant)" }}>
                  {selectedTableId ? "Add items from the menu" : "Select a table to start"}
                </p>
              </div>
            </div>
          ) : (
            <div>
              {/* AI Suggestion Banner */}
              <AnimatePresence>
                {aiSuggestion && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-3 overflow-hidden"
                  >
                    <div
                      className="p-3 rounded-[var(--md-sys-shape-corner-medium)] relative"
                      style={{
                        background: "var(--md-sys-color-tertiary-container)",
                        color: "var(--md-sys-color-on-tertiary-container)",
                      }}
                    >
                      <button
                        onClick={() => setAiSuggestion(null)}
                        className="absolute top-2 right-2 opacity-60 hover:opacity-100 transition-opacity"
                      >
                        <MaterialIcon icon="close" size={14} />
                      </button>
                      <div className="flex items-start gap-2">
                        <MaterialIcon icon="auto_awesome" size={16} className="shrink-0 mt-0.5" />
                        <div>
                          <p className="text-label-sm font-semibold uppercase tracking-widest mb-1">
                            AI Suggestion
                          </p>
                          <p className="text-body-sm italic leading-relaxed">{aiSuggestion}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Cart item list */}
              <AnimatePresence initial={false}>
                {cart.map(item => (
                  <motion.div
                    key={item.id}
                    {...itemEntry}
                    exit={{ opacity: 0, x: -20, transition: { duration: 0.15 } }}
                    className="py-3 group"
                    style={{ borderBottom: "1px solid var(--md-sys-color-outline-variant)" }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1 pr-3">
                        <div className="flex items-center gap-2">
                          {/* Veg indicator dot */}
                          <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ background: "var(--md-sys-color-outline)" }}
                          />
                          <span className="text-body-md font-medium" style={{ color: "var(--md-sys-color-on-surface)" }}>
                            {item.itemName}
                          </span>
                        </div>
                        {item.modifiers?.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1 ml-5">
                            {item.modifiers.map(m => (
                              <span
                                key={m.modifierId}
                                className="text-label-sm px-1.5 py-0.5 rounded-full"
                                style={{
                                  background: "var(--md-sys-color-surface-container)",
                                  color: "var(--md-sys-color-on-surface-variant)",
                                }}
                              >
                                + {m.modifierName}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <span className="text-body-md font-semibold revenue-ticker" style={{ color: "var(--md-sys-color-on-surface)" }}>
                        {formatCurrency(item.itemTotal)}
                      </span>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center justify-between ml-5">
                      <div
                        className="flex items-center rounded-full overflow-hidden"
                        style={{
                          border: "1px solid var(--md-sys-color-outline-variant)",
                          background: "var(--md-sys-color-surface-container)",
                        }}
                      >
                        <button
                          className="w-8 h-8 flex items-center justify-center hover:bg-[var(--md-sys-color-surface-container-high)] transition-colors"
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          style={{ color: "var(--md-sys-color-on-surface-variant)" }}
                        >
                          <MaterialIcon icon="remove" size={16} />
                        </button>
                        <span
                          className="w-9 text-center text-label-lg font-semibold revenue-ticker"
                          style={{ color: "var(--md-sys-color-primary)" }}
                        >
                          {item.quantity}
                        </span>
                        <button
                          className="w-8 h-8 flex items-center justify-center hover:bg-[var(--md-sys-color-surface-container-high)] transition-colors"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          style={{ color: "var(--md-sys-color-on-surface-variant)" }}
                        >
                          <MaterialIcon icon="add" size={16} />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-label-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ color: "var(--md-sys-color-error)" }}
                      >
                        Remove
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </ScrollArea>

        {/* ── Totals + Action Buttons ── */}
        <div
          className="p-4 shrink-0"
          style={{
            background: "var(--md-sys-color-surface-container-low)",
            borderTop: "1px solid var(--md-sys-color-outline-variant)",
          }}
        >
          {/* Tax breakdown (collapsible) */}
          <div className="space-y-1.5 mb-4">
            <div className="flex justify-between text-label-md font-medium" style={{ color: "var(--md-sys-color-on-surface-variant)" }}>
              <span>Subtotal</span>
              <span className="revenue-ticker">{formatCurrency(subtotal)}</span>
            </div>

            {/* Collapsible tax row */}
            <button
              className="w-full flex justify-between text-label-md font-medium transition-colors hover:opacity-80"
              style={{ color: "var(--md-sys-color-on-surface-variant)" }}
              onClick={() => setShowTaxBreakdown(!showTaxBreakdown)}
            >
              <span className="flex items-center gap-1">
                <MaterialIcon
                  icon={showTaxBreakdown ? "expand_less" : "expand_more"}
                  size={14}
                />
                Taxes (5% GST)
              </span>
              <span className="revenue-ticker">{formatCurrency(tax)}</span>
            </button>

            <AnimatePresence>
              {showTaxBreakdown && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden pl-3"
                >
                  <div className="flex justify-between text-label-sm py-0.5" style={{ color: "var(--md-sys-color-outline)" }}>
                    <span>CGST (2.5%)</span>
                    <span className="revenue-ticker">{formatCurrency(cgst)}</span>
                  </div>
                  <div className="flex justify-between text-label-sm py-0.5" style={{ color: "var(--md-sys-color-outline)" }}>
                    <span>SGST (2.5%)</span>
                    <span className="revenue-ticker">{formatCurrency(sgst)}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {discountAmount > 0 && (
              <div className="flex justify-between text-label-md font-medium" style={{ color: "#386A20" }}>
                <span>Discount</span>
                <span className="revenue-ticker">-{formatCurrency(discountAmount)}</span>
              </div>
            )}

            {/* Grand Total — the visual hero of the cart */}
            <div
              className="pt-3 mt-1 flex justify-between items-center"
              style={{ borderTop: "2px dashed var(--md-sys-color-outline-variant)" }}
            >
              <span className="text-label-lg font-semibold uppercase tracking-wider" style={{ color: "var(--md-sys-color-on-surface)" }}>
                Grand Total
              </span>
              <motion.span
                key={total}
                initial={{ scale: 1.05, opacity: 0.7 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="revenue-ticker font-bold"
                style={{
                  fontSize: "clamp(22px, 2.5vw, 32px)",
                  color: "var(--md-sys-color-primary)",
                }}
              >
                {formatCurrency(total)}
              </motion.span>
            </div>
          </div>

          {/* ── Action Buttons Row ── */}
          <div className="grid grid-cols-3 gap-2">
            {/* AI Suggest */}
            <Button
              variant="outlined"
              className="h-12 flex-col gap-1 text-label-sm"
              disabled={cart.length === 0 || isAiLoading}
              onClick={handleAiSuggest}
            >
              {isAiLoading ? (
                <div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
              ) : (
                <MaterialIcon icon="auto_awesome" size={18} />
              )}
              AI
            </Button>

            {/* Send KOT */}
            <Button
              variant="tonal"
              className="h-12 flex-col gap-1 text-label-sm"
              disabled={cart.length === 0 || isSubmitting}
              onClick={handleSendKOT}
            >
              {isSubmitting ? (
                <div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
              ) : (
                <MaterialIcon icon="send" size={18} />
              )}
              KOT
            </Button>

            {/* Settle / Pay */}
            <Button
              variant="filled"
              className="h-12 flex-col gap-1 text-label-sm"
              disabled={cart.length === 0 || isSubmitting}
              onClick={() => setIsPaymentModalOpen(true)}
            >
              <MaterialIcon icon="payments" size={18} />
              Settle
            </Button>
          </div>
        </div>

        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          total={total}
          subtotal={subtotal}
          tax={tax}
          discount={discountAmount}
          onComplete={handlePaymentComplete}
        />
      </div>
    </>
  );
}
