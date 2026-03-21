// Demo AI responses — no API key required

const menuSuggestions = [
  "Try pairing with a cool Lassi (₹80) to balance the spices, and end on a sweet note with Gulab Jamun (₹90). Garlic Naan (₹60) goes great with any curry!",
  "A refreshing Lassi (₹80) would complement this order perfectly. Consider adding Gulab Jamun (₹90) for dessert, and Butter Naan (₹50) to scoop up every last bit.",
  "Dal Makhani (₹240) pairs beautifully with Garlic Naan (₹60) — a classic combo. Round it off with a chilled Lassi (₹80)!",
  "Chicken Biryani (₹350) with a side of Lassi (₹80) is an unbeatable pairing. Add Gulab Jamun (₹90) to finish on a high note.",
  "Don't miss out on Paneer Tikka (₹220) as a starter. Butter Naan (₹50) and a sweet Gulab Jamun (₹90) would complete this meal perfectly.",
];

const chatResponses: Record<string, string> = {
  default: "I'm your SpiceOS assistant! I can help with menu info, order management, table status, and general restaurant operations. What do you need?",
  menu: "Our menu includes Starters (Paneer Tikka ₹220, Chicken Tikka ₹280), Main Course (Butter Chicken ₹320, Dal Makhani ₹240, Chicken Biryani ₹350), Breads (Garlic Naan ₹60, Butter Naan ₹50), Beverages (Lassi ₹80), and Desserts (Gulab Jamun ₹90).",
  order: "To place an order: go to POS, select a table or choose Takeaway/Delivery, add items from the menu grid, then hit 'Place Order'. You can apply discounts or split bills before payment.",
  table: "There are 5 tables on the Ground Floor (T1–T5) with capacities from 2 to 6 seats. You can view the floor plan and manage table status from the Tables page.",
  payment: "We accept Cash, Card, and UPI payments. You can also split bills between multiple customers. The payment modal opens after placing the order.",
  kitchen: "Kitchen orders appear on the Kitchen Display System (KDS) in real-time. Each ticket shows items, modifiers, and elapsed time. Mark items as ready when done.",
  help: "Here's what I can help with:\n• Menu items & prices\n• How to place an order\n• Table management\n• Payment methods\n• Kitchen workflow\n\nJust ask!",
};

function getDemoChat(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("menu") || lower.includes("item") || lower.includes("price") || lower.includes("food")) return chatResponses.menu;
  if (lower.includes("order") || lower.includes("place") || lower.includes("add")) return chatResponses.order;
  if (lower.includes("table") || lower.includes("seat") || lower.includes("floor")) return chatResponses.table;
  if (lower.includes("pay") || lower.includes("cash") || lower.includes("card") || lower.includes("upi") || lower.includes("split")) return chatResponses.payment;
  if (lower.includes("kitchen") || lower.includes("kot") || lower.includes("cook")) return chatResponses.kitchen;
  if (lower.includes("help") || lower.includes("what can") || lower.includes("how")) return chatResponses.help;
  return chatResponses.default;
}

export async function getMenuIntelligence(prompt: string): Promise<string> {
  await new Promise(r => setTimeout(r, 600)); // simulate network delay
  return menuSuggestions[Math.floor(Math.random() * menuSuggestions.length)];
}

export async function getChatResponse(message: string, history: any[] = []): Promise<string> {
  await new Promise(r => setTimeout(r, 400));
  return getDemoChat(message);
}
