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
    image?: string | null;
    role?: string;
    permissions?: string[];
    outletId?: string;
  }
}

export interface Modifier {
  id: string;
  name: string;
  priceDelta: number;
  price?: number;
  isDefault: boolean;
  isActive?: boolean;
  isVeg?: boolean;
}

export interface MenuItemVariant {
  id: string;
  itemId?: string;
  name: string;
  price: number;
  isActive?: boolean;
}

export interface ModifierGroup {
  id: string;
  name: string;
  minSelections: number;
  maxSelections: number;
  selectionType?: 'single' | 'multiple';
  isMultiple?: boolean;
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
  variants?: MenuItemVariant[];
  modifierGroups?: ModifierGroup[];
}

export interface Category {
  id: string;
  name: string;
  emoji?: string;
  imageUrl?: string | null;
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

export interface Customer {
  id: string;
  outletId?: string;
  name: string;
  phone: string;
  email?: string | null;
  address?: string | null;
  gstNumber?: string | null;
  loyaltyPoints?: number | null;
  totalVisits?: number | null;
  totalOrders?: number | null;
  totalSpent?: number | null;
  lastVisit?: string | null;
  createdAt?: string;
}

export interface OrderItemModifier {
  id: string;
  name?: string;
  groupId?: string;
  modifierId: string;
  modifierName: string;
  priceDelta: number;
}

export interface OrderItem {
  id: string;
  itemId: string;
  itemName: string;
  variantId?: string | null;
  variantName?: string | null;
  quantity: number;
  unitPrice: number;
  itemTotal: number;
  modifiers: OrderItemModifier[];
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

export type TabletLanguageCode = 'en' | 'hi';

export interface TabletOrderingSettings {
  taxRate: number;
  serviceCharge: number;
  printReceiptAutomatically: boolean;
  enableKDS: boolean;
  enableOnlineOrders: boolean;
  enableTabletOrdering: boolean;
  enableQrOrdering: boolean;
  defaultTabletLanguage: TabletLanguageCode;
}

export interface TabletTableSummary {
  id: string;
  name: string;
  capacity: number;
  status: Table['status'];
  sectionName?: string | null;
}

export interface TabletMenuItem extends MenuItem {
  variants?: MenuItemVariant[];
  modifierGroups?: ModifierGroup[];
}

export interface TabletMenuCategory {
  id: string;
  name: string;
  emoji?: string | null;
  imageUrl?: string | null;
  items: TabletMenuItem[];
}

export interface TabletOrderingBootstrap {
  outlet: {
    id: string;
    name: string;
    logoUrl?: string | null;
    currency: string;
  };
  table: TabletTableSummary;
  settings: TabletOrderingSettings;
  categories: TabletMenuCategory[];
}
