"use client";

import React from "react";
import { AlertCircle, Banknote, Shield } from "lucide-react";
import type { GeminiCurrency, PredictionResult } from "../page";

export default function RecognitionDetails({
	notNote,
	prediction,
	gemini,
}: {
	notNote: boolean;
	prediction: PredictionResult | null;
	gemini: GeminiCurrency | null;
}) {

	if (notNote) {
		return (
			<div className="bg-red-50 p-4 border border-red-200 rounded-2xl text-red-700">
				<div className="flex items-center gap-2 font-medium"><AlertCircle /> Not a currency note</div>
				<p className="opacity-80 mt-1 text-sm">Please upload a valid banknote image.</p>
			</div>
		);
	}

	if (!prediction) {
		return (
			<div className="bg-white/5 opacity-70 p-4 border border-white/10 rounded-2xl text-sm">
				Waiting for recognition...
			</div>
		);
	}

	if (prediction.status === "error") {
		return (
			<div className="bg-amber-50 p-4 border border-amber-200 rounded-2xl text-amber-800 text-sm">
				{prediction.prediction}
			</div>
		);
	}

	return (
		<div className="space-y-3 bg-white/5 p-4 border border-white/10 rounded-2xl">
			<div className="flex justify-between items-center">
				<div className="flex items-center gap-2 font-semibold">
					<Banknote /> Currency Identified
				</div>
				<span className="opacity-70 text-xs">Confidence: {typeof prediction.confidence === 'number' ? prediction.confidence.toFixed(1) : '--'}%</span>
			</div>
			<div className="font-semibold text-green-500 text-lg">{prediction.prediction}</div>

			{gemini && (
				<div className="gap-3 grid grid-cols-2 text-sm">
					{gemini.country && (
						<div>
							<div className="opacity-70">Country</div>
							<div className="font-medium">{gemini.country}</div>
						</div>
					)}
					{gemini.currency_code && (
						<div>
							<div className="opacity-70">Currency Code</div>
							<div className="font-medium">{gemini.currency_code}</div>
						</div>
					)}
					{gemini.denomination && (
						<div>
							<div className="opacity-70">Denomination</div>
							<div className="font-medium">{gemini.denomination}</div>
						</div>
					)}
					{gemini.year && (
						<div>
							<div className="opacity-70">Year</div>
							<div className="font-medium">{gemini.year}</div>
						</div>
					)}
					{Array.isArray(gemini.security_features) && gemini.security_features.length > 0 && (
						<div className="col-span-2">
							<div className="flex items-center gap-2 opacity-70 mb-1"><Shield size={16} /> Security Features</div>
							<ul className="space-y-0.5 list-disc list-inside">
								{gemini.security_features.map((s, i) => (
									<li key={i}>{s}</li>
								))}
							</ul>
						</div>
					)}
				</div>
			)}
		</div>
	);
}