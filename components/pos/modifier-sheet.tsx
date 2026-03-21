"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Plus, Minus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils/currency";
import { MenuItem, ModifierGroup, Modifier } from "@/types";
import { usePosStore } from "@/hooks/use-pos-store";

interface ModifierSheetProps {
  isOpen: boolean;
  onClose: () => void;
  item: MenuItem | null;
}

export function ModifierSheet({ isOpen, onClose, item }: ModifierSheetProps) {
  const { addToCart } = usePosStore();
  
  // Initialize state from item
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");
  const [selectedModifiers, setSelectedModifiers] = useState<Record<string, string[]>>(() => {
    if (!item) return {};
    const defaults: Record<string, string[]> = {};
    item.modifierGroups?.forEach(group => {
      const defaultMods = group.modifiers.filter(m => m.isDefault).map(m => m.id);
      if (defaultMods.length > 0) {
        defaults[group.id] = defaultMods;
      }
    });
    return defaults;
  });

  if (!isOpen || !item) return null;

  const handleModifierToggle = (groupId: string, modifierId: string, isMultiple: boolean, maxSelections?: number) => {
    setSelectedModifiers(prev => {
      const currentGroupSelections = prev[groupId] || [];
      const isSelected = currentGroupSelections.includes(modifierId);

      if (isSelected) {
        // Remove
        return {
          ...prev,
          [groupId]: currentGroupSelections.filter(id => id !== modifierId)
        };
      } else {
        // Add
        if (!isMultiple) {
          // Single selection: replace
          return {
            ...prev,
            [groupId]: [modifierId]
          };
        } else {
          // Multiple selection: check limit
          if (maxSelections && currentGroupSelections.length >= maxSelections) {
            return prev; // Limit reached
          }
          return {
            ...prev,
            [groupId]: [...currentGroupSelections, modifierId]
          };
        }
      }
    });
  };

  const calculateTotal = () => {
    let total = item.price;
    
    // Add modifier prices
    Object.entries(selectedModifiers).forEach(([groupId, modIds]) => {
      const group = item.modifierGroups?.find(g => g.id === groupId);
      if (group) {
        modIds.forEach(modId => {
          const mod = group.modifiers.find(m => m.id === modId);
          if (mod) total += mod.price;
        });
      }
    });

    return total * quantity;
  };

  const isSelectionValid = () => {
    if (!item.modifierGroups) return true;

    for (const group of item.modifierGroups) {
      const selectedCount = (selectedModifiers[group.id] || []).length;
      if (group.isRequired && selectedCount < (group.minSelections || 1)) {
        return false;
      }
    }
    return true;
  };

  const handleAddToCart = () => {
    if (!isSelectionValid()) return;

    // Construct selected modifiers array for the cart item
    const cartModifiers = [];
    for (const [groupId, modIds] of Object.entries(selectedModifiers)) {
      const group = item.modifierGroups?.find(g => g.id === groupId);
      if (group) {
        for (const modId of modIds) {
          const mod = group.modifiers.find(m => m.id === modId);
          if (mod) {
            cartModifiers.push({
              id: mod.id,
              name: mod.name,
              price: mod.price,
              groupId: group.id
            });
          }
        }
      }
    }

    addToCart({
      ...item,
      quantity,
      selectedModifiers: cartModifiers,
      notes
    });
    
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-background shadow-2xl flex flex-col border-l border-border"
          >
            {/* Header */}
            <div className="p-6 border-b border-border bg-surface flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold">{item.name}</h2>
                <p className="text-muted-foreground mt-1">{formatCurrency(item.price)}</p>
              </div>
              <button 
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-muted hover:bg-muted-foreground/20 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              
              {/* Modifiers */}
              {item.modifierGroups?.map(group => {
                const selectedCount = (selectedModifiers[group.id] || []).length;
                const isRequired = group.isRequired;
                const isSatisfied = !isRequired || selectedCount >= (group.minSelections || 1);

                return (
                  <div key={group.id} className="space-y-4">
                    <div className="flex items-baseline justify-between">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        {group.name}
                        {isRequired && !isSatisfied && (
                          <span className="text-[10px] uppercase tracking-wider bg-destructive/10 text-destructive px-2 py-0.5 rounded-full font-bold">
                            Required
                          </span>
                        )}
                      </h3>
                      <span className="text-sm text-muted-foreground">
                        {group.isMultiple 
                          ? `Choose up to ${group.maxSelections || 'any'}` 
                          : 'Choose 1'}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {group.modifiers.map(mod => {
                        const isSelected = (selectedModifiers[group.id] || []).includes(mod.id);
                        const isDisabled = !isSelected && group.isMultiple && group.maxSelections && selectedCount >= group.maxSelections;

                        return (
                          <button
                            key={mod.id}
                            onClick={() => handleModifierToggle(group.id, mod.id, group.isMultiple, group.maxSelections)}
                            disabled={isDisabled}
                            className={`
                              w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all text-left
                              ${isSelected 
                                ? "border-primary bg-primary/5 shadow-sm" 
                                : "border-border bg-surface hover:border-primary/30"
                              }
                              ${isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                            `}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`
                                w-5 h-5 flex items-center justify-center border rounded-sm transition-colors
                                ${group.isMultiple ? "rounded" : "rounded-full"}
                                ${isSelected ? "bg-primary border-primary text-primary-foreground" : "border-input bg-background"}
                              `}>
                                {isSelected && <Check className="w-3.5 h-3.5" />}
                              </div>
                              <span className={`font-medium ${isSelected ? "text-foreground" : "text-muted-foreground"}`}>
                                {mod.name}
                              </span>
                            </div>
                            {mod.price > 0 && (
                              <span className="text-sm font-medium text-muted-foreground">
                                +{formatCurrency(mod.price)}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {/* Special Instructions */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Special Instructions</h3>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. No onions, extra spicy..."
                  className="w-full min-h-[100px] p-4 rounded-xl border-2 border-border bg-surface resize-none focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>

            </div>

            {/* Footer */}
            <div className="p-6 border-t border-border bg-surface space-y-4">
              
              <div className="flex items-center justify-between">
                <span className="font-semibold text-muted-foreground">Quantity</span>
                <div className="flex items-center gap-4 bg-background border border-border rounded-lg p-1">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center rounded-md hover:bg-muted transition-colors text-muted-foreground"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="w-8 text-center font-bold text-lg">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center rounded-md hover:bg-muted transition-colors text-muted-foreground"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <Button 
                size="lg" 
                className="w-full h-14 text-lg font-bold"
                onClick={handleAddToCart}
                disabled={!isSelectionValid()}
              >
                Add to Order • {formatCurrency(calculateTotal())}
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
