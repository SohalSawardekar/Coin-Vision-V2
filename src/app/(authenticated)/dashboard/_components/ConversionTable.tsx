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
		<div className="bg-white/5 p-4 border border-white/10 rounded-2xl">
			<div className="flex justify-between items-center mb-2">
				<h3 className="font-semibold">Conversions</h3>
				<span className="opacity-60 text-xs">Base: {baseAmount} {baseCode}</span>
			</div>
			{!ratesLoaded ? (
				<div className="opacity-70 text-sm">Live rates loading…</div>
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