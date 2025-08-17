import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
	try {
		const formData = await req.formData();
		const file = formData.get("file") as File;

		if (!file) {
			return NextResponse.json({ error: "No image uploaded" }, { status: 400 });
		}

		const arrayBuffer = await file.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);
		const base64Image = buffer.toString("base64");

		const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);
		const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

		const result = await model.generateContent({
			contents: [
				{
					role: "user",
					parts: [
						{ text: "Is this image a currency? Just return one of 2 options: True/False." },
						{
							inlineData: {
								mimeType: file.type,
								data: base64Image,
							},
						},
					],
				},
			],
		});

		const response = await result.response;
		const text = response.text();

		return NextResponse.json({ result: text }, { status: 200 });

	} catch (err) {
		console.error("Error processing image:", err);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
