"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MaterialIcon } from "@/components/ui/material-icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/utils/currency";
import { usePosStore } from "@/hooks/use-pos-store";
import { toast } from "sonner";
import { dialogAnim } from "@/lib/theme/motion";
import { cn } from "@/lib/utils";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
  subtotal: number;
  tax: number;
  discount: number;
  onComplete: () => void;
}

type PaymentMethod = "cash" | "card" | "upi" | "wallet";

const PAYMENT_METHODS: { key: PaymentMethod; label: string; icon: string; shortcut: string }[] = [
  { key: "cash",   label: "Cash",   icon: "payments",     shortcut: "C" },
  { key: "card",   label: "Card",   icon: "credit_card",  shortcut: "D" },
  { key: "upi",    label: "UPI",    icon: "smartphone",   shortcut: "U" },
  { key: "wallet", label: "Wallet", icon: "account_balance_wallet", shortcut: "W" },
];

export function PaymentModal({ isOpen, onClose, total, subtotal, tax, discount, onComplete }: PaymentModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("cash");
  const [amountTendered, setAmountTendered] = useState<string>(total.toFixed(0));
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [customerPhone, setCustomerPhone] = useState("");
  const [needsGst, setNeedsGst] = useState(false);
  const { cart, selectedTableId } = usePosStore();

  const changeAmount = Math.max(0, parseFloat(amountTendered || "0") - total);
  const cgst = tax / 2;
  const sgst = tax / 2;

  const handleComplete = async () => {
    setIsProcessing(true);
    setIsError(false);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsProcessing(false);
    setIsSuccess(true);
    toast.success(`Payment of ${formatCurrency(total)} received!`);
    setTimeout(() => {
      onComplete();
      setIsSuccess(false);
      setSelectedMethod("cash");
      setAmountTendered(total.toFixed(0));
    }, 2500);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Scrim */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.32 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
            style={{ background: "var(--md-sys-color-scrim)" }}
            onClick={!isProcessing && !isSuccess ? onClose : undefined}
          />

          {/* Dialog — MD3 Extra-Large corners, elevation-3 */}
          <motion.div
            {...dialogAnim}
            className="relative w-full max-w-5xl flex h-[90vh] max-h-[800px] overflow-hidden"
            style={{
              borderRadius: "var(--md-sys-shape-corner-extra-large)",
              background: "var(--md-sys-color-surface-container-low)",
              boxShadow: "var(--md-sys-elevation-3)",
            }}
          >
            {/* Demo badge */}
            {!isSuccess && !isProcessing && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
                <div
                  className="px-3 py-1 rounded-full text-label-sm font-medium flex items-center gap-2"
                  style={{
                    background: "var(--md-sys-color-tertiary-container)",
                    color: "var(--md-sys-color-on-tertiary-container)",
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--md-sys-color-tertiary)] animate-pulse" />
                  Demo Mode — No Real Payment
                </div>
              </div>
            )}

            {/* Close button */}
            {!isProcessing && !isSuccess && (
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full transition-colors state-layer"
                style={{
                  background: "var(--md-sys-color-surface-container-high)",
                  color: "var(--md-sys-color-on-surface-variant)",
                }}
              >
                <MaterialIcon icon="close" size={18} />
              </button>
            )}

            {/* Success state */}
            {isSuccess ? (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center gap-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 15, stiffness: 200, delay: 0.1 }}
                  className="w-24 h-24 rounded-full flex items-center justify-center"
                  style={{
                    background: "color-mix(in srgb, #386A20 15%, transparent)",
                    color: "#386A20",
                  }}
                >
                  <MaterialIcon icon="check_circle" size={48} fill={1} />
                </motion.div>
                <div>
                  <h2 className="text-headline-sm font-medium" style={{ color: "var(--md-sys-color-on-surface)" }}>
                    Payment Successful!
                  </h2>
                  <p className="text-body-md mt-1" style={{ color: "var(--md-sys-color-on-surface-variant)" }}>
                    {formatCurrency(total)} received via {selectedMethod.toUpperCase()}
                  </p>
                </div>
                <div className="flex gap-3 mt-4">
                  <Button variant="outlined" onClick={onComplete}>
                    <MaterialIcon icon="print" size={18} />
                    Print Receipt
                  </Button>
                  <Button variant="filled" onClick={onComplete}>
                    New Order
                  </Button>
                </div>
              </div>
            ) : (
              <>
                {/* Left Panel: Bill Summary + Thermal Receipt Preview */}
                <div
                  className="w-2/5 flex flex-col h-full overflow-hidden"
                  style={{ borderRight: "1px solid var(--md-sys-color-outline-variant)" }}
                >
                  <div className="p-6 shrink-0" style={{ borderBottom: "1px solid var(--md-sys-color-outline-variant)" }}>
                    <h2 className="text-title-lg font-medium" style={{ color: "var(--md-sys-color-on-surface)" }}>
                      Bill Summary
                    </h2>
                    <p className="text-body-sm mt-0.5" style={{ color: "var(--md-sys-color-on-surface-variant)" }}>
                      {selectedTableId ? `Table ${selectedTableId.replace("t", "")}` : "Takeaway"} • {cart.length} item{cart.length !== 1 ? "s" : ""}
                    </p>
                  </div>

                  {/* Thermal Receipt Preview */}
                  <div className="flex-1 overflow-y-auto p-4">
                    <div className="thermal-receipt">
                      <div className="text-center font-bold text-sm mb-1">BHUKKAD RESTAURANT</div>
                      <div className="text-center text-xs mb-1">123 Foodie Lane, Bengaluru</div>
                      <div className="text-center text-xs mb-2">GSTIN: 29ABCDE1234F1Z5</div>
                      <hr className="thermal-receipt-divider" />
                      <div className="text-xs mb-1">
                        Date: {new Date().toLocaleDateString("en-IN")} &nbsp;
                        Time: {new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                      </div>
                      <div className="text-xs mb-2">
                        {selectedTableId ? `Table: ${selectedTableId.replace("t", "")}` : "Order: Takeaway"}
                      </div>
                      <hr className="thermal-receipt-divider" />
                      <div className="text-xs">
                        {cart.map((item, i) => (
                          <div key={i} className="flex justify-between py-0.5">
                            <span className="flex-1 truncate">{item.quantity}x {item.itemName}</span>
                            <span className="ml-2">{formatCurrency(item.itemTotal)}</span>
                          </div>
                        ))}
                      </div>
                      <hr className="thermal-receipt-divider" />
                      <div className="text-xs space-y-0.5">
                        <div className="flex justify-between">
                          <span>Subtotal</span>
                          <span>{formatCurrency(subtotal)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>CGST (2.5%)</span>
                          <span>{formatCurrency(cgst)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>SGST (2.5%)</span>
                          <span>{formatCurrency(sgst)}</span>
                        </div>
                        {discount > 0 && (
                          <div className="flex justify-between">
                            <span>Discount</span>
                            <span>-{formatCurrency(discount)}</span>
                          </div>
                        )}
                      </div>
                      <hr className="thermal-receipt-divider" />
                      <div className="flex justify-between font-bold text-sm mt-1">
                        <span>TOTAL</span>
                        <span>{formatCurrency(total)}</span>
                      </div>
                      <hr className="thermal-receipt-divider" />
                      <div className="text-center text-xs mt-2">Thank you for dining with us!</div>
                      <div className="text-center text-xs">Visit again soon 🙏</div>
                    </div>
                  </div>
                </div>

                {/* Right Panel: Payment Methods */}
                <div className="flex-1 flex flex-col h-full overflow-hidden">
                  <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Customer Details */}
                    <div>
                      <h3 className="text-title-sm font-medium mb-3" style={{ color: "var(--md-sys-color-on-surface)" }}>
                        Customer Details
                      </h3>
                      <div className="flex gap-2">
                        <input
                          type="tel"
                          placeholder="Phone number for loyalty lookup…"
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          className="flex-1 h-11 px-4 rounded-full text-body-md outline-none focus:ring-2 focus:ring-[var(--md-sys-color-primary)]"
                          style={{
                            background: "var(--md-sys-color-surface-container)",
                            color: "var(--md-sys-color-on-surface)",
                            border: "1px solid var(--md-sys-color-outline)",
                          }}
                        />
                        <Button variant="tonal" size="sm">
                          <MaterialIcon icon="search" size={16} />
                        </Button>
                      </div>
                      <label className="flex items-center gap-2 mt-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={needsGst}
                          onChange={(e) => setNeedsGst(e.target.checked)}
                          className="w-4 h-4 accent-[var(--md-sys-color-primary)] rounded"
                        />
                        <span className="text-body-sm" style={{ color: "var(--md-sys-color-on-surface-variant)" }}>
                          Requires GST Invoice
                        </span>
                      </label>
                      <AnimatePresence>
                        {needsGst && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden mt-2"
                          >
                            <input
                              placeholder="Enter GSTIN…"
                              className="w-full h-10 px-4 rounded-full text-body-sm uppercase outline-none"
                              style={{
                                background: "var(--md-sys-color-surface-container)",
                                border: "1px solid var(--md-sys-color-outline)",
                                color: "var(--md-sys-color-on-surface)",
                              }}
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Payment Method Selection — MD3 Outlined Cards */}
                    <div>
                      <h3 className="text-title-sm font-medium mb-3" style={{ color: "var(--md-sys-color-on-surface)" }}>
                        Payment Method
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        {PAYMENT_METHODS.map(({ key, label, icon, shortcut }) => (
                          <button
                            key={key}
                            onClick={() => setSelectedMethod(key)}
                            className={cn(
                              "relative flex flex-col items-center justify-center gap-2 p-4 rounded-[var(--md-sys-shape-corner-medium)] border transition-all duration-150 state-layer",
                              selectedMethod === key
                                ? "border-[var(--md-sys-color-primary)]"
                                : "border-[var(--md-sys-color-outline-variant)]"
                            )}
                            style={
                              selectedMethod === key
                                ? {
                                    background: "var(--md-sys-color-primary-container)",
                                    color: "var(--md-sys-color-on-primary-container)",
                                  }
                                : {
                                    background: "var(--md-sys-color-surface-container-lowest)",
                                    color: "var(--md-sys-color-on-surface-variant)",
                                  }
                            }
                          >
                            <MaterialIcon icon={icon} fill={selectedMethod === key ? 1 : 0} size={24} />
                            <span className="text-label-lg font-medium">{label}</span>
                            <span
                              className="absolute top-2 right-2 text-label-sm px-1.5 py-0.5 rounded"
                              style={{ background: "var(--md-sys-color-surface-container-high)", color: "var(--md-sys-color-on-surface-variant)" }}
                            >
                              {shortcut}
                            </span>
                            {selectedMethod === key && (
                              <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: "var(--md-sys-color-primary)", color: "var(--md-sys-color-on-primary)" }}>
                                <MaterialIcon icon="check" size={12} />
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Cash payment details */}
                    <AnimatePresence mode="wait">
                      {selectedMethod === "cash" && (
                        <motion.div
                          key="cash"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="space-y-3"
                        >
                          <label className="text-label-md font-medium block" style={{ color: "var(--md-sys-color-on-surface-variant)" }}>
                            Amount Tendered
                          </label>
                          <div className="relative">
                            <span
                              className="absolute left-4 top-1/2 -translate-y-1/2 text-title-md font-medium"
                              style={{ color: "var(--md-sys-color-on-surface-variant)" }}
                            >
                              ₹
                            </span>
                            <input
                              type="number"
                              value={amountTendered}
                              onChange={(e) => setAmountTendered(e.target.value)}
                              className="w-full h-14 pl-10 pr-4 rounded-[var(--md-sys-shape-corner-extra-small)] text-title-lg font-medium outline-none focus:ring-2 focus:ring-[var(--md-sys-color-primary)]"
                              style={{
                                background: "var(--md-sys-color-surface-container)",
                                color: "var(--md-sys-color-on-surface)",
                                borderBottom: "2px solid var(--md-sys-color-primary)",
                              }}
                              autoFocus
                            />
                          </div>
                          <div
                            className="flex justify-between items-center p-4 rounded-[var(--md-sys-shape-corner-medium)]"
                            style={{ background: "var(--md-sys-color-surface-container)" }}
                          >
                            <span className="text-body-md" style={{ color: "var(--md-sys-color-on-surface)" }}>Change Due</span>
                            <span
                              className="text-title-lg font-semibold revenue-ticker"
                              style={{ color: changeAmount > 0 ? "var(--md-sys-color-primary)" : "var(--md-sys-color-outline)" }}
                            >
                              {formatCurrency(changeAmount)}
                            </span>
                          </div>
                          {/* Quick cash buttons */}
                          <div className="flex gap-2 flex-wrap">
                            {[500, 1000, 2000, 5000].map(amt => (
                              <Button
                                key={amt}
                                variant="outlined"
                                size="sm"
                                onClick={() => setAmountTendered(String(amt))}
                              >
                                ₹{amt}
                              </Button>
                            ))}
                            <Button
                              variant="outlined"
                              size="sm"
                              onClick={() => setAmountTendered(total.toFixed(0))}
                            >
                              Exact
                            </Button>
                          </div>
                        </motion.div>
                      )}

                      {selectedMethod === "upi" && (
                        <motion.div
                          key="upi"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="flex gap-6 items-center p-4 rounded-[var(--md-sys-shape-corner-medium)]"
                          style={{ background: "var(--md-sys-color-surface-container)" }}
                        >
                          <div
                            className="w-28 h-28 rounded-[var(--md-sys-shape-corner-small)] flex items-center justify-center text-xs font-bold shrink-0 border-2 border-dashed"
                            style={{ borderColor: "var(--md-sys-color-outline)" }}
                          >
                            QR CODE
                          </div>
                          <div className="space-y-2">
                            <p className="text-title-sm font-medium" style={{ color: "var(--md-sys-color-on-surface)" }}>Scan to Pay</p>
                            <p className="text-body-sm" style={{ color: "var(--md-sys-color-on-surface-variant)" }}>spicegarden@upi</p>
                            <input
                              placeholder="Transaction ID (optional)"
                              className="w-full h-9 px-3 rounded-full text-body-sm outline-none mt-2"
                              style={{
                                background: "var(--md-sys-color-surface-container-high)",
                                color: "var(--md-sys-color-on-surface)",
                                border: "1px solid var(--md-sys-color-outline-variant)",
                              }}
                            />
                          </div>
                        </motion.div>
                      )}

                      {selectedMethod === "card" && (
                        <motion.div
                          key="card"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="space-y-3"
                        >
                          <div
                            className="p-3 rounded-[var(--md-sys-shape-corner-medium)] flex items-center gap-3 text-body-sm"
                            style={{
                              background: "color-mix(in srgb, #005DB6 12%, transparent)",
                              color: "#005DB6",
                            }}
                          >
                            <MaterialIcon icon="credit_card" size={18} />
                            Send payment of <strong>{formatCurrency(total)}</strong> to the card terminal.
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <input
                              placeholder="Terminal Ref…"
                              className="h-10 px-3 rounded-full text-body-sm outline-none"
                              style={{
                                background: "var(--md-sys-color-surface-container)",
                                border: "1px solid var(--md-sys-color-outline)",
                                color: "var(--md-sys-color-on-surface)",
                              }}
                            />
                            <input
                              placeholder="Last 4 digits"
                              maxLength={4}
                              className="h-10 px-3 rounded-full text-body-sm outline-none"
                              style={{
                                background: "var(--md-sys-color-surface-container)",
                                border: "1px solid var(--md-sys-color-outline)",
                                color: "var(--md-sys-color-on-surface)",
                              }}
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Footer — MD3 Filled Button full width */}
                  <div
                    className="p-6 shrink-0"
                    style={{ borderTop: "1px solid var(--md-sys-color-outline-variant)" }}
                  >
                    <Button
                      variant="filled"
                      className="w-full h-14 text-title-sm font-medium"
                      onClick={handleComplete}
                      disabled={
                        isProcessing ||
                        (selectedMethod === "cash" && parseFloat(amountTendered || "0") < total)
                      }
                    >
                      {isProcessing ? (
                        <>
                          <div className="w-5 h-5 rounded-full border-2 border-current border-t-transparent animate-spin mr-2" />
                          Processing…
                        </>
                      ) : (
                        <>
                          <MaterialIcon icon="payments" size={20} fill={1} />
                          Complete Payment · {formatCurrency(total)}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
