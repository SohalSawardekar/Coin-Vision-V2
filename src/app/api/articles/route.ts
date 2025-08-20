/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";

export async function GET() {
	try {
		const query = "currency OR forex OR rupee OR dollar OR euro OR yen OR pound";
		const res = await fetch(
			`https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=en&max=10&apikey=${process.env.GNEWS_API_KEY}`
		);

		if (!res.ok) {
			return NextResponse.json(
				{ error: "Failed to fetch news" },
				{ status: res.status }
			);
		}

		const data = await res.json();

		// Normalize for frontend
		const articles = data.articles.map((item: any, index: number) => ({
			id: index,
			title: item.title,
			author: item.source?.name || "Unknown",
			createdAt: item.publishedAt,
			content: item.description || "",
			url: item.url,
		}));

		return NextResponse.json(articles);
	} catch (error) {
		console.error("News API error:", error);
		return NextResponse.json(
			{ error: "Failed to fetch news" },
			{ status: 500 }
		);
	}
}
