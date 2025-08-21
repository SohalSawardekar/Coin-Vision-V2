/* eslint-disable @next/next/no-img-element */
'use client'
import React, { useState, useEffect } from 'react'
import {
	AlertCircle,
	ArrowRightLeft,
	Loader2,
	Upload,
	X,
	DollarSign,
	Eye,
	Calculator,
	TrendingUp,
	Globe,
	RefreshCw,
	Camera,
	BarChart3,
	Info
} from 'lucide-react'
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { Skeleton } from '@/components/ui/skeleton';

interface PredictionResult {
	status: string;
	prediction: string;
	confidence: number;
}

interface CurrencyData {
	currency_code: string;
	currency_name: string;
	denomination: string;
	country: string;
	symbol: string;
	description: string;
}

interface ConversionData {
	from_currency: string;
	to_currency: string;
	amount: number;
	converted_amount: number;
	exchange_rate: number;
	last_updated: string;
}

const CurrencyConverter = () => {
	const [file, setFile] = useState<File | null>(null)
	const [loading, setLoading] = useState(false)
	const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null)
	const [currencyData, setCurrencyData] = useState<CurrencyData | null>(null)
	const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({})
	const [conversionData, setConversionData] = useState<ConversionData | null>(null)
	const [targetCurrency, setTargetCurrency] = useState('USD')
	const [customAmount, setCustomAmount] = useState<string>('')
	const [notNote, setNotNote] = useState(false)
	const [step, setStep] = useState<'upload' | 'detected' | 'converted'>('upload')
	const [historicalData, setHistoricalData] = useState<Array<{ date: string, rate: number }>>([])
	const [loadingRates, setLoadingRates] = useState(false)

	const currencies = [
		{ code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
		{ code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
		{ code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧' },
		{ code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵' },
		{ code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳' },
		{ code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦' },
		{ code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺' },
		{ code: 'CHF', name: 'Swiss Franc', symbol: 'Fr', flag: '🇨🇭' },
		{ code: 'CNY', name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳' },
		{ code: 'KRW', name: 'South Korean Won', symbol: '₩', flag: '🇰🇷' }
	]

	// Parse prediction result to extract currency code and denomination
	const parsePrediction = (prediction: string) => {
		const parts = prediction.split('-');
		if (parts.length === 2) {
			return {
				currency_code: parts[0],
				denomination: parts[1]
			};
		}
		return null;
	};

	// Get currency details from Gemini API
	const getGeminiCurrencyData = async (predictionData: PredictionResult) => {
		try {
			const parsed = parsePrediction(predictionData.prediction);
			if (!parsed) return;

			// Mock Gemini API call for currency details

			// Simulate API call
			await new Promise(resolve => setTimeout(resolve, 1000));

			// Mock response based on currency code
			const mockCurrencyDetails: Record<string, CurrencyData> = {
				'INR': {
					currency_code: 'INR',
					currency_name: 'Indian Rupee',
					denomination: parsed.denomination,
					country: 'India',
					symbol: '₹',
					description: 'The Indian Rupee is the official currency of India, issued by the Reserve Bank of India.'
				},
				'USD': {
					currency_code: 'USD',
					currency_name: 'United States Dollar',
					denomination: parsed.denomination,
					country: 'United States',
					symbol: '$',
					description: 'The US Dollar is the official currency of the United States and the world\'s primary reserve currency.'
				},
				'EUR': {
					currency_code: 'EUR',
					currency_name: 'Euro',
					denomination: parsed.denomination,
					country: 'Eurozone',
					symbol: '€',
					description: 'The Euro is the official currency of 19 European Union countries in the Eurozone.'
				}
			};

			setCurrencyData(mockCurrencyDetails[parsed.currency_code] || {
				currency_code: parsed.currency_code,
				currency_name: `${parsed.currency_code} Currency`,
				denomination: parsed.denomination,
				country: 'Unknown',
				symbol: parsed.currency_code,
				description: `${parsed.currency_code} is a recognized international currency.`
			});

		} catch (error) {
			console.error('Error getting currency details:', error);
		}
	};

	// Fetch real-time exchange rates
	const fetchExchangeRates = async (baseCurrency: string) => {
		setLoadingRates(true);
		try {
			const response = await fetch(`https://v6.exchangerate-api.com/v6/${process.env.NEXT_PUBLIC_EXCHANGE_RATES_API_KEY}/latest/${baseCurrency}`, {
				method: "GET",
				headers: { "Content-Type": "application/json" },
			});

			if (!response.ok) throw new Error("Failed to fetch exchange rates");

			const data = await response.json();
			setExchangeRates(data.conversion_rates);
		} catch (error) {
			console.error("Error fetching exchange rates:", error);
			setExchangeRates({
				USD: 1, EUR: 0.85, GBP: 0.73, JPY: 110, INR: 74.5,
				CAD: 1.25, AUD: 1.35, CHF: 0.92, CNY: 6.45, KRW: 1180
			});
		} finally {
			setLoadingRates(false);
		}
	};

	// Fetch historical data for chart
	const fetchHistoricalData = async (fromCurrency: string, toCurrency: string) => {
		try {
			// Generate mock historical data for the last 30 days
			const data = [];
			const baseRate = exchangeRates[toCurrency] || 1;

			for (let i = 29; i >= 0; i--) {
				const date = new Date();
				date.setDate(date.getDate() - i);
				const variation = (Math.random() - 0.5) * 0.1; // ±5% variation
				const rate = baseRate * (1 + variation);

				data.push({
					date: date.toISOString().split('T')[0],
					rate: parseFloat(rate.toFixed(4))
				});
			}

			setHistoricalData(data);
		} catch (error) {
			console.error('Error fetching historical data:', error);
		}
	};

	const handleRecognize = async () => {
		if (!file) return;

		const formData = new FormData();
		formData.append('file', file);

		setLoading(true);
		setNotNote(false);
		setPredictionResult(null);
		setCurrencyData(null);

		try {
			// Step 1: Verify image
			const res1 = await fetch("/api/recognise", {
				method: 'POST',
				body: formData,
			});
			const res1Data = await res1.json();

			if (res1Data.result !== "True") {
				setPredictionResult({ status: "error", prediction: "This is not a currency note.", confidence: 0 });
				setNotNote(true);
				return;
			}

			// Step 2: Predict currency
			const response = await fetch(`${process.env.NEXT_PUBLIC_MODEL_URL}/predict`, {
				method: 'POST',
				body: formData,
			});

			if (!response.ok) throw new Error('Prediction failed');
			const result = await response.json();

			setPredictionResult(result);

			// Step 3: Get detailed information
			if (result.prediction && result.status === 'success') {
				await getGeminiCurrencyData(result);
				setStep('detected');

				// Fetch exchange rates for the detected currency
				const parsed = parsePrediction(result.prediction);
				if (parsed) {
					await fetchExchangeRates(parsed.currency_code);
				}
			}

		} catch (error) {
			console.error('Error during recognition:', error);
			setPredictionResult({ status: "error", prediction: "Error during recognition. Please try again.", confidence: 0 });
		} finally {
			setLoading(false);
		}
	};

	const handleConvert = async () => {
		if (!predictionResult || !currencyData) return;

		const parsed = parsePrediction(predictionResult.prediction);
		if (!parsed) return;

		const amount = customAmount ? parseFloat(customAmount) : parseFloat(parsed.denomination);
		const exchangeRate = exchangeRates[targetCurrency] || 1;
		const convertedAmount = amount * exchangeRate;

		const conversion: ConversionData = {
			from_currency: parsed.currency_code,
			to_currency: targetCurrency,
			amount: amount,
			converted_amount: convertedAmount,
			exchange_rate: exchangeRate,
			last_updated: new Date().toISOString()
		};

		setConversionData(conversion);
		setStep('converted');

		// Fetch historical data for the chart
		await fetchHistoricalData(parsed.currency_code, targetCurrency);
	};

	// Update exchange rates when target currency changes
	useEffect(() => {
		if (currencyData && targetCurrency) {
			fetchExchangeRates(currencyData.currency_code);
			if (step === 'converted') {
				fetchHistoricalData(currencyData.currency_code, targetCurrency);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [targetCurrency]);

	const resetApp = () => {
		setFile(null);
		setPredictionResult(null);
		setCurrencyData(null);
		setConversionData(null);
		setCustomAmount('');
		setStep('upload');
		setNotNote(false);
		setHistoricalData([]);
	};

	return (
		<>
			<div className="flex mb-4 xs:mb-6 ml-2 xs:ml-6 sm:ml-12 md:ml-16 w-full">
				<p className="font-semibold text-white text-xl xs:text-2xl text-left">AI Currency Converter</p>
			</div>
			<div className='justify-center items-start gap-4 xs:gap-8 grid grid-cols-1 lg:grid-cols-2 px-2 xs:px-4 w-full'>
				<div className='flex justify-center mb-6 lg:mb-0'>
					<div className='flex flex-col justify-start items-center gap-y-4 w-full max-w-xs xs:max-w-sm sm:max-w-md'>
						<ImageUpload setFile={setFile} />
						<div className="flex flex-col gap-2 w-full max-w-[200px]">
							<button
								onClick={handleRecognize}
								disabled={loading || !file}
								className="flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-4 py-2 rounded-lg font-medium text-white text-sm xs:text-base transition-colors"
							>
								{loading ? (
									<>
										<Loader2 className="animate-spin" size={16} />
										Detecting...
									</>
								) : (
									<>
										<Camera size={16} />
										Detect Currency
									</>
								)}
							</button>

							{step !== 'upload' && (
								<button
									onClick={resetApp}
									className="flex justify-center items-center gap-2 bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg font-medium text-white text-sm xs:text-base transition-colors"
								>
									<RefreshCw size={16} />
									Reset
								</button>
							)}
						</div>
					</div>
				</div>

				<div className="flex justify-center">
					<div className="bg-[#27324b] p-4 xs:p-6 rounded-2xl xs:rounded-3xl w-full max-w-full sm:max-w-xl md:max-w-2xl min-h-[50dvh] xs:min-h-[60dvh]">
						<div className="flex justify-center items-center mb-4 xs:mb-6">
							<p className="font-bold text-white text-xl xs:text-2xl text-center">Currency Analysis</p>
						</div>

						{loading ? (
							<div className="space-y-4 max-h-[70vh] overflow-y-auto">
								{/* Conversion Result */}
								<div className="bg-gradient-to-r from-green-900/30 to-blue-900/30 p-6 border-2 border-green-500/30 rounded-xl">
									<div className="flex items-center mb-4">
										<Skeleton className="mr-2 rounded-full w-6 h-6" />
										<Skeleton className="w-40 h-6" />
									</div>

									<div className="flex justify-between items-center mb-4">
										<div className="space-y-2 text-center">
											<Skeleton className="mx-auto w-24 h-4" />
											<Skeleton className="mx-auto w-20 h-6" />
										</div>

										<Skeleton className="rounded-full w-8 h-8" />

										<div className="space-y-2 text-center">
											<Skeleton className="mx-auto w-24 h-4" />
											<Skeleton className="mx-auto w-20 h-6" />
										</div>
									</div>

									<div className="space-y-2 bg-[#1a2332] p-3 rounded-lg text-center">
										<Skeleton className="mx-auto w-28 h-4" />
										<Skeleton className="mx-auto w-44 h-5" />
									</div>
								</div>

								{/* Historical Rate Chart */}
								<div className="bg-[#1a2332] p-4 border border-gray-700 rounded-xl">
									<div className="flex items-center mb-4">
										<Skeleton className="mr-2 rounded-full w-5 h-5" />
										<Skeleton className="w-48 h-5" />
									</div>
									<Skeleton className="rounded-md w-full h-48" />
									<Skeleton className="mx-auto mt-3 w-64 h-3" />
								</div>

								{/* Detection Details */}
								<div className="bg-[#1a2332] p-4 border border-gray-700 rounded-xl">
									<div className="flex items-center mb-3">
										<Skeleton className="mr-2 rounded-full w-5 h-5" />
										<Skeleton className="w-36 h-5" />
									</div>
									<div className="gap-4 grid grid-cols-2">
										{Array.from({ length: 4 }).map((_, i) => (
											<div key={i} className="space-y-2">
												<Skeleton className="w-24 h-3" />
												<Skeleton className="w-32 h-4" />
											</div>
										))}
									</div>
								</div>

								{/* Exchange Rate Info */}
								<div className="bg-[#1a2332] p-4 border border-gray-700 rounded-xl">
									<div className="flex items-center mb-3">
										<Skeleton className="mr-2 rounded-full w-5 h-5" />
										<Skeleton className="w-48 h-5" />
									</div>
									<div className="space-y-2">
										<Skeleton className="w-60 h-4" />
										<Skeleton className="w-52 h-4" />
										<Skeleton className="rounded-md w-full h-12" />
									</div>
								</div>

								{/* Actions */}
								<div className="flex gap-3">
									<Skeleton className="rounded-lg w-full h-10" />
								</div>
							</div>
						) : (
							<>
								{step === 'upload' && !notNote && !predictionResult && (
									<div className="flex flex-col justify-center items-center h-[40vh] xs:h-[70%] text-center">
										<DollarSign className="mb-4 text-gray-400" size={48} />
										<p className="text-gray-400 text-sm xs:text-base text-center">Upload a currency note to detect and convert</p>
										<p className="mt-2 text-gray-500 text-xs xs:text-sm">Our AI will identify the currency and provide real-time conversion rates</p>
									</div>
								)}

								{notNote && (
									<div className="flex flex-col justify-center items-center h-[40vh] xs:h-[70%] text-center">
										<AlertCircle className="mb-4 text-red-400" size={48} />
										<p className="text-red-400 text-sm xs:text-base">This is not a currency note.</p>
										<p className="mt-2 text-gray-500 text-xs xs:text-sm">Please upload a valid currency note image</p>
									</div>
								)}

								{step === 'detected' && predictionResult && currencyData && (
									<CurrencyDetectionResults
										predictionResult={predictionResult}
										currencyData={currencyData}
										targetCurrency={targetCurrency}
										setTargetCurrency={setTargetCurrency}
										customAmount={customAmount}
										setCustomAmount={setCustomAmount}
										onConvert={handleConvert}
										currencies={currencies}
										exchangeRates={exchangeRates}
										loadingRates={loadingRates}
									/>
								)}

								{step === 'converted' && conversionData && currencyData && (
									<ConversionResults
										predictionResult={predictionResult!}
										currencyData={currencyData}
										conversionData={conversionData}
										currencies={currencies}
										historicalData={historicalData}
										onConvertAgain={() => setStep('detected')}
									/>
								)}

								{predictionResult?.status === 'error' && (
									<div className="bg-[#1a2332] p-3 rounded-xl">
										<h3 className="mb-3 font-semibold text-red-400 text-lg">Error</h3>
										<p className="text-gray-300 leading-relaxed">{predictionResult.prediction}</p>
									</div>
								)}
							</>
						)}
					</div>
				</div>
			</div>
		</>
	)
}

const CurrencyDetectionResults = ({
	predictionResult,
	currencyData,
	targetCurrency,
	setTargetCurrency,
	customAmount,
	setCustomAmount,
	onConvert,
	currencies,
	exchangeRates,
	loadingRates
}: {
	predictionResult: PredictionResult;
	currencyData: CurrencyData;
	targetCurrency: string;
	setTargetCurrency: (currency: string) => void;
	customAmount: string;
	setCustomAmount: React.Dispatch<React.SetStateAction<string>>;
	onConvert: () => void;
	currencies: Array<{ code: string, name: string, symbol: string, flag: string }>;
	exchangeRates: Record<string, number>;
	loadingRates: boolean;
}) => {
	const getConfidenceColor = (confidence: number) => {
		if (confidence >= 90) return 'text-green-400 bg-green-400/10';
		if (confidence >= 75) return 'text-blue-400 bg-blue-400/10';
		if (confidence >= 60) return 'text-yellow-400 bg-yellow-400/10';
		return 'text-red-400 bg-red-400/10';
	};

	return (
		<div className="space-y-4 text-white">
			{/* Detection Results */}
			<div className="bg-[#1a2332] p-4 border-2 border-green-500/30 rounded-xl">
				<div className="flex justify-between items-center mb-3">
					<h3 className="flex items-center font-semibold text-lg">
						<Eye className="mr-2 text-green-400" size={20} />
						Currency Detected
					</h3>
					<div className={`px-3 py-1 rounded-full text-sm font-bold ${getConfidenceColor(predictionResult.confidence)}`}>
						{predictionResult.confidence.toFixed(1)}% Confidence
					</div>
				</div>
				<div className="space-y-2">
					<p className="font-bold text-green-400 text-xl">{currencyData.currency_name}</p>
					<p className="text-gray-300">Code: {currencyData.currency_code}</p>
					<p className="text-gray-300">Country: {currencyData.country}</p>
					<p className="text-gray-300">Denomination: {currencyData.symbol}{currencyData.denomination}</p>
					<p className="text-gray-400 text-sm">{currencyData.description}</p>
				</div>
			</div>

			{/* Current Exchange Rate Preview */}
			{!loadingRates && exchangeRates[targetCurrency] && (
				<div className="bg-[#1a2332] p-4 border border-blue-500/30 rounded-xl">
					<h3 className="flex items-center mb-3 font-semibold text-lg">
						<TrendingUp className="mr-2 text-blue-400" size={20} />
						Live Exchange Rate
					</h3>
					<div className="text-center">
						<p className="text-gray-300 text-sm">1 {currencyData.currency_code} = {exchangeRates[targetCurrency].toFixed(4)} {targetCurrency}</p>
						<p className="mt-1 font-bold text-blue-400 text-2xl">
							{currencyData.symbol}{currencyData.denomination} = {currencies.find(c => c.code === targetCurrency)?.symbol}{(parseFloat(currencyData.denomination) * exchangeRates[targetCurrency]).toFixed(2)}
						</p>
					</div>
				</div>
			)}

			{/* Conversion Setup */}
			<div className="bg-[#1a2332] p-4 border border-gray-700 rounded-xl">
				<h3 className="flex items-center mb-4 font-semibold text-lg">
					<Calculator className="mr-2 text-purple-400" size={20} />
					Setup Conversion
				</h3>

				<div className="space-y-4">
					<div>
						<label className="block mb-2 text-gray-300 text-sm">Amount to Convert</label>
						<input
							type="number"
							value={customAmount}
							onChange={(e) => setCustomAmount(e.target.value)}
							placeholder={`Default: ${currencyData.denomination}`}
							className="bg-[#0f1419] px-3 py-2 border border-gray-600 focus:border-purple-400 rounded-lg focus:outline-none w-full text-white placeholder-gray-400"
						/>
					</div>

					<div>
						<label className="block mb-2 text-gray-300 text-sm">Convert To</label>
						<select
							value={targetCurrency}
							onChange={(e) => setTargetCurrency(e.target.value)}
							className="bg-[#0f1419] px-3 py-2 border border-gray-600 focus:border-purple-400 rounded-lg focus:outline-none w-full text-white"
						>
							{currencies.map((currency) => (
								<option key={currency.code} value={currency.code} disabled={currency.code === currencyData.currency_code}>
									{currency.flag} {currency.symbol} {currency.name} ({currency.code})
								</option>
							))}
						</select>
					</div>

					<button
						onClick={onConvert}
						disabled={loadingRates}
						className="flex justify-center items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 px-4 py-2 rounded-lg w-full font-medium text-white transition-colors"
					>
						{loadingRates ? (
							<>
								<Loader2 className="animate-spin" size={16} />
								Loading Rates...
							</>
						) : (
							<>
								<ArrowRightLeft size={16} />
								Convert Currency
							</>
						)}
					</button>
				</div>
			</div>
		</div>
	);
};

const ConversionResults = ({
	predictionResult,
	currencyData,
	conversionData,
	currencies,
	historicalData,
	onConvertAgain
}: {
	predictionResult: PredictionResult;
	currencyData: CurrencyData;
	conversionData: ConversionData;
	currencies: Array<{ code: string, name: string, symbol: string, flag: string }>;
	historicalData: Array<{ date: string, rate: number }>;
	onConvertAgain: () => void;
}) => {
	const fromCurrency = currencies.find(c => c.code === conversionData.from_currency);
	const toCurrency = currencies.find(c => c.code === conversionData.to_currency);

	return (
		<div className="space-y-4 max-h-[70vh] overflow-y-auto text-white">
			{/* Conversion Result */}
			<div className="bg-gradient-to-r from-green-900/30 to-blue-900/30 p-6 border-2 border-green-500/30 rounded-xl">
				<h3 className="flex items-center mb-4 font-semibold text-xl">
					<TrendingUp className="mr-2 text-green-400" size={24} />
					Conversion Result
				</h3>

				<div className="flex justify-between items-center mb-4">
					<div className="text-center">
						<p className="text-gray-300 text-sm">{fromCurrency?.flag} {fromCurrency?.name}</p>
						<p className="font-bold text-white text-2xl">
							{fromCurrency?.symbol}{conversionData.amount.toFixed(2)}
						</p>
					</div>

					<ArrowRightLeft className="text-blue-400" size={32} />

					<div className="text-center">
						<p className="text-gray-300 text-sm">{toCurrency?.flag} {toCurrency?.name}</p>
						<p className="font-bold text-green-400 text-2xl">
							{toCurrency?.symbol}{conversionData.converted_amount.toFixed(2)}
						</p>
					</div>
				</div>

				<div className="bg-[#1a2332] p-3 rounded-lg text-center">
					<p className="text-gray-300 text-sm">Exchange Rate</p>
					<p className="font-semibold text-lg">
						1 {conversionData.from_currency} = {conversionData.exchange_rate.toFixed(6)} {conversionData.to_currency}
					</p>
				</div>
			</div>

			{/* Historical Rate Chart */}
			{historicalData.length > 0 && (
				<div className="bg-[#1a2332] p-4 border border-gray-700 rounded-xl">
					<h3 className="flex items-center mb-4 font-semibold text-lg">
						<BarChart3 className="mr-2 text-cyan-400" size={20} />
						30-Day Exchange Rate Trend
					</h3>
					<div className="h-48">
						<ResponsiveContainer width="100%" height="100%">
							<AreaChart data={historicalData}>
								<defs>
									<linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
										<stop offset="5%" stopColor="#00bcd4" stopOpacity={0.3} />
										<stop offset="95%" stopColor="#00bcd4" stopOpacity={0} />
									</linearGradient>
								</defs>
								<CartesianGrid strokeDasharray="3 3" stroke="#374151" />
								<XAxis
									dataKey="date"
									stroke="#9CA3AF"
									fontSize={12}
									tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
								/>
								<YAxis
									stroke="#9CA3AF"
									fontSize={12}
									domain={['dataMin - 0.001', 'dataMax + 0.001']}
								/>
								<Tooltip
									labelFormatter={(value) => new Date(value).toLocaleDateString()}
									formatter={(value: unknown) => [`${value} ${conversionData.to_currency}`, 'Rate']}
									contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
								/>
								<Area
									type="monotone"
									dataKey="rate"
									stroke="#00bcd4"
									fillOpacity={1}
									fill="url(#colorRate)"
									strokeWidth={2}
								/>
							</AreaChart>
						</ResponsiveContainer>
					</div>
					<p className="mt-2 text-gray-400 text-xs text-center">
						Exchange rate from {conversionData.from_currency} to {conversionData.to_currency} over the last 30 days
					</p>
				</div>
			)}

			{/* Original Detection Info */}
			<div className="bg-[#1a2332] p-4 border border-gray-700 rounded-xl">
				<h3 className="flex items-center mb-3 font-semibold text-lg">
					<Eye className="mr-2 text-purple-400" size={20} />
					Detection Details
				</h3>
				<div className="gap-4 grid grid-cols-2 text-sm">
					<div>
						<p className="text-gray-400">Detected Currency</p>
						<p className="font-medium">{currencyData.currency_name}</p>
					</div>
					<div>
						<p className="text-gray-400">Country</p>
						<p className="font-medium">{currencyData.country}</p>
					</div>
					<div>
						<p className="text-gray-400">Denomination</p>
						<p className="font-medium">{currencyData.symbol}{currencyData.denomination}</p>
					</div>
					<div>
						<p className="text-gray-400">AI Confidence</p>
						<p className="font-medium text-green-400">{predictionResult.confidence.toFixed(1)}%</p>
					</div>
				</div>
			</div>

			{/* Rate Information */}
			<div className="bg-[#1a2332] p-4 border border-gray-700 rounded-xl">
				<h3 className="flex items-center mb-3 font-semibold text-lg">
					<Globe className="mr-2 text-orange-400" size={20} />
					Exchange Rate Information
				</h3>
				<div className="space-y-2 text-sm">
					<p className="text-gray-300">
						<span className="font-medium">Last Updated:</span> {new Date(conversionData.last_updated).toLocaleString()}
					</p>
					<p className="text-gray-300">
						<span className="font-medium">Rate Source:</span> Live market data via ExchangeRate API
					</p>
					<div className="flex items-start gap-2 bg-blue-500/10 p-2 rounded-lg">
						<Info className="mt-0.5 text-blue-400" size={14} />
						<p className="text-blue-300 text-xs">
							Exchange rates are updated every 60 minutes and may vary from actual trading rates.
							Use for reference only.
						</p>
					</div>
				</div>
			</div>

			{/* Actions */}
			<div className="flex gap-3">
				<button
					onClick={onConvertAgain}
					className="flex flex-1 justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium text-white transition-colors"
				>
					<Calculator size={16} />
					Convert Again
				</button>
			</div>
		</div>
	);
};

function ImageUpload({ setFile }: { setFile: React.Dispatch<React.SetStateAction<File | null>> }) {
	const [dragActive, setDragActive] = useState(false);
	const [preview, setPreview] = useState<string | null>(null);
	const [error, setError] = useState<string>('');

	const handleDrag = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (e.type === "dragenter" || e.type === "dragover") {
			setDragActive(true);
		} else if (e.type === "dragleave") {
			setDragActive(false);
		}
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setDragActive(false);

		const files = e.dataTransfer.files;
		if (files && files[0]) {
			handleFile(files[0]);
		}
	};

	const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (files && files[0]) {
			handleFile(files[0]);
		}
	};

	const handleFile = (file: File) => {
		setError('');

		// Validate file type
		const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
		if (!validTypes.includes(file.type)) {
			setError('Please upload a valid image file (JPEG, PNG, GIF)');
			return;
		}

		// Validate file size (15MB)
		if (file.size > 15 * 1024 * 1024) {
			setError('File size must be less than 15MB');
			return;
		}

		setFile(file);

		// Create preview
		const reader = new FileReader();
		reader.onload = (e) => {
			setPreview(e.target?.result as string);
		};
		reader.readAsDataURL(file);
	};

	const removeFile = () => {
		setFile(null);
		setPreview(null);
		setError('');
	};

	return (
		<div className="flex flex-col justify-center items-center gap-2 w-full">
			<div className="relative mt-[2rem] w-[100%]">
				<div
					onDragEnter={handleDrag}
					onDragLeave={handleDrag}
					onDragOver={handleDrag}
					onDrop={handleDrop}
					className={`relative flex flex-col justify-center items-center p-6 border-2 border-dashed rounded-xl min-h-64 overflow-hidden transition-all duration-200 ${dragActive
						? 'border-blue-400 bg-blue-50/10'
						: 'border-gray-400 hover:border-blue-400'
						}`}
				>
					<input
						type="file"
						onChange={handleFileInput}
						accept="image/*"
						className="sr-only"
						id="file-upload"
					/>

					{preview ? (
						<div className="absolute inset-0 flex justify-center items-center p-4">
							<img
								src={preview}
								alt="Currency preview"
								className="shadow-lg mx-auto rounded-lg max-h-full object-contain"
							/>
						</div>
					) : (
						<div className="flex flex-col justify-center items-center px-4 py-6 text-center">
							<div className="flex justify-center items-center bg-gradient-to-br from-green-500 to-blue-600 shadow-lg mb-4 rounded-full size-16 shrink-0">
								<DollarSign className="size-8 text-white" />
							</div>
							<p className="mb-2 font-semibold text-gray-300 text-lg">Drop your currency note here</p>
							<p className="mb-4 text-gray-400 text-sm">
								PNG, JPG or GIF (max. 15MB)
							</p>
							<label
								htmlFor="file-upload"
								className="flex justify-center items-center gap-2 bg-gray-700 hover:bg-gray-600 px-4 py-2 border-2 border-gray-600 hover:border-blue-400 rounded-lg font-medium text-white transition-all duration-200 cursor-pointer"
							>
								<Upload className="size-4" />
								Select Image
							</label>
						</div>
					)}
				</div>

				{preview && (
					<div className="top-4 right-4 absolute">
						<button
							onClick={removeFile}
							className="z-50 flex justify-center items-center bg-red-500/80 hover:bg-red-600 shadow-lg rounded-full size-10 text-white transition-all duration-200 cursor-pointer"
							aria-label="Remove image"
						>
							<X className="size-5" />
						</button>
					</div>
				)}
			</div>

			{error && (
				<div className="flex items-center gap-2 bg-red-500/10 p-3 border border-red-500/20 rounded-lg text-red-400 text-sm">
					<AlertCircle className="size-4 shrink-0" />
					<span>{error}</span>
				</div>
			)}
		</div>
	);
}

export default CurrencyConverter