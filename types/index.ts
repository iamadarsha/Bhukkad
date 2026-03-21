import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: string;
      permissions: string[];
      outletId: string;
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    role?: string;
    permissions?: string[];
    outletId?: string;
  }
}

export interface Modifier {
  id: string;
  name: string;
  price: number;
  isDefault: boolean;
  isVeg: boolean;
}

export interface ModifierGroup {
  id: string;
  name: string;
  minSelections: number;
  maxSelections: number;
  isMultiple: boolean;
  isRequired: boolean;
  modifiers: Modifier[];
}

export interface MenuItem {
  id: string;
  categoryId: string;
  name: string;
  description?: string;
  shortCode?: string;
  imageUrl?: string;
  basePrice: number;
  foodType: 'veg' | 'non_veg' | 'vegan' | 'egg';
  taxCategoryId?: string;
  isActive: boolean;
  isBestseller: boolean;
  isChefsSpecial: boolean;
  spiceLevel: number;
  prepTimeMinutes: number;
  tags: string[];
  modifierGroups?: ModifierGroup[];
}

export interface Category {
  id: string;
  name: string;
  emoji?: string;
  displayOrder: number;
  isActive: boolean;
}

export interface Table {
  id: string;
  sectionId: string;
  name: string;
  capacity: number;
  shape: 'circle' | 'rectangle' | 'square';
  status: 'available' | 'occupied' | 'reserved' | 'dirty' | 'inactive';
  positionX: number;
  positionY: number;
  width: number;
  height: number;
}

export interface OrderItem {
  id: string;
  itemId: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  itemTotal: number;
  modifiers: any[];
  itemNote?: string;
  isVoid: boolean;
  sentToKitchenAt?: string;
}

export interface Order {
  id: string;
  tableId?: string;
  orderNumber: string;
  orderType: 'dine_in' | 'takeaway' | 'delivery' | 'online';
  status: 'draft' | 'active' | 'billed' | 'paid' | 'cancelled' | 'void';
  paxCount: number;
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  items: OrderItem[];
  createdAt: string;
}

export interface Kot {
  id: string;
  orderId: string;
  kotNumber: string;
  status: 'pending' | 'preparing' | 'ready' | 'served' | 'cancelled';
  createdAt: string;
  items: any[];
}
