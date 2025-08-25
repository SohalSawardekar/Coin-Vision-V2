"use client";

import React from "react";

export default function ConversionTable({
	baseCode,
	baseAmount,
	targets,
	ratesLoaded,
}: {
	baseCode: string;
	baseAmount: number;
	targets: Array<{ code: string; amount: number }>;
	ratesLoaded: boolean;
}) {
	return (
		<div className="bg-white/5 p-6 border border-white/10 rounded-2xl">
			<div className="flex justify-between items-center mb-2">
				<h3 className="font-semibold">Conversions</h3>
				<span className="opacity-60 text-xs">Base: {baseAmount} {baseCode}</span>
			</div>
			{!ratesLoaded ? (
				<div className="flex justify-center items-center gap-3 bg-blue-500/10 p-4 border border-blue-500/20 rounded-2xl w-full text-blue-400 text-sm">
					{/* Hourglass Icon */}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="w-5 h-5 text-blue-400"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						strokeWidth={2}
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M8 7h8M8 17h8M6 4h12v2a6 6 0 01-6 6 6 6 0 01-6-6V4zM6 20h12v-2a6 6 0 00-6-6 6 6 0 00-6 6v2z"
						/>
					</svg>

					{/* Message */}
					<span className="font-medium">Waiting for recognition...</span>
				</div>
			) : (
				<div className="gap-3 grid grid-cols-2 md:grid-cols-3">
					{targets.map((t) => (
						<div key={t.code} className="bg-white/5 p-3 border border-white/10 rounded-lg">
							<div className="opacity-60 text-xs">{t.code}</div>
							<div className="font-semibold text-lg">{t.amount.toFixed(2)}</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}