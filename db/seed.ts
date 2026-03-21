import { db } from './index';
import * as schema from './schema';
import bcrypt from 'bcryptjs';

async function seed() {
  console.log('Seeding database...');

  // Clear existing data (optional, but good for a fresh seed)
  // Note: SQLite doesn't support TRUNCATE, so we DELETE
  const tables = [
    schema.auditLogs, schema.dayEndReports, schema.reservations, schema.onlineOrders, schema.onlineOrderSources,
    schema.staffAttendance, schema.purchaseOrderItems, schema.purchaseOrders, schema.suppliers, schema.itemInventoryMap,
    schema.inventoryTransactions, schema.inventoryItems, schema.paymentSplits, schema.payments, schema.kotItems, schema.kots,
    schema.orderItemModifiers, schema.orderItems, schema.orders, schema.loyaltyTransactions, schema.customers,
    schema.coupons, schema.discounts, schema.taxCategories, schema.menuItemVariants, schema.modifiers, schema.itemModifierGroups,
    schema.modifierGroups, schema.menuItems, schema.menuCategories, schema.tables, schema.tableSections, schema.users,
    schema.roles, schema.outlets
  ];

  for (const table of tables) {
    await db.delete(table);
  }

  // 1. Outlets
  const [outlet] = await db.insert(schema.outlets).values({
    id: 'outlet-1',
    name: 'Spice Garden Restaurant',
    address: 'Plot 42, Dharampeth, Nagpur, Maharashtra 440010',
    city: 'Nagpur',
    state: 'Maharashtra',
    gstin: '27AABCS1429B1ZB',
    fssaiNumber: '11224000000123',
    phone: '+91 98765 43210',
    currency: 'INR',
    timezone: 'Asia/Kolkata',
  }).returning();

  // 2. Roles
  const rolesData = [
    { id: 'role-owner', name: 'owner', permissions: ['all'] },
    { id: 'role-manager', name: 'manager', permissions: ['manage_menu', 'manage_staff', 'view_reports', 'pos_access'] },
    { id: 'role-cashier', name: 'cashier', permissions: ['pos_access', 'process_payments'] },
    { id: 'role-waiter', name: 'waiter', permissions: ['pos_access', 'create_orders'] },
    { id: 'role-kitchen', name: 'kitchen', permissions: ['kitchen_display'] },
  ];
  await db.insert(schema.roles).values(rolesData);

  // 3. Users
  const hashPassword = (pw: string) => bcrypt.hashSync(pw, 10);
  const hashPin = (pin: string) => bcrypt.hashSync(pin, 10);

  const usersData = [
    { id: 'user-1', name: 'admin', email: 'admin@admin.com', passwordHash: hashPassword('admin'), pinHash: hashPin('1111'), roleId: 'role-owner', outletId: outlet.id },
    { id: 'user-2', name: 'Priya Deshmukh', email: 'manager@spicegarden.com', passwordHash: hashPassword('Mgr@123'), pinHash: hashPin('2222'), roleId: 'role-manager', outletId: outlet.id },
    { id: 'user-3', name: 'Amit Patil', email: 'cashier@spicegarden.com', passwordHash: hashPassword('Cash@123'), pinHash: hashPin('3333'), roleId: 'role-cashier', outletId: outlet.id },
    { id: 'user-4', name: 'Suresh Kumar', email: 'waiter1@spicegarden.com', passwordHash: hashPassword('Wait@123'), pinHash: hashPin('4444'), roleId: 'role-waiter', outletId: outlet.id },
    { id: 'user-5', name: 'Mohan Yadav', email: 'kitchen@spicegarden.com', passwordHash: hashPassword('Kitch@123'), pinHash: hashPin('5555'), roleId: 'role-kitchen', outletId: outlet.id },
  ];
  await db.insert(schema.users).values(usersData);

  // 4. Tax Categories
  const taxCategoriesData = [
    { id: 'tax-food', outletId: outlet.id, name: 'Food GST 5%', cgstRate: 2.5, sgstRate: 2.5, igstRate: 0, isServiceCharge: false },
    { id: 'tax-bev', outletId: outlet.id, name: 'Beverage GST 18%', cgstRate: 9, sgstRate: 9, igstRate: 0, isServiceCharge: false },
    { id: 'tax-sc', outletId: outlet.id, name: 'Service Charge 5%', cgstRate: 0, sgstRate: 0, igstRate: 0, isServiceCharge: true },
  ];
  await db.insert(schema.taxCategories).values(taxCategoriesData);

  // 5. Menu Categories
  const categoriesData = [
    { id: 'cat-starters', outletId: outlet.id, name: 'Starters', emoji: '🥗', displayOrder: 1 },
    { id: 'cat-mains', outletId: outlet.id, name: 'Main Course', emoji: '🍛', displayOrder: 2 },
    { id: 'cat-breads', outletId: outlet.id, name: 'Breads', emoji: '🫓', displayOrder: 3 },
    { id: 'cat-beverages', outletId: outlet.id, name: 'Beverages', emoji: '🥤', displayOrder: 4 },
    { id: 'cat-desserts', outletId: outlet.id, name: 'Desserts', emoji: '🍮', displayOrder: 5 },
    { id: 'cat-combos', outletId: outlet.id, name: 'Combos', emoji: '🍱', displayOrder: 6 },
  ];
  await db.insert(schema.menuCategories).values(categoriesData);

  // 6. Menu Items
  const menuItemsData = [
    { id: 'item-1', categoryId: 'cat-starters', outletId: outlet.id, name: 'Paneer Tikka', basePrice: 220, foodType: 'veg', taxCategoryId: 'tax-food', isBestseller: true },
    { id: 'item-2', categoryId: 'cat-starters', outletId: outlet.id, name: 'Chicken Tikka', basePrice: 280, foodType: 'non_veg', taxCategoryId: 'tax-food', isBestseller: true },
    { id: 'item-3', categoryId: 'cat-mains', outletId: outlet.id, name: 'Butter Chicken', basePrice: 320, foodType: 'non_veg', taxCategoryId: 'tax-food', isBestseller: true, spiceLevel: 2 },
    { id: 'item-4', categoryId: 'cat-mains', outletId: outlet.id, name: 'Dal Makhani', basePrice: 240, foodType: 'veg', taxCategoryId: 'tax-food', isBestseller: true },
    { id: 'item-5', categoryId: 'cat-mains', outletId: outlet.id, name: 'Chicken Biryani', basePrice: 350, foodType: 'non_veg', taxCategoryId: 'tax-food', isBestseller: true, spiceLevel: 3 },
    { id: 'item-6', categoryId: 'cat-breads', outletId: outlet.id, name: 'Garlic Naan', basePrice: 60, foodType: 'veg', taxCategoryId: 'tax-food' },
    { id: 'item-7', categoryId: 'cat-breads', outletId: outlet.id, name: 'Butter Naan', basePrice: 50, foodType: 'veg', taxCategoryId: 'tax-food' },
    { id: 'item-8', categoryId: 'cat-beverages', outletId: outlet.id, name: 'Lassi', basePrice: 80, foodType: 'veg', taxCategoryId: 'tax-bev' },
    { id: 'item-9', categoryId: 'cat-desserts', outletId: outlet.id, name: 'Gulab Jamun', basePrice: 90, foodType: 'veg', taxCategoryId: 'tax-food' },
  ];
  await db.insert(schema.menuItems).values(menuItemsData);

  // 7. Table Sections & Tables
  const sectionsData = [
    { id: 'sec-gf', outletId: outlet.id, name: 'Ground Floor', floorNumber: 0, displayOrder: 1 },
    { id: 'sec-ff', outletId: outlet.id, name: 'First Floor', floorNumber: 1, displayOrder: 2 },
    { id: 'sec-out', outletId: outlet.id, name: 'Outdoor', floorNumber: 0, displayOrder: 3 },
  ];
  await db.insert(schema.tableSections).values(sectionsData);

  const tablesData = [
    { id: 't1', sectionId: 'sec-gf', outletId: outlet.id, name: 'T1', capacity: 2, shape: 'square', positionX: 50, positionY: 50 },
    { id: 't2', sectionId: 'sec-gf', outletId: outlet.id, name: 'T2', capacity: 2, shape: 'square', positionX: 150, positionY: 50 },
    { id: 't3', sectionId: 'sec-gf', outletId: outlet.id, name: 'T3', capacity: 4, shape: 'rectangle', positionX: 50, positionY: 150 },
    { id: 't4', sectionId: 'sec-gf', outletId: outlet.id, name: 'T4', capacity: 4, shape: 'rectangle', positionX: 150, positionY: 150 },
    { id: 't5', sectionId: 'sec-gf', outletId: outlet.id, name: 'T5', capacity: 6, shape: 'circle', positionX: 300, positionY: 100 },
  ];
  await db.insert(schema.tables).values(tablesData);

  console.log('Database seeded successfully!');
}

seed().catch((e) => {
  console.error('Seeding failed:', e);
  process.exit(1);
});
