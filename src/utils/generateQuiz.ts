import { GoogleGenerativeAI } from "@google/generative-ai";

export type QuizQuestion = {
	question: string;
	options: string[];
	answer: string;
};

export async function generateQuiz(): Promise<QuizQuestion[]> {
	const ai = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");

	const model = ai.getGenerativeModel({ model: "gemini-2.0-flash" });

	const prompt = `Generate 5 multiple-choice questions about world currencies. 
Each question should have:
- a "question" field (string),
- an "options" field (array of 4 strings),
- an "answer" field (the correct option from the options array).
Return the result as a valid JSON array. Do not include any extra explanation or text before or after the array. Format:
[
  {
    "question": "Which country uses the Yen?",
    "options": ["China", "Japan", "Thailand", "Vietnam"],
    "answer": "Japan"
  },
  ...
]`;

	const result = await model.generateContent(prompt);

	// Get text output
	const text = result.response.text();

	// Extract JSON safely
	const jsonStart = text.indexOf("[");
	const jsonEnd = text.lastIndexOf("]");
	const jsonText = text.substring(jsonStart, jsonEnd + 1);

	try {
		return JSON.parse(jsonText) as QuizQuestion[];
	} catch (error) {
		console.error("Error parsing quiz response:", error, "\nRaw text:", text);
		throw new Error("Invalid quiz format returned from Gemini");
	}
}
