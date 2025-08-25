/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useMemo, useState } from "react";
import { Banknote, Camera, Loader2, RefreshCw, Shield } from "lucide-react";
import ImageUpload from "./_components/ImageUpload";
import RecognitionDetails from "./_components/RecognitionDetails";
import ConversionTable from "./_components/ConversionTable";
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


interface errorData {
	error: boolean,
	errorMessage?: string,
}

export default function Dashboard() {
	const [file, setFile] = useState<File | null>(null);
	const [loading, setLoading] = useState(false);
	const [prediction, setPrediction] = useState<PredictionResult | null>(null);
	const [gemini, setGemini] = useState<GeminiCurrency | null>(null);
	const [notNote, setNotNote] = useState(false);
	const [rates, setRates] = useState<Record<string, number>>({});
	const [_, setHist] = useState<Array<{ date: string; rate: number }>>([]);
	const [inflation, setInflation] = useState<Array<{ year: number; value: number }>>([]);
	const [loadingRates, setLoadingRates] = useState(false);
	const [predError, setPredError] = useState<errorData>({ error: false });
	const [geminiError, setGeminiError] = useState<errorData>({ error: false });
	const [conversionError, setConversionError] = useState<errorData>({ error: false });
	const [fredError, setFredError] = useState<errorData>({ error: false });

	const parsed = useMemo(() => (prediction ? PARSE_PREDICTION(prediction.prediction) : null), [prediction]);
	const baseCode = parsed?.code ?? "USD";
	const baseAmount = parsed ? Number(parsed.denom) : 1;

	const handleCurrencyRecognise = async (formData: FormData) => {
		try {
			// Step 2: model prediction
			const modelUrl = process.env.NEXT_PUBLIC_MODEL_URL;
			if (!modelUrl) throw new Error("Model URL is not set");
			const predRes = await fetch(`${modelUrl}/predict`, { method: "POST", body: formData });
			if (!predRes.ok) throw new Error("Prediction failed");
			const predJson: PredictionResult = await predRes.json();
			setPrediction(predJson);
			return predJson;
		} catch (error) {
			console.error("Error recognizing currency:", error);
			const errordata: PredictionResult = {
				status: "error",
				prediction: "Recognition failed. Try again.",
				confidence: 0,
			};
			setPredError({ error: true, errorMessage: "Recognition failed. Try again." });
			return errordata;
		}
	}

	const getGeminiData = async (predJson: PredictionResult) => {
		// Step 3: Gemini details
		try {
			if (predJson && typeof predJson === "object" && "prediction" in predJson && typeof predJson.prediction === "string") {
				const details = await getGeminiCurrencyInfo(predJson.prediction);
				setGemini(details);
			}
		} catch (error) {
			setGeminiError({ error: true, errorMessage: "Failed to fetch Gemini data" });
			console.error("Error fetching Gemini data:", error);
		}

	}

	const getConversionData = async (predJson: PredictionResult) => {
		try {
			const parsedPred = PARSE_PREDICTION(predJson.prediction);
			if (parsedPred) {
				//conversion
				setLoadingRates(true);
				const latest = await fetchExchangeRates(parsedPred.code);
				setRates(latest);
				const history = await fetchHistoricalRates(parsedPred.code, "USD", 90);
				setHist(history);
			}
		} catch (error) {
			setConversionError({ error: true, errorMessage: "Failed to fetch conversion data" });
			console.error("Error fetching conversion data:", error);
		}
	}

	const getFredData = async (predJson: PredictionResult) => {
		// Step 4: FX latest + history + inflation
		try {
			const parsedPred = PARSE_PREDICTION(predJson.prediction);
			if (parsedPred) {
				// Inflation
				const fredSeries = FRED_SERIES[parsedPred.code] || FRED_SERIES["USD"];
				const res = await fetch(`/api/fred?series_id=FPCPITOTLZGUSA`);
				const data = await res.json();
				setInflation(transformFredData(data.observations));
			}
		} catch (error) {
			console.error("Error fetching FRED data:", error);
			setFredError({ error: true, errorMessage: "Failed to fetch FRED data" });
		}

	}

	const handleRecognize = async () => {
		if (!file) return;
		const formData = new FormData();
		formData.append("file", file);

		setPredError({ error: false });
		setGeminiError({ error: false });
		setConversionError({ error: false });
		setFredError({ error: false });
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

			const predJson = await handleCurrencyRecognise(formData);
			await getGeminiData(predJson);
			await getConversionData(predJson);
			await getFredData(predJson);

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
					className="hidden sm:inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg text-black text-sm"
				>
					<RefreshCw size={16} /> Refresh
				</button>
			</div>

			<div className="gap-6 grid grid-cols-1 lg:grid-cols-2">
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

					{predError.error || geminiError.error ? (
						<div className="flex flex-col justify-center items-center bg-red-500/10 p-6 border border-red-500/20 rounded-2xl h-full text-red-400 text-center">

							{/* Icon */}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="mb-3 w-10 h-10 text-red-400"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								strokeWidth={2}
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M12 9v3.75m0 3.75h.007M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>

							{/* Title */}
							<div className="font-semibold text-lg">Something went wrong</div>

							{/* Message */}
							<p className="opacity-80 mt-2 text-sm">
								{fredError.errorMessage || "We couldn’t fetch the data. Please try again later."}
							</p>
						</div>
					) : (
						loading ? (
							<div className="space-y-3 bg-white/5 p-4 border border-white/10 rounded-2xl animate-pulse">
								{/* Header */}
								<div className="flex justify-between items-center">
									<div className="flex items-center gap-2 font-semibold">
										<Banknote className="text-white/40" />
										<div className="bg-white/20 rounded w-28 h-4"></div>
									</div>
									<div className="bg-white/20 rounded w-16 h-3"></div>
								</div>

								{/* Prediction text */}
								<div className="bg-green-500/40 rounded w-32 h-6"></div>

								{/* Gemini details */}
								<div className="gap-3 grid grid-cols-2 text-sm">
									<div>
										<div className="bg-white/10 mb-1 rounded w-20 h-3"></div>
										<div className="bg-white/30 rounded w-16 h-4"></div>
									</div>
									<div>
										<div className="bg-white/10 mb-1 rounded w-24 h-3"></div>
										<div className="bg-white/30 rounded w-14 h-4"></div>
									</div>
									<div>
										<div className="bg-white/10 mb-1 rounded w-28 h-3"></div>
										<div className="bg-white/30 rounded w-12 h-4"></div>
									</div>
									<div>
										<div className="bg-white/10 mb-1 rounded w-20 h-3"></div>
										<div className="bg-white/30 rounded w-10 h-4"></div>
									</div>

									{/* Security Features */}
									<div className="col-span-2">
										<div className="flex items-center gap-2 mb-2">
											<Shield size={16} className="text-white/40" />
											<div className="bg-white/20 rounded w-28 h-3"></div>
										</div>
										<div className="space-y-1">
											<div className="bg-white/20 rounded w-40 h-3"></div>
											<div className="bg-white/20 rounded w-32 h-3"></div>
											<div className="bg-white/20 rounded w-24 h-3"></div>
										</div>
									</div>
								</div>
							</div>
						) : (
							< RecognitionDetails
								notNote={notNote}
								prediction={prediction}
								gemini={gemini}
							/>
						)
					)}
				</div>

				{/* Right column: conversions + charts */}
				<div className="flex flex-col space-y-6">
					{conversionError.error ? (
						<div className="flex flex-col justify-center items-center bg-red-500/10 p-6 border border-red-500/20 rounded-2xl h-full text-red-400 text-center">

							{/* Icon */}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="mb-3 w-10 h-10 text-red-400"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								strokeWidth={2}
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M12 9v3.75m0 3.75h.007M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>

							{/* Title */}
							<div className="font-semibold text-lg">Something went wrong</div>

							{/* Message */}
							<p className="opacity-80 mt-2 text-sm">
								{fredError.errorMessage || "We couldn’t fetch the data. Please try again later."}
							</p>
						</div>
					) : (
						loading ? (
							<div className="bg-white/5 p-4 border border-white/10 rounded-2xl">
								<div className="flex justify-between items-center mb-2">
									<div className="bg-white/20 rounded w-28 h-5 animate-pulse"></div>
									<div className="bg-white/10 rounded w-20 h-3 animate-pulse"></div>
								</div>

								<div className="gap-3 grid grid-cols-2 md:grid-cols-3">
									{Array.from({ length: 6 }).map((_, i) => (
										<div
											key={i}
											className="flex flex-col gap-2 bg-white/5 p-3 border border-white/10 rounded-lg animate-pulse"
										>
											<div className="bg-white/20 rounded w-10 h-3"></div>
											<div className="bg-white/30 rounded w-16 h-5"></div>
										</div>
									))}
								</div>
							</div>
						) : (
							<ConversionTable
								baseCode={baseCode}
								baseAmount={baseAmount}
								targets={conversions}
								ratesLoaded={Object.keys(rates).length > 0}
							/>
						)
					)}

					<div className="gap-6 grid grid-cols-1 h-full">
						{fredError.error ? (
							<div className="flex flex-col justify-center items-center bg-red-500/10 p-6 border border-red-500/20 rounded-2xl h-full text-red-400 text-center">

								{/* Icon */}
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="mb-3 w-10 h-10 text-red-400"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									strokeWidth={2}
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M12 9v3.75m0 3.75h.007M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>

								{/* Title */}
								<div className="font-semibold text-lg">Something went wrong</div>

								{/* Message */}
								<p className="opacity-80 mt-2 text-sm">
									{fredError.errorMessage || "We couldn’t fetch the data. Please try again later."}
								</p>
							</div>
						) : (
							loading ? (
								<div className="bg-white/5 p-4 border border-white/10 rounded-2xl animate-pulse">
									<div className="flex justify-between items-center mb-2">
										<div className="bg-white/20 rounded w-40 h-4" />
										<div className="bg-white/20 rounded w-16 h-3" />
									</div>

									{/* Fake chart skeleton */}
									<div className="flex items-end gap-2 h-64">
										{Array.from({ length: 8 }).map((_, i) => (
											<div
												key={i}
												className="flex-1 bg-white/20 rounded"
												style={{ height: `${20 + (i % 4) * 15}%` }}
											/>
										))}
									</div>

									<div className="flex gap-2 opacity-60 mt-2 text-xs">
										<div className="bg-white/20 rounded w-32 h-3" />
										<div className="bg-white/20 rounded w-20 h-3" />
									</div>
								</div>
							) : (
								< InflationChart
									todayValue={baseAmount}
									country={gemini?.country ?? baseCode}
									data={inflation}
									loading={loadingRates}
								/>
							)
						)}
					</div>
				</div>
			</div>
		</div>
	);
}