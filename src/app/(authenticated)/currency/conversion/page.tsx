'use client'

import React, { useState, useEffect } from 'react'
import {
	AreaChart,
	Area,
	CartesianGrid,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
} from 'recharts'
import { Button } from '@/components/ui/button'
import { AlertCircleIcon, ImageIcon, UploadIcon, XIcon } from 'lucide-react'
import { useFileUpload } from '@/hooks/use-file-upload'

export default function CurrencyConversion() {
	const [loading, setLoading] = useState(false)
	const [data, setData] = useState<any>(null)

	// Conversion
	const currencyList = [
		'USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'INR',
		'NZD', 'SEK', 'SGD', 'ZAR', 'HKD', 'NOK', 'KRW', 'MXN', 'BRL'
	]
	const [from, setFrom] = useState<string>('USD')
	const [to, setTo] = useState<string>('EUR')
	const [amount, setAmount] = useState<number>(0)
	const [result, setResult] = useState<number | null>(null)
	const [chartData, setChartData] = useState<any[]>([])
	const [timeRange, setTimeRange] = useState('1M')

	// Helpers for chart date range
	const getDateRange = (range: string) => {
		const end = new Date()
		const start = new Date()
		if (range === '1M') start.setMonth(end.getMonth() - 1)
		if (range === '5M') start.setMonth(end.getMonth() - 5)
		if (range === '1Y') start.setFullYear(end.getFullYear() - 1)

		return {
			start: start.toISOString().split('T')[0],
			end: end.toISOString().split('T')[0],
		}
	}

	// Fetch history data for chart
	const fetchHistory = async (range: string) => {
		const { start, end } = getDateRange(range)
		const res = await fetch('/api/history', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ from, to, start, end }),
		})
		const data = await res.json()
		if (data.rates && Array.isArray(data.rates)) {
			setChartData(data.rates)
		}
	}

	// When "from" or "to" changes, refetch history
	useEffect(() => {
		if (from && to) fetchHistory(timeRange)
	}, [from, to, timeRange])

	// Recognize + detect currency note
	const handleRecognize = async (file: File) => {
		try {
			setLoading(true)
			const formData = new FormData()
			formData.append('file', file)

			const res1 = await fetch('/api/recognise', { method: 'POST', body: formData })
			const res1Data = await res1.json()

			if (res1Data.result === 'True') {
				const response = await fetch(`${process.env.NEXT_PUBLIC_MODEL_URL}/predict`, {
					method: 'POST',
					body: formData,
				})
				if (!response.ok) throw new Error('Prediction failed')

				const result = await response.json()
				setData(result)

				// Example: "USD-50"
				const pred = result.prediction
				const [predCurrency, predValue] = pred.split('-')
				setFrom(predCurrency)
				setAmount(Number(predValue))
			} else {
				setData({ prediction: 'This is not a currency note.' })
			}
		} catch (error) {
			console.error('Error during recognition:', error)
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="flex bg-transparent h-screen overflow-hidden">
			<div className="flex flex-col flex-1 overflow-hidden">
				<div className="flex flex-grow gap-6 p-6">
					{/* Upload Section */}
					<div className="flex flex-col w-full md:w-1/2">
						<ImageUpload onRecognize={handleRecognize} loading={loading} />
					</div>

					{/* Conversion + Chart Section */}
					<div className="flex flex-col bg-white/10 p-4 rounded-lg w-full md:w-1/2">
						<h3 className="mb-4 font-bold text-lg">Currency Converter</h3>

						<input
							type="number"
							value={amount}
							onChange={(e) => setAmount(Number(e.target.value))}
							className="bg-black/20 mb-4 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
							placeholder="Enter amount"
						/>

						<div className="flex gap-3 mb-4">
							<select value={from} onChange={(e) => setFrom(e.target.value)} className="bg-black/20 px-3 py-2 border border-gray-300 rounded-lg w-1/2">
								{currencyList.map((currency) => (
									<option key={currency} value={currency}>{currency}</option>
								))}
							</select>
							<select value={to} onChange={(e) => setTo(e.target.value)} className="bg-black/20 px-3 py-2 border border-gray-300 rounded-lg w-1/2">
								{currencyList.map((currency) => (
									<option key={currency} value={currency}>{currency}</option>
								))}
							</select>
						</div>

						{result !== null && (
							<p className="mt-4 font-bold text-green-600">
								{amount} {from} = {result.toFixed(2)} {to}
							</p>
						)}

						{chartData.length > 0 && (
							<div className="mt-6">
								<div className="flex justify-center gap-2 mb-3">
									{['1M', '5M', '1Y'].map((range) => (
										<Button
											key={range}
											className={`px-3 py-1 rounded-lg ${timeRange === range ? 'bg-blue-500' : 'bg-blue-800'}`}
											onClick={() => setTimeRange(range)}
										>
											{range}
										</Button>
									))}
								</div>
								<ResponsiveContainer width="100%" height={200}>
									<AreaChart data={chartData}>
										<CartesianGrid strokeDasharray="3 3" vertical={false} />
										<XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => value.slice(5)} />
										<YAxis domain={['auto', 'auto']} tickLine={false} axisLine={false} tickMargin={8} width={40} />
										<Tooltip contentStyle={{ background: '#222', borderRadius: 8, color: '#fff' }} labelFormatter={(label) => `Date: ${label}`} formatter={(value) => [`${value}`, `${from}→${to}`]} />
										<Area type="monotone" dataKey="rate" stroke="#60a5fa" fill="#60a5fa" fillOpacity={0.2} strokeWidth={2} dot={false} />
									</AreaChart>
								</ResponsiveContainer>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}

// Upload component
function ImageUpload({ onRecognize, loading }: { onRecognize: (file: File) => void, loading: boolean }) {
	const maxSizeMB = 15
	const maxSize = maxSizeMB * 1024 * 1024

	const [
		{ files, isDragging, errors },
		{
			handleDragEnter,
			handleDragLeave,
			handleDragOver,
			handleDrop,
			openFileDialog,
			removeFile,
			getInputProps,
		},
	] = useFileUpload({
		accept: "image/svg+xml,image/png,image/jpeg,image/jpg,image/gif",
		maxSize,
	})

	const previewUrl = files[0]?.preview || null

	return (
		<div className="flex flex-col justify-center items-center gap-2">
			<div className="relative w-[80%]">
				<div
					onDragEnter={handleDragEnter}
					onDragLeave={handleDragLeave}
					onDragOver={handleDragOver}
					onDrop={handleDrop}
					data-dragging={isDragging || undefined}
					className="relative flex flex-col justify-center items-center data-[dragging=true]:bg-accent/50 p-4 border border-input has-[input:focus]:border-ring border-dashed rounded-xl has-[input:focus]:ring-[3px] has-[input:focus]:ring-ring/50 min-h-64 overflow-hidden transition-colors"
				>
					<input {...getInputProps()} className="sr-only" aria-label="Upload image file" />
					{previewUrl ? (
						<div className="absolute inset-0 flex justify-center items-center p-4">
							<img src={previewUrl} alt="Uploaded" className="mx-auto rounded max-h-full object-contain" />
						</div>
					) : (
						<div className="flex flex-col justify-center items-center px-4 py-3 text-center">
							<div className="flex justify-center items-center bg-background mb-2 border rounded-full size-11 shrink-0">
								<ImageIcon className="opacity-60 size-4 text-black" />
							</div>
							<p className="mb-1.5 font-medium text-sm">Drop your image here</p>
							<p className="text-muted-foreground text-xs">SVG, PNG, JPG or GIF (max. {maxSizeMB}MB)</p>
							<Button variant="outline" className="hover:bg-accent/50 mt-4 text-black" onClick={openFileDialog}>
								<UploadIcon className="opacity-60 -ms-1 size-4" />
								Select image
							</Button>
						</div>
					)}
				</div>

				{previewUrl && (
					<div className="top-4 right-4 absolute">
						<button
							type="button"
							className="z-50 flex justify-center items-center bg-black/60 hover:bg-black/80 rounded-full size-8 text-white"
							onClick={() => removeFile(files[0]?.id)}
						>
							<XIcon className="size-4" />
						</button>
					</div>
				)}
			</div>

			{errors.length > 0 && (
				<div className="flex items-center gap-1 text-destructive text-xs">
					<AlertCircleIcon className="size-3" />
					<span>{errors[0]}</span>
				</div>
			)}

			<Button
				onClick={() => files[0] && onRecognize(files[0].file)}
				disabled={loading || files.length === 0}
				className={`px-6 py-3 rounded-lg mt-[1rem] font-medium text-white transition-all duration-200 shadow-lg ${loading || files.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#0A0A57] hover:bg-[#0A0A57]/90'}`}
			>
				{loading ? 'Processing...' : 'Recognize & Detect Currency'}
			</Button>
		</div>
	)
}
