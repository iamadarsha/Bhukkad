"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, CreditCard, Banknote, Smartphone, Wallet, CheckCircle2, Loader2, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { formatCurrency } from "@/lib/utils/currency";
import { usePosStore } from "@/hooks/use-pos-store";
import { toast } from "sonner";
import confetti from "canvas-confetti";

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

export function PaymentModal({ isOpen, onClose, total, subtotal, tax, discount, onComplete }: PaymentModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("cash");
  const [amountTendered, setAmountTendered] = useState<string>(total.toString());
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [simulateError, setSimulateError] = useState(false);
  const [customerPhone, setCustomerPhone] = useState("");
  const [needsGst, setNeedsGst] = useState(false);
  const { cart } = usePosStore();

  const changeAmount = Math.max(0, parseFloat(amountTendered || "0") - total);

  const handleComplete = async () => {
    setIsProcessing(true);
    setIsError(false);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsProcessing(false);

    if (simulateError) {
      setIsError(true);
      toast.error("Payment Failed (Demo Simulation)");
      return;
    }

    setIsSuccess(true);
    
    // Trigger confetti
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#FF6B35', '#48BB78', '#63B3ED', '#F6AD55']
    });
    
    toast.success(`Payment Complete! ${formatCurrency(total)} received.`);
    
    setTimeout(() => {
      onComplete();
      setIsSuccess(false);
      setSelectedMethod("cash");
      setAmountTendered(total.toString());
    }, 4000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={!isProcessing && !isSuccess ? onClose : undefined}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-5xl bg-background rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-[90vh] max-h-[800px]"
          >
            {!isProcessing && !isSuccess && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
                <div className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-amber-200 flex items-center gap-2 shadow-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  Demo Mode • No Real Payment
                </div>
              </div>
            )}

            {!isProcessing && !isSuccess && (
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-muted hover:bg-muted-foreground/20 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}

            {isSuccess ? (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 15, stiffness: 200, delay: 0.1 }}
                  className="w-24 h-24 rounded-full bg-success/20 flex items-center justify-center text-success mb-4"
                >
                  <CheckCircle2 className="w-12 h-12" />
                </motion.div>
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold">Payment Successful!</h2>
                  <p className="text-sm font-bold text-success uppercase tracking-widest">Demo Transaction Approved</p>
                </div>
                <p className="text-xl text-muted-foreground">Received {formatCurrency(total)} via {selectedMethod.toUpperCase()}</p>
                
                <div className="flex gap-4 mt-8">
                  <Button variant="outline" size="lg" className="gap-2" onClick={onComplete}>
                    <Receipt className="w-5 h-5" /> Print Receipt
                  </Button>
                  <Button size="lg" onClick={onComplete}>
                    New Order
                  </Button>
                </div>
              </div>
            ) : isError ? (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-24 h-24 rounded-full bg-error/20 flex items-center justify-center text-error mb-4"
                >
                  <X className="w-12 h-12" />
                </motion.div>
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold">Payment Failed</h2>
                  <p className="text-sm font-bold text-error uppercase tracking-widest">Demo Simulation: Card Declined</p>
                </div>
                <p className="text-xl text-muted-foreground max-w-md mx-auto">
                  The transaction was declined by the simulated bank. Please try another payment method.
                </p>
                
                <Button size="lg" className="mt-8" onClick={() => setIsError(false)}>
                  Try Again
                </Button>
              </div>
            ) : (
              <>
                {/* Left Panel: Bill Summary */}
                <div className="w-full md:w-2/5 bg-surface border-r border-border flex flex-col h-full">
                  <div className="p-6 border-b border-border bg-muted/30">
                    <h2 className="text-2xl font-bold tracking-tight mb-1">Bill Summary</h2>
                    <p className="text-sm text-muted-foreground">Order #1042 • Table 5</p>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Items ({cart.length})</h3>
                      <div className="space-y-2">
                        {cart.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span className="flex-1 truncate pr-4">{item.quantity}x {item.name}</span>
                            <span className="font-medium">{formatCurrency(item.price * item.quantity)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-border border-dashed space-y-2">
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Subtotal</span>
                        <span>{formatCurrency(subtotal)}</span>
                      </div>
                      {discount > 0 && (
                        <div className="flex justify-between text-sm text-success font-medium">
                          <span>Discount</span>
                          <span>-{formatCurrency(discount)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Taxes (GST 5%)</span>
                        <span>{formatCurrency(tax)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 bg-primary/5 border-t border-primary/20">
                    <div className="flex justify-between items-end">
                      <span className="text-lg font-semibold text-primary-dark">Grand Total</span>
                      <span className="text-4xl font-black text-primary tracking-tight">{formatCurrency(total)}</span>
                    </div>
                  </div>

                  <div className="p-4 bg-muted/30 border-t border-border mt-auto">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase text-muted-foreground">Demo Controls</span>
                      <div className="flex items-center gap-2">
                        <Checkbox 
                          id="simulate-error" 
                          checked={simulateError} 
                          onCheckedChange={(c) => setSimulateError(c as boolean)} 
                        />
                        <label htmlFor="simulate-error" className="text-[10px] font-bold uppercase cursor-pointer">
                          Simulate Failure
                        </label>
                      </div>
                    </div>
                    <p className="text-[9px] text-muted-foreground leading-tight italic">
                      This is a simulated payment flow. No actual transaction will occur.
                    </p>
                  </div>
                </div>

                {/* Right Panel: Payment Methods */}
                <div className="w-full md:w-3/5 flex flex-col h-full bg-background">
                  <div className="p-6 md:p-8 flex-1 overflow-y-auto space-y-8">
                    
                    {/* Customer Section */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Customer Details</h3>
                      <div className="flex gap-3">
                        <div className="flex-1">
                          <Label htmlFor="phone" className="sr-only">Phone Number</Label>
                          <Input 
                            id="phone" 
                            placeholder="Enter phone number to lookup..." 
                            value={customerPhone}
                            onChange={(e) => setCustomerPhone(e.target.value)}
                            className="h-12 text-lg"
                          />
                        </div>
                        <Button variant="secondary" className="h-12 px-6">Lookup</Button>
                      </div>
                      
                      <div className="flex items-center space-x-2 pt-2">
                        <Checkbox id="gst" checked={needsGst} onCheckedChange={(c) => setNeedsGst(c as boolean)} />
                        <label htmlFor="gst" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          Requires GST Invoice
                        </label>
                      </div>
                      
                      {needsGst && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="pt-2">
                          <Input placeholder="Enter GSTIN..." className="h-10 uppercase" />
                        </motion.div>
                      )}
                    </div>

                    {/* Payment Methods */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Payment Method</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <MethodCard 
                          id="cash" 
                          icon={<Banknote className="w-6 h-6" />} 
                          label="Cash" 
                          shortcut="C"
                          selected={selectedMethod === "cash"} 
                          onClick={() => setSelectedMethod("cash")} 
                        />
                        <MethodCard 
                          id="card" 
                          icon={<CreditCard className="w-6 h-6" />} 
                          label="Card" 
                          shortcut="D"
                          selected={selectedMethod === "card"} 
                          onClick={() => setSelectedMethod("card")} 
                        />
                        <MethodCard 
                          id="upi" 
                          icon={<Smartphone className="w-6 h-6" />} 
                          label="UPI" 
                          shortcut="U"
                          selected={selectedMethod === "upi"} 
                          onClick={() => setSelectedMethod("upi")} 
                        />
                        <MethodCard 
                          id="wallet" 
                          icon={<Wallet className="w-6 h-6" />} 
                          label="Wallet" 
                          shortcut="W"
                          selected={selectedMethod === "wallet"} 
                          onClick={() => setSelectedMethod("wallet")} 
                        />
                      </div>
                    </div>

                    {/* Dynamic Payment Details based on method */}
                    <div className="space-y-4 pt-4 border-t border-border">
                      {selectedMethod === "cash" && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                          <div>
                            <Label htmlFor="tendered" className="text-sm text-muted-foreground mb-1 block">Amount Tendered</Label>
                            <div className="relative">
                              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-medium text-muted-foreground">₹</span>
                              <Input 
                                id="tendered" 
                                type="number" 
                                value={amountTendered}
                                onChange={(e) => setAmountTendered(e.target.value)}
                                className="h-16 pl-10 text-3xl font-bold bg-surface"
                                autoFocus
                              />
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center p-4 rounded-xl bg-muted/50 border border-border">
                            <span className="text-lg font-medium">Change Due</span>
                            <span className={`text-2xl font-bold ${changeAmount > 0 ? 'text-primary' : 'text-muted-foreground'}`}>
                              {formatCurrency(changeAmount)}
                            </span>
                          </div>
                          
                          {/* Quick Cash Buttons */}
                          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                            {[500, 1000, 2000, 5000].map(amt => (
                              <Button 
                                key={amt} 
                                variant="outline" 
                                className="flex-shrink-0"
                                onClick={() => setAmountTendered(amt.toString())}
                              >
                                ₹{amt}
                              </Button>
                            ))}
                            <Button variant="outline" onClick={() => setAmountTendered(total.toString())}>Exact</Button>
                          </div>
                        </motion.div>
                      )}
                      
                      {selectedMethod === "upi" && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-6 items-center p-6 bg-surface rounded-xl border border-border">
                          <div className="w-32 h-32 bg-white p-2 rounded-lg shadow-sm border border-border flex items-center justify-center">
                            {/* Placeholder for actual QR code */}
                            <div className="w-full h-full border-4 border-black border-dashed opacity-20 rounded flex items-center justify-center">
                              <span className="text-xs font-bold">QR CODE</span>
                            </div>
                          </div>
                          <div className="space-y-2 flex-1">
                            <p className="font-semibold text-lg">Scan to Pay</p>
                            <p className="text-muted-foreground text-sm">spicegarden@upi</p>
                            <Input placeholder="Enter Transaction ID (Optional)" className="mt-4" />
                          </div>
                        </motion.div>
                      )}
                      
                      {selectedMethod === "card" && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                          <div className="p-4 bg-info/10 text-info border border-info/20 rounded-xl text-sm flex items-center gap-3">
                            <CreditCard className="w-5 h-5" />
                            <p>Send payment of <strong>{formatCurrency(total)}</strong> to the card terminal.</p>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Reference Number</Label>
                              <Input placeholder="Terminal Ref..." />
                            </div>
                            <div className="space-y-2">
                              <Label>Last 4 Digits</Label>
                              <Input placeholder="••••" maxLength={4} />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>

                  </div>
                  
                  {/* Action Footer */}
                  <div className="p-6 md:p-8 border-t border-border bg-surface mt-auto">
                    <Button 
                      size="lg" 
                      className="w-full h-16 text-xl font-bold shadow-lg shadow-primary/20"
                      onClick={handleComplete}
                      disabled={isProcessing || (selectedMethod === 'cash' && parseFloat(amountTendered || "0") < total)}
                    >
                      {isProcessing ? (
                        <><Loader2 className="w-6 h-6 mr-2 animate-spin" /> Processing...</>
                      ) : (
                        `Complete Payment • ${formatCurrency(total)}`
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

function MethodCard({ id, icon, label, shortcut, selected, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`relative flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 ${
        selected 
          ? "border-primary bg-primary/5 text-primary shadow-sm" 
          : "border-border bg-surface text-muted-foreground hover:border-primary/30 hover:bg-surface"
      }`}
    >
      <div className="mb-2">{icon}</div>
      <span className="font-semibold">{label}</span>
      <span className="absolute top-2 right-2 text-[10px] font-bold px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
        {shortcut}
      </span>
      {selected && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center shadow-sm">
          <CheckCircle2 className="w-4 h-4" />
        </div>
      )}
    </button>
  );
}
