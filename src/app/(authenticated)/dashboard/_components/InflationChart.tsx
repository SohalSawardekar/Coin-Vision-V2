"use client";

import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
	CartesianGrid,
	Legend,
} from "recharts";
import React from "react";

type InflationDatum = {
	year: number;
	value: number;
};

export default function InflationChart({
	country,
	data,
	loading,
}: {
	country: string;
	data: InflationDatum[];
	loading: boolean;
}) {
	// Defensive: sort by year ascending for correct chart order
	const sorted = (data ?? []).slice().sort((a, b) => a.year - b.year);
	const latestValue = sorted.length > 0 ? sorted[sorted.length - 1].value : null;

	return (
		<div className="bg-white/5 p-4 border border-white/10 rounded-2xl">
			<div className="flex justify-between items-center mb-2">
				<h3 className="font-semibold">Inflation Trend (YoY)</h3>
				{loading && <span className="opacity-70 text-xs">Loading...</span>}
			</div>

			<div className="h-64">
				<ResponsiveContainer width="100%" height="100%">
					<BarChart
						data={sorted}
						margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
					>
						<CartesianGrid strokeDasharray="3 3" opacity={0.2} />
						<XAxis
							dataKey="year"
							tick={{ fontSize: 10 }}
							label={{ value: "Year", position: "insideBottom", offset: -5 }}
						/>
						<YAxis
							tick={{ fontSize: 10 }}
							label={{
								value: "Inflation (%)",
								angle: -90,
								position: "insideLeft",
							}}
						/>
						<Tooltip
							formatter={(v: number) => [`${v}%`, "Inflation"]}
							labelFormatter={(year: number) => `Year: ${year}`}
						/>
						<Legend />
						<Bar
							dataKey="value"
							fill="#3b82f6"
							name="Inflation"
							radius={[4, 4, 0, 0]}
						/>
					</BarChart>
				</ResponsiveContainer>
			</div>

			<div className="opacity-60 mt-2 text-xs">
				<span>Country/Currency: {country}</span>
				{latestValue !== null && (
					<span className="ml-2">| Latest: {latestValue}%</span>
				)}
			</div>
		</div>
	);
}
