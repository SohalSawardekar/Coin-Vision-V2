/* eslint-disable @next/next/no-img-element */
'use client'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useFileUpload } from '@/hooks/use-file-upload'
import {
	AlertCircleIcon,
	Banknote,
	ImageIcon,
	Loader2,
	UploadIcon,
	XIcon,
	CheckCircle,
	AlertTriangle,
	XCircle,
	Star,
	TrendingUp,
	DollarSign,
	Eye,
	Shield
} from 'lucide-react'
import React, { useEffect, useState } from 'react'

interface ConditionData {
	overall_condition: string;
	condition_score: number;
	physical_damage: {
		tears: string;
		holes: string;
		creases: string;
		stains: string;
		fading: string;
	};
	structural_integrity: string;
	collectible_value: string;
	marketability: string;
	preservation_tips: string[];
	detailed_assessment: string;
}

const NoteConditionPage = () => {
	const [file, setFile] = useState<File | null>(null)
	const [loading, setLoading] = useState(false)
	const [data, setData] = useState<ConditionData | null>(null)
	const [rawResponse, setRawResponse] = useState<string>('')
	const [notNote, setNotNote] = useState(false);

	const handleRecognize = async () => {
		if (!file) return;

		const formData = new FormData();
		formData.append('file', file);

		setLoading(true);
		setData(null);
		setRawResponse('');

		try {
			// Step 1: Verify image
			const res1 = await fetch("/api/recognise", {
				method: 'POST',
				body: formData,
			});
			const res1Data = await res1.json();

			if (res1Data.result !== "True") {
				setNotNote(true);
				setRawResponse("This is not a currency note.");
				return;
			}

			const res = await fetch("/api/note-condition", {
				method: "POST",
				body: formData,
			});

			if (!res.ok) throw new Error(`API returned ${res.status}`);
			const result = await res.json();

			// Enhanced prompt for detailed analysis
			const enhancedFormData = new FormData();
			enhancedFormData.append('file', file);

			const detailedRes = await fetch("/api/note-condition", {
				method: "POST",
				body: enhancedFormData,
			});

			if (detailedRes.ok) {
				const detailedResult = await detailedRes.json();
				if (detailedResult.data) {
					setData(detailedResult.data);
				} else {
					setRawResponse(detailedResult.result || result.result);
				}
			} else {
				setRawResponse(result.result);
			}
		} catch (err) {
			setRawResponse("Error: " + (err as Error).message);
		} finally {
			setLoading(false);
		}
	}

	return (
		<>
			<div className="flex mb-6 ml-0 md:ml-[3rem] px-4 md:px-0 w-full">
				<p className="font-semibold text-white text-2xl text-left">Note Condition Assessment</p>
			</div>
			<div className="justify-center items-start gap-8 grid grid-cols-1 md:grid-cols-2 px-2 md:px-4 w-full">
				<div className="flex justify-center w-full">
					<div className="flex flex-col justify-start items-center gap-y-4 w-full max-w-md">
						<ImageUpload setFile={setFile} />
						<Button
							onClick={handleRecognize}
							disabled={loading || !file}
							className="bg-secondary hover:bg-white/60 w-full sm:w-auto max-w-[200px] text-primary transition-all duration-200 hover:cursor-pointer"
						>
							{loading ? (
								<>
									<Loader2 className="mr-2 animate-spin" size={16} />
									Assessing...
								</>
							) : (
								<>
									<Banknote className="mr-2" size={16} />
									Assess Condition
								</>
							)}
						</Button>
					</div>
				</div>
				<div className="flex justify-center w-full">
					<div className="bg-[#27324b] mx-auto p-4 md:p-6 rounded-3xl w-full max-w-2xl min-h-[60dvh]">
						<div className="flex sm:flex-row flex-col justify-center items-center gap-2 mb-6">
							<p className="font-bold text-white text-xl md:text-2xl text-center">Assessment Results</p>
						</div>

						{loading ? (
							<div className="space-y-4 text-white">
								{/* Overall Condition */}
								<div className="bg-[#1a2332] p-4 border border-gray-700 rounded-xl">
									<div className="flex justify-between items-center mb-3">
										<h3 className="flex items-center font-semibold text-lg">
											<Skeleton className="mr-2 rounded-full w-5 h-5" />
											<Skeleton className="rounded w-32 h-5" />
										</h3>
										<Skeleton className="rounded-full w-20 h-6" />
									</div>
									<Skeleton className="rounded w-28 h-6" />
								</div>

								{/* Physical Damage Assessment */}
								<div className="bg-[#1a2332] p-4 border border-gray-700 rounded-xl">
									<div className="flex items-center mb-3 font-semibold text-lg">
										<Skeleton className="mr-2 rounded-full w-5 h-5" />
										<Skeleton className="rounded w-48 h-5" />
									</div>
									<div className="gap-3 grid grid-cols-1 text-sm">
										{[...Array(3)].map((_, i) => (
											<div key={i} className="flex flex-col">
												<Skeleton className="mb-1 rounded w-32 h-4" />
												<Skeleton className="rounded w-24 h-4" />
											</div>
										))}
									</div>
								</div>

								{/* Structural Integrity */}
								<div className="bg-[#1a2332] p-4 border border-gray-700 rounded-xl">
									<div className="flex items-center mb-3 font-semibold text-lg">
										<Skeleton className="mr-2 rounded-full w-5 h-5" />
										<Skeleton className="rounded w-40 h-5" />
									</div>
									<Skeleton className="rounded w-full h-12" />
								</div>

								{/* Value Assessment */}
								<div className="gap-4 grid grid-cols-1 md:grid-cols-2">
									{[...Array(2)].map((_, i) => (
										<div key={i} className="bg-[#1a2332] p-4 border border-gray-700 rounded-xl">
											<div className="flex items-center mb-3 font-semibold text-lg">
												<Skeleton className="mr-2 rounded-full w-5 h-5" />
												<Skeleton className="rounded w-36 h-5" />
											</div>
											<Skeleton className="rounded w-full h-10" />
										</div>
									))}
								</div>
							</div>
						) : (
							<>
								{notNote && (
									<div className="flex flex-col justify-center items-center h-[70%] text-center">
										<Banknote className="mb-4 text-gray-400" size={48} />
										<p className="text-gray-400">This is not a currency note.</p>
									</div>
								)}
								{!notNote && !data && !rawResponse ? (
									<div className="flex flex-col justify-center items-center h-[70%] text-center">
										<Banknote className="mb-4 text-gray-400" size={48} />
										<p className="text-gray-400 text-center">Upload a currency note image to assess its condition</p>
										<p className="mt-2 text-gray-500 text-sm">Our AI will analyze physical damage, value, and marketability</p>
									</div>
								) : data ? (
									<ConditionDetails data={data} />
								) : (
									<div className="bg-[#1a2332] p-3 rounded-xl">
										<h3 className="mb-3 font-semibold text-white text-lg">Basic Assessment</h3>
										<p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{rawResponse}</p>
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

const ConditionDetails = ({ data }: { data: ConditionData }) => {
	const getConditionColor = (condition: string) => {
		const lowerCondition = condition.toLowerCase();
		if (lowerCondition.includes('excellent') || lowerCondition.includes('uncirculated') || lowerCondition.includes('mint')) {
			return 'text-green-400';
		} else if (lowerCondition.includes('very fine') || lowerCondition.includes('good')) {
			return 'text-blue-400';
		} else if (lowerCondition.includes('fine') || lowerCondition.includes('fair')) {
			return 'text-yellow-400';
		} else if (lowerCondition.includes('poor') || lowerCondition.includes('damaged')) {
			return 'text-red-400';
		}
		return 'text-gray-300';
	}

	const getConditionIcon = (condition: string) => {
		const lowerCondition = condition.toLowerCase();
		if (lowerCondition.includes('excellent') || lowerCondition.includes('uncirculated')) {
			return <CheckCircle className="text-green-400" size={20} />;
		} else if (lowerCondition.includes('good') || lowerCondition.includes('very fine')) {
			return <Star className="text-blue-400" size={20} />;
		} else if (lowerCondition.includes('fair') || lowerCondition.includes('fine')) {
			return <AlertTriangle className="text-yellow-400" size={20} />;
		} else if (lowerCondition.includes('poor') || lowerCondition.includes('damaged')) {
			return <XCircle className="text-red-400" size={20} />;
		}
		return <Eye className="text-gray-400" size={20} />;
	}

	const getScoreColor = (score: number) => {
		if (score >= 80) return 'text-green-400 bg-green-400/10';
		if (score >= 60) return 'text-blue-400 bg-blue-400/10';
		if (score >= 40) return 'text-yellow-400 bg-yellow-400/10';
		return 'text-red-400 bg-red-400/10';
	}

	return (
		<div className="space-y-4 text-white">
			{/* Overall Condition */}
			<div className="bg-[#1a2332] p-4 border border-gray-700 rounded-xl">
				<div className="flex justify-between items-center mb-3">
					<h3 className="flex items-center font-semibold text-lg">
						{getConditionIcon(data.overall_condition)}
						<span className="ml-2">Overall Condition</span>
					</h3>
					{data.condition_score && (
						<div className={`px-3 py-1 rounded-full text-sm font-bold ${getScoreColor(data.condition_score)}`}>
							{data.condition_score}/100
						</div>
					)}
				</div>
				<p className={`text-xl font-bold ${getConditionColor(data.overall_condition)}`}>
					{data.overall_condition}
				</p>
			</div>

			{/* Physical Damage Assessment */}
			{data.physical_damage && (
				<div className="bg-[#1a2332] p-4 border border-gray-700 rounded-xl">
					<h3 className="flex items-center mb-3 font-semibold text-lg">
						<AlertTriangle className="mr-2 text-orange-400" size={20} />
						Physical Damage Analysis
					</h3>
					<div className="gap-3 grid grid-cols-1 text-sm">
						{Object.entries(data.physical_damage).map(([key, value]) => {
							if (value && value !== "None" && value !== "Not available") {
								const severity = value.toLowerCase();
								const isMinor = severity.includes('minor') || severity.includes('light') || severity.includes('minimal');
								const isMajor = severity.includes('major') || severity.includes('severe') || severity.includes('extensive');

								return (
									<div key={key} className="flex flex-col justify-between">
										<span className="font-semibold text-gray-300 capitalize">{key.replace('_', ' ')}:</span>
										<span className={`font-medium ${isMinor ? 'text-yellow-400' :
											isMajor ? 'text-red-400' :
												'text-gray-300'
											}`}>
											{value}
										</span>
									</div>
								);
							}
							return null;
						})}
					</div>
				</div>
			)}

			{/* Structural Integrity */}
			{data.structural_integrity && data.structural_integrity !== "Not available" && (
				<div className="bg-[#1a2332] p-4 border border-gray-700 rounded-xl">
					<h3 className="flex items-center mb-3 font-semibold text-lg">
						<Shield className="mr-2 text-blue-400" size={20} />
						Structural Integrity
					</h3>
					<p className="text-gray-300 leading-relaxed">{data.structural_integrity}</p>
				</div>
			)}

			{/* Value Assessment */}
			<div className="gap-4 grid grid-cols-1 md:grid-cols-2">
				{data.collectible_value && data.collectible_value !== "Not available" && (
					<div className="bg-[#1a2332] p-4 border border-gray-700 rounded-xl">
						<h3 className="flex items-center mb-3 font-semibold text-lg">
							<TrendingUp className="mr-2 text-green-400" size={20} />
							Collectible Value
						</h3>
						<p className="text-gray-300 text-sm leading-relaxed">{data.collectible_value}</p>
					</div>
				)}

				{data.marketability && data.marketability !== "Not available" && (
					<div className="bg-[#1a2332] p-4 border border-gray-700 rounded-xl">
						<h3 className="flex items-center mb-3 font-semibold text-lg">
							<DollarSign className="mr-2 text-yellow-400" size={20} />
							Marketability
						</h3>
						<p className="text-gray-300 text-sm leading-relaxed">{data.marketability}</p>
					</div>
				)}
			</div>

			{/* Preservation Tips */}
			{data.preservation_tips && data.preservation_tips.length > 0 && (
				<div className="bg-[#1a2332] p-4 border border-gray-700 rounded-xl">
					<h3 className="flex items-center mb-3 font-semibold text-lg">
						<Shield className="mr-2 text-purple-400" size={20} />
						Preservation Recommendations
					</h3>
					<ul className="space-y-2 text-sm">
						{data.preservation_tips.map((tip, index) => (
							<li key={index} className="flex items-start">
								<span className="flex-shrink-0 bg-purple-400 mt-2 mr-3 rounded-full w-2 h-2"></span>
								<span className="text-gray-300">{tip}</span>
							</li>
						))}
					</ul>
				</div>
			)}

			{/* Detailed Assessment */}
			{data.detailed_assessment && data.detailed_assessment !== "Not available" && (
				<div className="bg-[#1a2332] p-4 border border-gray-700 rounded-xl">
					<h3 className="flex items-center mb-3 font-semibold text-lg">
						<Eye className="mr-2 text-cyan-400" size={20} />
						Detailed Assessment
					</h3>
					<p className="text-gray-300 text-sm leading-relaxed">{data.detailed_assessment}</p>
				</div>
			)}
		</div>
	);
};

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
			<div className="relative mt-[2rem] w-[100%]">
				{/* Drop area */}
				<div
					onDragEnter={handleDragEnter}
					onDragLeave={handleDragLeave}
					onDragOver={handleDragOver}
					onDrop={handleDrop}
					data-dragging={isDragging || undefined}
					className="relative flex flex-col justify-center items-center data-[dragging=true]:bg-accent/50 p-6 border-2 border-input hover:border-gray-400 has-[input:focus]:border-ring border-dashed rounded-xl has-[input:focus]:ring-[3px] has-[input:focus]:ring-ring/50 min-h-64 overflow-hidden transition-all duration-200"
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
								className="shadow-lg mx-auto rounded-lg max-h-full object-contain"
							/>
						</div>
					) : (
						<div className="flex flex-col justify-center items-center px-4 py-6 text-center">
							<div
								className="flex justify-center items-center bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg mb-4 rounded-full size-16 shrink-0"
								aria-hidden="true"
							>
								<ImageIcon className="size-8 text-white" />
							</div>
							<p className="mb-2 font-semibold text-gray-700 text-lg">Drop your currency note here</p>
							<p className="mb-4 text-muted-foreground text-sm">
								SVG, PNG, JPG or GIF (max. {maxSizeMB}MB)
							</p>
							<Button
								variant="outline"
								className="hover:bg-accent/50 border-2 hover:border-blue-400 text-black transition-all duration-200 hover:cursor-pointer"
								onClick={openFileDialog}
							>
								<UploadIcon
									className="opacity-60 -ms-1 size-4"
									aria-hidden="true"
								/>
								Select Image
							</Button>
						</div>
					)}
				</div>

				{previewUrl && (
					<div className="top-4 right-4 absolute">
						<button
							type="button"
							className="z-50 flex justify-center items-center bg-red-500/80 hover:bg-red-600 shadow-lg focus-visible:border-ring rounded-full outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 size-10 text-white transition-all duration-200 cursor-pointer"
							onClick={() => removeFile(files[0]?.id)}
							aria-label="Remove image"
						>
							<XIcon className="size-5" aria-hidden="true" />
						</button>
					</div>
				)}
			</div>

			{errors.length > 0 && (
				<div
					className="flex items-center gap-2 bg-red-500/10 p-3 border border-red-500/20 rounded-lg text-red-400 text-sm"
					role="alert"
				>
					<AlertCircleIcon className="size-4 shrink-0" />
					<span>{errors[0]}</span>
				</div>
			)}
		</div>
	)
}

export default NoteConditionPage