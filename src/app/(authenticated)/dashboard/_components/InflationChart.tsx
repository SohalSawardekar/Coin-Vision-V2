/* eslint-disable @typescript-eslint/no-explicit-any */
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
	LineChart,
	Line,
} from "recharts";
import React from "react";

type InflationDatum = {
	year: number;
	value: number; // inflation %
};

type CurrencyValue = {
	year: number;
	curValue: number;
};

export default function InflationChart({
	country,
	data,
	todayValue,
	loading,
}: {
	country: string;
	data: InflationDatum[];
	todayValue: number;
	loading: boolean;
}) {
	// Defensive: sort by year ascending for charts
	const sorted = (data ?? []).slice().sort((a, b) => a.year - b.year);
	const latestValue = sorted.length > 0 ? sorted[sorted.length - 1].value : null;

	// Calculate currency value trend backward
	const CurrencyVal = (): CurrencyValue[] => {
		const desc = (data ?? []).slice().sort((a, b) => b.year - a.year);

		let curValue = todayValue;
		const trend: CurrencyValue[] = [];

		for (const d of desc) {
			trend.push({
				year: d.year,
				curValue: parseFloat(curValue.toFixed(2)),
			});

			// move backward (undo inflation for previous year)
			curValue = curValue / (1 + d.value / 100);
		}

		// reverse back to ascending order for charts
		return trend.reverse();
	};

	const currData = CurrencyVal();

	return (
		<div className="space-y-6 bg-white/5 p-4 border border-white/10 rounded-2xl">
			<div>
				<h3 className="mb-2 font-semibold">Inflation Trend (YoY)</h3>
				<div className="h-64">
					<ResponsiveContainer width="100%" height="100%">
						<BarChart
							data={sorted}
							margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
						>
							<CartesianGrid strokeDasharray="3 3" opacity={0.2} />
							<XAxis dataKey="year" tick={{ fontSize: 10 }} />
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
			</div>

			<div>
				<h3 className="mb-2 font-semibold">Currency Value Trend</h3>
				<div className="h-64">
					<ResponsiveContainer width="100%" height="100%">
						<LineChart
							data={currData}
							margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
						>
							<CartesianGrid strokeDasharray="3 3" opacity={0.2} />
							<XAxis dataKey="year" tick={{ fontSize: 10 }} />
							<YAxis
								tick={{ fontSize: 10 }}
								label={{
									value: "Value",
									angle: -90,
									position: "insideLeft",
								}}
							/>
							<Tooltip
								formatter={(v: number, name: string, props: any) => [
									`${v.toFixed(2)} (Year: ${props.payload.year})`,
									name,
								]}
								labelFormatter={(year: number) => `Year: ${year}`}
							/>

							<Legend />
							<Line
								type="monotone"
								dataKey="curValue"
								stroke="#10b981"
								name="Currency Value"
								dot={false}
								strokeWidth={2}
							/>
						</LineChart>
					</ResponsiveContainer>
				</div>
			</div>

			<div className="opacity-60 mt-2 text-xs">
				<span>Country/Currency: {country}</span>
				{latestValue !== null && (
					<span className="ml-2">| Latest Inflation: {latestValue}%</span>
				)}
				<span className="ml-2">| Today’s Value: ₹{todayValue}</span>
			</div>
		</div>
	);
}
