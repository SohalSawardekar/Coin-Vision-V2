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
		Analyze this currency note image for authenticity and potential counterfeiting. Act as an expert in currency security features and fraud detection.
		
		Please respond with a JSON object in exactly this format:
		{
			"authenticity_status": "Overall authenticity assessment (Authentic/Genuine, Suspicious/Questionable, Likely Counterfeit/Fake)",
			"confidence_score": "numerical confidence score from 0-100",
			"security_features": {
				"watermark": "Assessment of watermark presence and quality",
				"security_thread": "Assessment of security thread visibility and authenticity",
				"microprinting": "Assessment of microprinting quality and legibility",
				"color_changing_ink": "Assessment of color-shifting ink features",
				"raised_printing": "Assessment of raised/tactile printing quality",
				"uv_features": "Assessment of UV-reactive elements (if visible)"
			},
			"paper_quality": "Assessment of paper texture, thickness, and material",
			"printing_quality": "Assessment of overall print quality, sharpness, and color accuracy",
			"serial_number_analysis": "Analysis of serial number formatting, font, and positioning",
			"overall_assessment": "Summary of authenticity determination",
			"red_flags": [
				"List of specific suspicious elements or counterfeiting indicators"
			],
			"authentication_tips": [
				"List of specific security features to verify for this type of note"
			],
			"detailed_analysis": "Comprehensive technical analysis of the note's security features and any anomalies"
		}

		Analysis Guidelines:
		- Look for genuine security features like watermarks, security threads, microprinting
		- Assess print quality - genuine notes have high-quality, sharp printing
		- Check for proper paper texture and thickness
		- Examine color accuracy and ink quality
		- Look for alignment issues, blurred text, or poor registration
		- Check serial number fonts and positioning
		- Note any missing or poorly replicated security features
		- Consider overall craftsmanship and attention to detail

		Common counterfeit indicators:
		- Poor print quality or blurry text
		- Missing or fake security features
		- Wrong paper texture or thickness
		- Incorrect colors or color-changing effects
		- Misaligned elements
		- Poor quality watermarks or security threads
		- Irregular serial number fonts

		Provide specific, technical analysis based on visible features.
		Be cautious and thorough in your assessment.
		Use "Not clearly visible" for features that cannot be definitively assessed from the image.
		Rate confidence based on clarity of security features visible in the image.
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
				if (parsedData.confidence_score) {
					parsedData.confidence_score = Math.max(0, Math.min(100, Number(parsedData.confidence_score)));
				}

				// Ensure arrays are properly formatted
				if (parsedData.red_flags && !Array.isArray(parsedData.red_flags)) {
					parsedData.red_flags = [parsedData.red_flags];
				}
				if (parsedData.authentication_tips && !Array.isArray(parsedData.authentication_tips)) {
					parsedData.authentication_tips = [parsedData.authentication_tips];
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
			console.error('Error parsing authenticity response:', parseError);

			// Fallback: return structured response based on text analysis
			const fallbackData = {
				authenticity_status: extractAuthenticityFromText(outputText),
				confidence_score: extractConfidenceFromText(outputText),
				security_features: {
					watermark: "Not clearly analyzed",
					security_thread: "Not clearly analyzed",
					microprinting: "Not clearly analyzed",
					color_changing_ink: "Not clearly analyzed",
					raised_printing: "Not clearly analyzed",
					uv_features: "Not clearly analyzed"
				},
				paper_quality: "Analysis unavailable",
				printing_quality: "Analysis unavailable",
				serial_number_analysis: "Analysis unavailable",
				overall_assessment: extractOverallAssessment(outputText),
				red_flags: extractRedFlags(outputText),
				authentication_tips: [
					"Check for watermark visibility when held to light",
					"Verify security thread is embedded, not printed",
					"Examine microprinting with magnification",
					"Test for raised printing texture",
					"Check color-changing ink features"
				],
				detailed_analysis: outputText || "Detailed analysis could not be processed."
			};

			return NextResponse.json({
				success: true,
				data: fallbackData,
				rawResponse: outputText
			});
		}

	} catch (error: any) {
		console.error("Fake Detection API Error:", error);
		return NextResponse.json({
			error: "Failed to analyze note authenticity",
			details: error.message
		}, { status: 500 });
	}
}

// Helper functions for fallback parsing
function extractAuthenticityFromText(text: string): string {
	const lowerText = text.toLowerCase();
	if (lowerText.includes('authentic') || lowerText.includes('genuine') || lowerText.includes('real')) {
		return 'Appears Genuine';
	} else if (lowerText.includes('suspicious') || lowerText.includes('questionable') || lowerText.includes('uncertain')) {
		return 'Suspicious - Requires Further Verification';
	} else if (lowerText.includes('fake') || lowerText.includes('counterfeit') || lowerText.includes('fraudulent')) {
		return 'Likely Counterfeit';
	}
	return 'Requires Further Analysis';
}

function extractConfidenceFromText(text: string): number {
	const confidenceMatch = text.match(/(\d+)%?\s*(?:confidence|certain|sure)/i);
	if (confidenceMatch) {
		return Math.max(0, Math.min(100, parseInt(confidenceMatch[1])));
	}
	return 60; // Default moderate confidence
}

function extractOverallAssessment(text: string): string {
	// Extract first meaningful paragraph as overall assessment
	const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
	return sentences[0]?.trim() + '.' || 'Overall assessment could not be determined.';
}

function extractRedFlags(text: string): string[] {
	const redFlags: string[] = [];
	const lowerText = text.toLowerCase();

	if (lowerText.includes('blurry') || lowerText.includes('poor quality')) {
		redFlags.push('Poor print quality detected');
	}
	if (lowerText.includes('missing') && lowerText.includes('security')) {
		redFlags.push('Missing security features');
	}
	if (lowerText.includes('wrong color') || lowerText.includes('color issue')) {
		redFlags.push('Color accuracy concerns');
	}
	if (lowerText.includes('alignment') || lowerText.includes('misaligned')) {
		redFlags.push('Alignment issues detected');
	}

	return redFlags.length > 0 ? redFlags : ['No specific red flags identified in basic analysis'];
}