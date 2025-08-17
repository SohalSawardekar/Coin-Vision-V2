import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
	try {
		// Parse multipart/form-data
		const formData = await req.formData();
		const file = formData.get("file") as File | null;

		if (!file) {
			return NextResponse.json({ error: "No file provided" }, { status: 400 });
		}

		// Read file as ArrayBuffer → Base64
		const bytes = await file.arrayBuffer();
		const buffer = Buffer.from(bytes);
		const base64 = buffer.toString("base64");

		const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");
		const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

		const prompt = `
		Analyze this currency note image in detail and provide a comprehensive condition assessment. 
		
		Please respond with a JSON object in exactly this format:
		{
			"overall_condition": "Overall condition description (e.g., Excellent, Very Fine, Fine, Fair, Poor)",
			"condition_score": "numerical score from 0-100",
			"physical_damage": {
				"tears": "Description of any tears or rips",
				"holes": "Description of any holes or punctures",
				"creases": "Description of fold marks and creases",
				"stains": "Description of any stains or discoloration",
				"fading": "Description of color fading or ink issues"
			},
			"structural_integrity": "Assessment of the note's structural soundness",
			"collectible_value": "Assessment of collectible/numismatic value",
			"marketability": "Assessment of market value and sellability",
			"preservation_tips": [
				"List of specific preservation recommendations"
			],
			"detailed_assessment": "Comprehensive paragraph describing the overall condition, key observations, and condition factors"
		}

		Grading scale reference:
		- Uncirculated/Mint (90-100): No signs of wear, crisp and clean
		- Extremely Fine (80-89): Very light wear, sharp corners
		- Very Fine (60-79): Light wear, some softening of corners
		- Fine (40-59): Moderate wear, visible circulation
		- Fair (20-39): Heavy wear but complete
		- Poor (0-19): Heavily damaged, torn, or incomplete

		Analyze the image carefully for:
		- Physical damage (tears, holes, stains, writing)
		- Wear patterns and circulation damage
		- Color retention and fading
		- Paper quality and texture
		- Edge condition and corner sharpness
		- Overall aesthetic appeal

		Provide practical preservation advice and realistic value assessment.
		Use "None" or "Minimal" for categories with no significant issues.
		Be specific and detailed in your analysis.
		`;

		const result = await model.generateContent([
			{ text: prompt },
			{
				inlineData: {
					mimeType: file.type || "image/jpeg",
					data: base64,
				},
			},
		]);

		const outputText = result.response.text();

		// Try to parse JSON response
		let parsedData;
		try {
			// Extract JSON from the response
			const jsonMatch = outputText.match(/\{[\s\S]*\}/);
			if (jsonMatch) {
				parsedData = JSON.parse(jsonMatch[0]);

				// Validate and sanitize the data
				if (parsedData.condition_score) {
					parsedData.condition_score = Math.max(0, Math.min(100, Number(parsedData.condition_score)));
				}

				// Ensure preservation_tips is an array
				if (parsedData.preservation_tips && !Array.isArray(parsedData.preservation_tips)) {
					parsedData.preservation_tips = [parsedData.preservation_tips];
				}

				return NextResponse.json({
					success: true,
					data: parsedData,
					rawResponse: outputText
				});
			} else {
				throw new Error('No valid JSON found in response');
			}
		} catch (parseError) {
			console.error('Error parsing detailed response:', parseError);

			// Fallback: return structured response based on text analysis
			const fallbackData = {
				overall_condition: extractConditionFromText(outputText),
				condition_score: extractScoreFromText(outputText),
				physical_damage: {
					tears: "Analysis unavailable",
					holes: "Analysis unavailable",
					creases: "Analysis unavailable",
					stains: "Analysis unavailable",
					fading: "Analysis unavailable"
				},
				structural_integrity: "Analysis unavailable",
				collectible_value: "Analysis unavailable",
				marketability: "Analysis unavailable",
				preservation_tips: ["Keep in a dry, cool environment", "Handle minimally", "Store flat between acid-free materials"],
				detailed_assessment: outputText || "Detailed analysis could not be processed."
			};

			return NextResponse.json({
				success: true,
				data: fallbackData,
				rawResponse: outputText
			});
		}

	} catch (error: any) {
		console.error("Detailed API Error:", error);
		return NextResponse.json({
			error: "Failed to analyze note condition",
			details: error.message
		}, { status: 500 });
	}
}

// Helper functions for fallback parsing
function extractConditionFromText(text: string): string {
	const conditions = ['Uncirculated', 'Extremely Fine', 'Very Fine', 'Fine', 'Fair', 'Poor'];
	for (const condition of conditions) {
		if (text.toLowerCase().includes(condition.toLowerCase())) {
			return condition;
		}
	}
	return 'Fair'; // Default
}

function extractScoreFromText(text: string): number {
	const scoreMatch = text.match(/(\d+)(?:\/100|\s*(?:out of|score|rating))/i);
	if (scoreMatch) {
		return Math.max(0, Math.min(100, parseInt(scoreMatch[1])));
	}
	return 50; // Default middle score
}