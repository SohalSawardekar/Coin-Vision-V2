"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

export async function getGeminiCurrencyInfo(prediction: string) {
	// prediction e.g. "INR-500" → prompt Gemini for structured JSON
	const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);
	const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

	const prompt = `You are a currency expert. The detected banknote is: ${prediction}.
Return ONLY valid JSON with these fields (omit unknown fields):
{
  "denomination": string,
  "country": string,
  "currency_code": string,
  "year": string,
  "series": string,
  "security_features": string[],
  "dimensions": string,
  "color_scheme": string[],
  "material": string,
  "description": string,
  "historical_info": string
}`;

	const res = await model.generateContent(prompt);
	const text = res.response.text();

	try {
		// Attempt to extract JSON (in case model adds formatting)
		const jsonStr = text.trim().replace(/^```json\n?|```$/g, "");
		return JSON.parse(jsonStr);
	} catch {
		// Fallback minimal object
		return { description: text };
	}
}