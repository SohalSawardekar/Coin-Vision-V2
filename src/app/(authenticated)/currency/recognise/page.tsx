/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client"

import { AlertCircleIcon, ImageIcon, UploadIcon, XIcon, Loader2, Banknote, Globe, Calendar, Shield, Info } from "lucide-react"
import { useFileUpload } from "@/hooks/use-file-upload"
import { Button } from "@/components/ui/button"
import React, { useEffect, useState } from 'react'

interface CurrencyData {
	prediction?: string;
	confidence?: number;
	geminiData?: {
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
		exchange_rate?: string;
	};
}

const Currency = () => {
	const [file, setFile] = useState<File | null>(null)
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState<CurrencyData | null>(null);
	const [notNote, setNotNote] = useState(false);
	const [geminiLoading, setGeminiLoading] = useState(false);

	const handleRecognize = async () => {
		if (!file) return;

		const formData = new FormData();
		formData.append('file', file);

		setLoading(true);
		setNotNote(false);
		setData(null);

		try {
			// Step 1: Verify image
			const res1 = await fetch("/api/recognise", {
				method: 'POST',
				body: formData,
			});
			const res1Data = await res1.json();

			if (res1Data.result !== "True") {
				setData({ prediction: "This is not a currency note." });
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

			// Set initial result
			setData(result);

			// Step 3: Get detailed information from Gemini API
			if (result.prediction) {
				await getGeminiCurrencyData(result);
			}

		} catch (error) {
			console.error('Error during recognition:', error);
			setData({ prediction: "Error during recognition. Please try again." });
		} finally {
			setLoading(false);
		}
	};

	const getGeminiCurrencyData = async (initialData: any) => {
		setGeminiLoading(true);
		try {
			const prompt = `Please provide detailed information about the currency note: ${initialData.prediction}. 
			
			Provide the response in the following JSON format:
			{
				"denomination": "value and currency symbol",
				"country": "full country name",
				"currency_code": "3-letter currency code",
				"year": "year of issue or series year",
				"series": "series name if applicable",
				"security_features": ["list", "of", "security", "features"],
				"dimensions": "width x height in mm",
				"color_scheme": ["primary", "colors", "used"],
				"material": "material composition",
				"description": "detailed description of the note",
				"historical_info": "brief historical context",
				"exchange_rate": "approximate current exchange rate to USD"
			}
			
			Please ensure all information is accurate and factual. If any information is not available, use "Not available" as the value.`;

			const response = await fetch('/api/gemini-currency', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					prompt: prompt,
					currency: initialData.prediction
				}),
			});

			if (!response.ok) throw new Error('Gemini API call failed');

			const geminiResult = await response.json();

			// Update the data with Gemini information
			setData(prevData => ({
				...prevData,
				geminiData: geminiResult.data
			}));

		} catch (error) {
			console.error('Error getting Gemini data:', error);
			// Don't overwrite existing data, just log the error
		} finally {
			setGeminiLoading(false);
		}
	};

	return (
		<>
			<div className="flex ml-0 md:ml-[3rem] px-4 md:px-0 w-full">
				<p className="font-semibold text-white text-2xl text-left">Recognise Currency</p>
			</div>
			<div className="justify-center items-start gap-8 grid grid-cols-1 md:grid-cols-2 px-2 md:px-4 w-full">
				<div className="flex justify-center w-full">
					<div className="flex flex-col justify-start items-center gap-y-4 w-full">
						<ImageUpload setFile={setFile} />
						<Button
							onClick={handleRecognize}
							disabled={loading || !file}
							className="bg-secondary hover:bg-white/60 w-full sm:w-auto max-w-[200px] text-primary hover:cursor-pointer"
						>
							{loading ? (
								<>
									<Loader2 className="mr-2 animate-spin" size={16} />
									Recognizing...
								</>
							) : (
								<>
									<Banknote className="mr-2" size={16} />
									Recognize Currency
								</>
							)}
						</Button>
					</div>
				</div>
				<div className="flex justify-center w-full">
					<div className="bg-[#27324b] mx-auto p-4 rounded-3xl w-full max-w-2xl min-h-[60dvh]">
						<div className="flex sm:flex-row flex-col justify-center items-center gap-2 mb-6">
							<p className="mt-5 font-bold text-white text-xl md:text-2xl text-center">Prediction Result</p>
						</div>
						{loading ? (
							<div className="flex flex-col gap-y-2">
								{/* Skeleton - Main Prediction */}
								<div className="bg-[#1a2332] p-4 rounded-xl animate-pulse">
									<div className="flex items-center mb-2">
										<div className="bg-gray-700 mr-2 rounded w-5 h-5"></div>
										<div className="bg-gray-700 rounded w-40 h-5"></div>
									</div>
									<div className="bg-gray-700 mb-2 rounded w-32 h-6"></div>
									<div className="bg-gray-700 rounded w-24 h-4"></div>
								</div>

								{/* Skeleton - Basic Information */}
								<div className="bg-[#1a2332] p-4 rounded-xl animate-pulse">
									<div className="flex items-center mb-3">
										<div className="bg-gray-700 mr-2 rounded w-5 h-5"></div>
										<div className="bg-gray-700 rounded w-36 h-5"></div>
									</div>

									<div className="gap-2 grid grid-cols-1 text-sm">
										{Array.from({ length: 6 }).map((_, i) => (
											<div key={i} className="flex justify-between">
												<div className="bg-gray-700 rounded w-20 h-4"></div>
												<div className="bg-gray-700 rounded w-28 h-4"></div>
											</div>
										))}
									</div>
								</div>
							</div>
						) : (<>
							{data === null ? (
								<div className="flex flex-col justify-center items-center h-[70%] text-center">
									<Banknote className="mb-4 text-gray-400" size={48} />
									<p className="text-gray-400 text-center">Upload an image to get currency predictions</p>
								</div>
							) : notNote ? (
								<div className="flex flex-col justify-center items-center h-full">
									<AlertCircleIcon className="mb-4 text-red-400" size={48} />
									<p className="font-medium text-red-400 text-center">This is not a currency note.</p>
									<p className="mt-2 text-gray-400 text-sm text-center">Please upload an image of a banknote.</p>
								</div>
							) : (
								<CurrencyDetails data={data} geminiLoading={geminiLoading} />
							)}
						</>)}
					</div>
				</div>
			</div >
		</>
	)
}

const CurrencyDetails = ({ data, geminiLoading }: { data: CurrencyData; geminiLoading: boolean }) => {
	const gemini = data.geminiData;
	const [more, setMore] = useState(false);
	return (
		<div className="space-y-4 text-white">
			{/* Main Prediction */}
			<div className="bg-[#1a2332] p-4 rounded-xl">
				<h3 className="flex items-center mb-2 font-semibold text-lg">
					<Banknote className="mr-2" size={20} />
					Currency Identified
				</h3>
				<p className="font-bold text-green-400 text-2xl">{data.prediction}</p>
				{data.confidence && (
					<p className="mt-1 text-gray-300 text-sm">
						Confidence: {data.confidence.toFixed(1)}%
					</p>
				)}
			</div>

			{/* Gemini Loading State */}
			{geminiLoading && (
				<div className="bg-[#1a2332] p-4 rounded-xl">
					<div className="flex justify-center items-center">
						<Loader2 className="mr-2 animate-spin" size={20} />
						<p className="text-blue-400">Getting detailed information...</p>
					</div>
				</div>
			)}

			{/* Basic Information from Gemini */}
			{gemini && (
				<div className="bg-[#1a2332] p-4 rounded-xl">
					<h3 className="flex items-center mb-3 font-semibold text-lg">
						<Globe className="mr-2" size={20} />
						Basic Information
					</h3>
					<div className="gap-2 grid grid-cols-1 text-sm">
						{gemini.country && gemini.country !== "Not available" && (
							<div className="flex justify-between">
								<span className="text-gray-300">Country:</span>
								<span className="font-medium">{gemini.country}</span>
							</div>
						)}
						{gemini.currency_code && gemini.currency_code !== "Not available" && (
							<div className="flex justify-between">
								<span className="text-gray-300">Currency Code:</span>
								<span className="font-medium">{gemini.currency_code}</span>
							</div>
						)}
						{gemini.denomination && gemini.denomination !== "Not available" && (
							<div className="flex justify-between">
								<span className="text-gray-300">Denomination:</span>
								<span className="font-medium">{gemini.denomination}</span>
							</div>
						)}
						{gemini.year && gemini.year !== "Not available" && (
							<div className="flex justify-between">
								<span className="text-gray-300">Year:</span>
								<span className="font-medium">{gemini.year}</span>
							</div>
						)}
						{gemini.series && gemini.series !== "Not available" && (
							<div className="flex justify-between">
								<span className="text-gray-300">Series:</span>
								<span className="font-medium">{gemini.series}</span>
							</div>
						)}
						{gemini.dimensions && gemini.dimensions !== "Not available" && (
							<div className="flex justify-between">
								<span className="text-gray-300">Dimensions:</span>
								<span className="font-medium">{gemini.dimensions}</span>
							</div>
						)}
						{gemini.exchange_rate && gemini.exchange_rate !== "Not available" && (
							<div className="flex justify-between">
								<span className="text-gray-300">Exchange Rate:</span>
								<span className="font-medium">{gemini.exchange_rate}</span>
							</div>
						)}
					</div>
				</div>
			)}

			{/* Security Features */}
			{more && gemini?.security_features && gemini.security_features.length > 0 && (
				<div className="bg-[#1a2332] p-4 rounded-xl">
					<h3 className="flex items-center mb-3 font-semibold text-lg">
						<Shield className="mr-2" size={20} />
						Security Features
					</h3>
					<ul className="space-y-1 text-sm">
						{gemini.security_features.map((feature, index) => (
							<li key={index} className="flex items-center">
								<span className="flex-shrink-0 bg-green-400 mr-2 rounded-full w-2 h-2"></span>
								{feature}
							</li>
						))}
					</ul>
				</div>
			)}

			{/* Physical Properties */}
			{more && gemini && (gemini.material || gemini.color_scheme) && (
				<div className="bg-[#1a2332] p-4 rounded-xl">
					<h3 className="flex items-center mb-3 font-semibold text-lg">
						<Info className="mr-2" size={20} />
						Physical Properties
					</h3>
					<div className="space-y-2 text-sm">
						{gemini.material && gemini.material !== "Not available" && (
							<div>
								<span className="text-gray-300">Material: </span>
								<span className="font-medium">{gemini.material}</span>
							</div>
						)}
						{gemini.color_scheme && gemini.color_scheme.length > 0 && (
							<div>
								<span className="text-gray-300">Color Scheme: </span>
								<span className="font-medium">{gemini.color_scheme.join(', ')}</span>
							</div>
						)}
					</div>
				</div>
			)}

			{/* Description */}
			{more && gemini?.description && gemini.description !== "Not available" && (
				<div className="bg-[#1a2332] p-4 rounded-xl">
					<h3 className="mb-3 font-semibold text-lg">Description</h3>
					<p className="text-gray-300 text-sm leading-relaxed">{gemini.description}</p>
				</div>
			)}

			{/* Historical Information */}
			{more && gemini?.historical_info && gemini.historical_info !== "Not available" && (
				<div className="bg-[#1a2332] p-4 rounded-xl">
					<h3 className="flex items-center mb-3 font-semibold text-lg">
						<Calendar className="mr-2" size={20} />
						Historical Context
					</h3>
					<p className="text-gray-300 text-sm leading-relaxed">{gemini.historical_info}</p>
				</div>
			)}

			{!geminiLoading && (
				<>
					{more ? (
						<Button onClick={() => setMore(false)}>Show Less</Button>
					) : (
						<Button onClick={() => setMore(true)}>Show More</Button>
					)}
				</>
			)}

		</div>
	)
}

function ImageUpload({ setFile }: { setFile: React.Dispatch<React.SetStateAction<File | null>> }) {
	const maxSizeMB = 15
	const maxSize = maxSizeMB * 1024 * 1024 // 15MB default

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
	useEffect(() => {
		const f = files[0]?.file
		if (f instanceof File) {
			setFile(f)
		} else {
			setFile(null)
		}
	}, [files, setFile])

	return (
		<div className="flex flex-col justify-center items-center gap-2 w-full">
			<div className="relative mt-[2rem] w-[80%]">
				{/* Drop area */}
				<div
					onDragEnter={handleDragEnter}
					onDragLeave={handleDragLeave}
					onDragOver={handleDragOver}
					onDrop={handleDrop}
					data-dragging={isDragging || undefined}
					className="relative flex flex-col justify-center items-center data-[dragging=true]:bg-accent/50 p-4 border border-input has-[input:focus]:border-ring border-dashed rounded-xl has-[input:focus]:ring-[3px] has-[input:focus]:ring-ring/50 min-h-52 overflow-hidden transition-colors"
				>
					<input
						{...getInputProps()}
						className="sr-only"
						aria-label="Upload image file"
					/>
					{previewUrl ? (
						<div className="absolute inset-0 flex justify-center items-center p-4">
							<img
								src={previewUrl}
								alt={files[0]?.file?.name || "Uploaded image"}
								className="mx-auto rounded max-h-full object-contain"
							/>
						</div>
					) : (
						<div className="flex flex-col justify-center items-center px-4 py-3 text-center">
							<div
								className="flex justify-center items-center bg-background mb-2 border rounded-full size-11 shrink-0"
								aria-hidden="true"
							>
								<ImageIcon className="opacity-60 size-4 text-black" />
							</div>
							<p className="mb-1.5 font-medium text-sm">Drop your image here</p>
							<p className="text-muted-foreground text-xs">
								SVG, PNG, JPG or GIF (max. {maxSizeMB}MB)
							</p>
							<Button
								variant="outline"
								className="hover:bg-accent/50 mt-4 text-black hover:cursor-pointer"
								onClick={openFileDialog}
							>
								<UploadIcon
									className="opacity-60 -ms-1 size-4"
									aria-hidden="true"
								/>
								Select image
							</Button>
						</div>
					)}
				</div>

				{previewUrl && (
					<div className="top-4 right-4 absolute">
						<button
							type="button"
							className="z-50 flex justify-center items-center bg-black/60 hover:bg-black/80 focus-visible:border-ring rounded-full outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 size-8 text-white transition-[color,box-shadow] cursor-pointer"
							onClick={() => removeFile(files[0]?.id)}
							aria-label="Remove image"
						>
							<XIcon className="size-4" aria-hidden="true" />
						</button>
					</div>
				)}
			</div>

			{errors.length > 0 && (
				<div
					className="flex items-center gap-1 text-destructive text-xs"
					role="alert"
				>
					<AlertCircleIcon className="size-3 shrink-0" />
					<span>{errors[0]}</span>
				</div>
			)}
		</div>
	)
}

export default Currency