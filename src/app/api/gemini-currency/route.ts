import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Make sure to add your Gemini API key to your environment variables
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
	try {
		const { prompt, currency } = await request.json();

		if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
			return NextResponse.json(
				{ error: 'Gemini API key not configured' },
				{ status: 500 }
			);
		}

		// Initialize the model
		const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

		// Generate content
		const result = await model.generateContent(prompt);
		const response = await result.response;
		const text = response.text();

		// Try to parse the JSON response
		let parsedData;
		try {
			// Clean the response text to extract JSON
			const jsonMatch = text.match(/\{[\s\S]*\}/);
			if (jsonMatch) {
				parsedData = JSON.parse(jsonMatch[0]);
			} else {
				throw new Error('No JSON found in response');
			}
		} catch (parseError) {
			console.error('Error parsing Gemini response:', parseError);
			// Return a fallback response
			parsedData = {
				denomination: "Not available",
				country: "Not available",
				currency_code: currency?.substring(0, 3).toUpperCase() || "Not available",
				year: "Not available",
				series: "Not available",
				security_features: ["Information not available from AI"],
				dimensions: "Not available",
				color_scheme: ["Not available"],
				material: "Not available",
				description: text || "Detailed information could not be parsed.",
				historical_info: "Not available",
				exchange_rate: "Not available"
			};
		}

		return NextResponse.json({
			success: true,
			data: parsedData,
			rawResponse: text
		});

	} catch (error) {
		console.error('Gemini API Error:', error);
		return NextResponse.json(
			{
				error: 'Failed to get currency information',
				details: error instanceof Error ? error.message : 'Unknown error'
			},
			{ status: 500 }
		);
	}
}