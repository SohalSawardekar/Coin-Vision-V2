/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";

export async function GET(req: Request) {
	const { searchParams } = new URL(req.url);
	const series_id = searchParams.get("series_id") ?? "FPCPITOTLZGUSA"; // Default US inflation series

	const apiKey = process.env.FRED_API_KEY;
	const url = `https://api.stlouisfed.org/fred/series/observations?series_id=${series_id}&api_key=${apiKey}&file_type=json`;
	try {
		const res = await fetch(url);
		if (!res.ok) throw new Error(`FRED error: ${res.status}`);
		const data = await res.json();
		return NextResponse.json(data);
	} catch (err: any) {
		return NextResponse.json({ error: err.message }, { status: 500 });
	}
}
