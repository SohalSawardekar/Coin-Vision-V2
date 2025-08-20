"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Banknote, Camera, Loader2, RefreshCw } from "lucide-react";
import ImageUpload from "./_components/ImageUpload";
import RecognitionDetails from "./_components/RecognitionDetails";
import ConversionTable from "./_components/ConversionTable";
import ExchangeRateChart from "./_components/ExchangeRateChart";
import InflationChart from "./_components/InflationChart";
import { fetchExchangeRates, fetchHistoricalRates } from "@/lib/exchange";
import { getGeminiCurrencyInfo } from "@/lib/gemini";

export type PredictionResult = {
	status: "success" | "error";
	prediction: string; // e.g., "INR-500"
	confidence: number; // 0-100
};

export type GeminiCurrency = {
	denomination?: string;
	country?: string;
	currency_code?: string;
	year?: string;
	series?: string;
	security_features?: string[];
	dimensions?: string;
	color_scheme?: string[];
	material?: string;
	description?: string;
	historical_info?: string;
};

const PARSE_PREDICTION = (prediction: string) => {
	if (!prediction) return null;
	const [code, denom] = prediction.split("-");
	return code && denom ? { code, denom } : null;
};

const TARGETS = ["USD", "EUR", "GBP", "JPY", "INR", "AUD", "CAD"]; // show conversions against these

// Map currency code to FRED inflation series
const FRED_SERIES: Record<string, string> = {
	USD: "FPCPITOTLZGUSA",
	INR: "FPCPITOTLZGIN",
	EUR: "FPCPITOTLZGEA",
	GBP: "FPCPITOTLZGGBA",
	JPY: "FPCPITOTLZGJPA",
	AUD: "FPCPITOTLZGAUA",
	CAD: "FPCPITOTLZGCAN",
};

// helper: convert FRED observations → {year, value}
const transformFredData = (obs: Array<{ date: string; value: string }>) =>
	obs
		.filter((d) => d.value !== "." && !isNaN(Number(d.value)))
		.map((d) => ({
			year: new Date(d.date).getFullYear(),
			value: parseFloat(d.value),
		}));

export default function Dashboard() {
	const [file, setFile] = useState<File | null>(null);
	const [loading, setLoading] = useState(false);
	const [prediction, setPrediction] = useState<PredictionResult | null>(null);
	const [gemini, setGemini] = useState<GeminiCurrency | null>(null);
	const [notNote, setNotNote] = useState(false);
	const [rates, setRates] = useState<Record<string, number>>({});
	const [hist, setHist] = useState<Array<{ date: string; rate: number }>>([]);
	const [inflation, setInflation] = useState<Array<{ year: number; value: number }>>([]);
	const [loadingRates, setLoadingRates] = useState(false);

	const parsed = useMemo(() => (prediction ? PARSE_PREDICTION(prediction.prediction) : null), [prediction]);
	const baseCode = parsed?.code ?? "USD";
	const baseAmount = parsed ? Number(parsed.denom) : 1;

	const handleRecognize = async () => {
		if (!file) return;
		const formData = new FormData();
		formData.append("file", file);

		setLoading(true);
		setNotNote(false);
		setPrediction(null);
		setGemini(null);
		setRates({});
		setHist([]);
		setInflation([]);

		try {
			// Step 1: verify image is a note
			const verify = await fetch("/api/recognise", { method: "POST", body: formData });
			const verifyData = await verify.json();
			if (verifyData?.result !== "True") {
				setNotNote(true);
				setPrediction({ status: "error", prediction: "Not a currency note", confidence: 0 });
				return;
			}

			// Step 2: model prediction
			const modelUrl = process.env.NEXT_PUBLIC_MODEL_URL;
			if (!modelUrl) throw new Error("Model URL is not set");
			const predRes = await fetch(`${modelUrl}/predict`, { method: "POST", body: formData });
			if (!predRes.ok) throw new Error("Prediction failed");
			const predJson: PredictionResult = await predRes.json();
			setPrediction(predJson);

			// Step 3: Gemini details
			const details = await getGeminiCurrencyInfo(predJson.prediction);
			setGemini(details);

			// Step 4: FX latest + history + inflation
			const parsedPred = PARSE_PREDICTION(predJson.prediction);
			if (parsedPred) {
				setLoadingRates(true);
				const latest = await fetchExchangeRates(parsedPred.code);
				setRates(latest);
				const history = await fetchHistoricalRates(parsedPred.code, "USD", 90);
				setHist(history);
				// Inflation
				const fredSeries = FRED_SERIES[parsedPred.code] || FRED_SERIES["USD"];
				const res = await fetch(`/api/fred?series_id=${fredSeries}`);
				const data = await res.json();
				setInflation(transformFredData(data.observations));
			}
		} catch (e) {
			console.error(e);
			setPrediction({ status: "error", prediction: "Recognition failed. Try again.", confidence: 0 });
		} finally {
			setLoading(false);
			setLoadingRates(false);
		}
	};

	const conversions = useMemo(() => {
		if (!rates || !parsed) return [] as Array<{ code: string; amount: number }>;
		return TARGETS.filter((c) => c !== parsed.code).map((code) => ({
			code,
			amount: (rates[code] ?? 0) * baseAmount,
		}));
	}, [rates, parsed, baseAmount]);

	return (
		<div className="space-y-6 px-6 py-6 text-white">
			<div className="flex justify-between items-center">
				<h1 className="font-semibold text-2xl">AI Currency Dashboard</h1>
				<button
					onClick={() => window.location.reload()}
					className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg text-black text-sm"
				>
					<RefreshCw size={16} /> Refresh
				</button>
			</div>

			<div className="gap-6 grid grid-cols-1 xl:grid-cols-2">
				{/* Left column: upload + details */}
				<div className="space-y-6">
					<div className="bg-white/5 backdrop-blur p-4 border border-white/10 rounded-2xl">
						<div className="flex justify-between items-center mb-3">
							<h2 className="font-semibold">Upload & Recognize</h2>
							{loading && <Loader2 className="animate-spin" />}
						</div>
						<ImageUpload file={file} setFile={setFile} />
						<div className="mt-4">
							<button
								onClick={handleRecognize}
								disabled={!file || loading}
								className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 px-4 py-2 rounded-lg text-white"
							>
								{loading ? <Loader2 className="animate-spin" size={16} /> : <Camera size={16} />} Recognize
							</button>
						</div>
					</div>

					<RecognitionDetails
						notNote={notNote}
						prediction={prediction}
						gemini={gemini}
					/>
				</div>

				{/* Right column: conversions + charts */}
				<div className="space-y-6">
					<ConversionTable
						baseCode={baseCode}
						baseAmount={baseAmount}
						targets={conversions}
						ratesLoaded={Object.keys(rates).length > 0}
					/>

					<div className="gap-6 grid grid-cols-1">
						{/* <ExchangeRateChart
							baseCode={baseCode}
							series={hist}
							loading={loadingRates}
						/> */}
						<InflationChart
							country={gemini?.country ?? baseCode}
							data={inflation}
							loading={loadingRates}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}