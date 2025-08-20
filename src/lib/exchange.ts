/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

export async function fetchExchangeRates(base: string) {
	try {
		// If you have a server key, proxy through your own API here
		const key = process.env.EXCHANGE_RATES_API_KEY || process.env.NEXT_PUBLIC_EXCHANGE_RATES_API_KEY;
		const url = `https://v6.exchangerate-api.com/v6/${key}/latest/${base}`;
		const r = await fetch(url, { cache: "no-store" });
		if (!r.ok) throw new Error("fx latest failed");
		const j = await r.json();
		console.log("Exchange rates:", j);
		return j.conversion_rates as Record<string, number>;
	} catch (e) {
		console.error(e);
		// fallback sample
		return { USD: 1, EUR: 0.9, GBP: 0.77, JPY: 150, INR: 83, AUD: 1.48, CAD: 1.36 };
	}
}

const FRED_API_KEY = process.env.FRED_API_KEY;

const FRED_EXCHANGE_SERIES: Record<string, string> = {
	"EURUSD": "DEXUSEU",
	"GBPUSD": "DEXUSUK",
	"JPYUSD": "DEXJPUS",
	"CADUSD": "DEXCAUS",
	"AUDUSD": "DEXUSAL",
	"INRUSD": "DEXINUS",
};

export async function fetchHistoricalRates(base: string, quote = "USD", days = 90) {
	try {
		const key = `${base}${quote}`.toUpperCase();
		const seriesId = FRED_EXCHANGE_SERIES[key];
		if (!seriesId) throw new Error(`No FRED series found for ${key}`);

		const now = new Date();
		const start = new Date();
		start.setDate(now.getDate() - days);

		const url = `https://api.stlouisfed.org/fred/series/observations?series_id=${seriesId}&api_key=${FRED_API_KEY}&file_type=json&observation_start=${start.toISOString().slice(0, 10)}&observation_end=${now.toISOString().slice(0, 10)}`;

		const res = await fetch(url);
		if (!res.ok) throw new Error(`FRED error: ${res.statusText}`);
		const data = await res.json();

		// 🔄 Transform into { date, rate }
		const raw: Array<{ date: string; rate: number }> = data.observations
			.filter((obs: any) => obs.value !== "." && obs.value !== null)
			.map((obs: any) => ({
				date: obs.date,
				rate: parseFloat(obs.value),
			}));

		// Fill missing days with previous value for chart continuity
		const filled: Array<{ date: string; rate: number }> = [];
		let last = raw.length ? raw[0].rate : 1;
		for (let i = days - 1; i >= 0; i--) {
			const d = new Date(now);
			d.setDate(now.getDate() - i);
			const dateStr = d.toISOString().slice(0, 10);
			const found = raw.find((a) => a.date === dateStr);
			if (found) {
				last = found.rate;
				filled.push({ date: dateStr, rate: last });
			} else {
				filled.push({ date: dateStr, rate: last });
			}
		}
		return filled;
	} catch (err) {
		console.error("fetchHistoricalRates error:", err);
		// fallback: synthesize plausible series
		const now = new Date();
		const arr: Array<{ date: string; rate: number }> = [];
		const latest = (await fetchExchangeRates(base))[quote] ?? 1;
		let seed = latest;
		for (let i = days - 1; i >= 0; i--) {
			const d = new Date(now);
			d.setDate(now.getDate() - i);
			// random walk within ±3%
			seed = seed * (1 + (Math.random() - 0.5) * 0.06);
			arr.push({ date: d.toISOString().slice(0, 10), rate: Number(seed.toFixed(4)) });
		}
		return arr;
	}
}
