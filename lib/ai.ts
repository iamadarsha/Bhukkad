import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

export const ai = new GoogleGenAI({ apiKey: apiKey! });

export async function getMenuIntelligence(prompt: string) {
  const model = ai.models.generateContent({
    model: "gemini-3.1-flash-lite-preview",
    contents: prompt,
  });
  const response = await model;
  return response.text;
}

export async function getChatResponse(message: string, history: any[] = []) {
  const chat = ai.chats.create({
    model: "gemini-3.1-pro-preview",
    config: {
      systemInstruction: "You are a helpful assistant for SpiceOS, a restaurant management system. You help staff with menu items, orders, and general restaurant operations.",
    },
  });

  // Convert history to parts if needed, but for simplicity we'll just send the message
  const response = await chat.sendMessage({ message });
  return response.text;
}
