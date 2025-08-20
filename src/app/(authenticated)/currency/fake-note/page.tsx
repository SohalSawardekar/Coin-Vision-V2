/* eslint-disable @next/next/no-img-element */
'use client'
import { Button } from '@/components/ui/button'
import { useFileUpload } from '@/hooks/use-file-upload'
import {
	AlertCircleIcon,
	Banknote,
	Loader2,
	UploadIcon,
	XIcon,
	CheckCircle,
	AlertTriangle,
	XCircle,
	Shield,
	Eye,
	Search,
	Zap,
	Award,
	Lock,
	Fingerprint
} from 'lucide-react'
import React, { useEffect, useState } from 'react'

interface AuthenticityData {
	authenticity_status: string;
	confidence_score: number;
	security_features: {
		watermark: string;
		security_thread: string;
		microprinting: string;
		color_changing_ink: string;
		raised_printing: string;
		uv_features: string;
	};
	paper_quality: string;
	printing_quality: string;
	serial_number_analysis: string;
	overall_assessment: string;
	red_flags: string[];
	authentication_tips: string[];
	detailed_analysis: string;
}

const FakeNoteDetection = () => {
	const [file, setFile] = useState<File | null>(null)
	const [loading, setLoading] = useState(false)
	const [data, setData] = useState<AuthenticityData | null>(null)
	const [rawResponse, setRawResponse] = useState<string>('')
	const [notNote, setNotNote] = useState(false);

	const handleAnalyze = async () => {
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
				console.log(res1Data)
				return;
			}

			// Call the detailed fake detection API
			const detailedRes = await fetch("/api/fake-note-detection", {
				method: "POST",
				body: formData,
			});

			if (detailedRes.ok) {
				const result = await detailedRes.json();
				if (result.data) {
					setData(result.data);
				} else {
					setRawResponse(result.result || 'Analysis completed');
				}
			} else {
				throw new Error(`API returned ${detailedRes.status}`);
			}
		} catch (err) {
			setRawResponse("Error: " + (err as Error).message);
		} finally {
			setLoading(false);
		}
	}

	return (
		<>
			<div className="flex mb-6 ml-[3rem] w-full">
				<p className="font-semibold text-white text-2xl text-left">Fake Note Detection</p>
			</div>
			<div className='justify-center items-start gap-8 grid grid-cols-2 px-4 w-full'>
				<div className='flex justify-center'>
					<div className='flex flex-col justify-start items-center gap-y-4 w-full max-w-md'>
						<ImageUpload setFile={setFile} />
						<Button
							onClick={handleAnalyze}
							disabled={loading || !file}
							className="bg-secondary hover:bg-white/60 max-w-[200px] text-primary transition-all duration-200 hover:cursor-pointer"
						>
							{loading ? (
								<>
									<Loader2 className="mr-2 animate-spin" size={16} />
									Analyzing...
								</>
							) : (
								<>
									<Shield className="mr-2" size={16} />
									Verify Authenticity
								</>
							)}
						</Button>
					</div>
				</div>
				<div className="flex justify-center">
					<div className="bg-[#27324b] p-6 rounded-3xl w-full min-h-[60dvh]">
						<div className="flex justify-center items-center mb-6">
							<p className="font-bold text-white text-2xl text-center">Authenticity Analysis</p>
							{loading && <Loader2 className="ml-3 text-blue-400 animate-spin" size={24} />}
						</div>
						{notNote && (
							<div className="flex flex-col justify-center items-center h-[70%] text-center">
								<Banknote className="mb-4 text-gray-400" size={48} />
								<p className="text-gray-400">This is not a currency note.</p>
							</div>
						)}
						{!notNote && !data && !rawResponse ? (
							<div className="flex flex-col justify-center items-center h-[70%] text-center">
								<Shield className="mb-4 text-gray-400" size={48} />
								<p className="text-gray-400 text-center">Upload a currency note to verify its authenticity</p>
								<p className="mt-2 text-gray-500 text-sm">Our AI will analyze security features and detect counterfeits</p>
							</div>
						) : data ? (
							<AuthenticityDetails data={data} />
						) : (
							<div className="bg-[#1a2332] p-3 rounded-xl">
								<h3 className="mb-3 font-semibold text-white text-lg">Basic Analysis</h3>
								<p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{rawResponse}</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</>
	)
}

const AuthenticityDetails = ({ data }: { data: AuthenticityData }) => {
	const getAuthenticityColor = (status: string) => {
		const lowerStatus = status.toLowerCase();
		if (lowerStatus.includes('authentic') || lowerStatus.includes('genuine') || lowerStatus.includes('real')) {
			return 'text-green-400';
		} else if (lowerStatus.includes('suspicious') || lowerStatus.includes('questionable')) {
			return 'text-yellow-400';
		} else if (lowerStatus.includes('fake') || lowerStatus.includes('counterfeit') || lowerStatus.includes('fraudulent')) {
			return 'text-red-400';
		}
		return 'text-gray-300';
	}

	const getAuthenticityIcon = (status: string) => {
		const lowerStatus = status.toLowerCase();
		if (lowerStatus.includes('authentic') || lowerStatus.includes('genuine')) {
			return <CheckCircle className="text-green-400" size={24} />;
		} else if (lowerStatus.includes('suspicious') || lowerStatus.includes('questionable')) {
			return <AlertTriangle className="text-yellow-400" size={24} />;
		} else if (lowerStatus.includes('fake') || lowerStatus.includes('counterfeit')) {
			return <XCircle className="text-red-400" size={24} />;
		}
		return <Shield className="text-gray-400" size={24} />;
	}

	const getConfidenceColor = (score: number) => {
		if (score >= 80) return 'text-green-400 bg-green-400/10';
		if (score >= 60) return 'text-blue-400 bg-blue-400/10';
		if (score >= 40) return 'text-yellow-400 bg-yellow-400/10';
		return 'text-red-400 bg-red-400/10';
	}

	const getFeatureStatus = (feature: string) => {
		const lowerFeature = feature.toLowerCase();
		if (lowerFeature.includes('present') || lowerFeature.includes('genuine') || lowerFeature.includes('authentic')) {
			return { color: 'text-green-400', icon: <CheckCircle size={16} className="text-green-400" /> };
		} else if (lowerFeature.includes('suspicious') || lowerFeature.includes('unclear')) {
			return { color: 'text-yellow-400', icon: <AlertTriangle size={16} className="text-yellow-400" /> };
		} else if (lowerFeature.includes('absent') || lowerFeature.includes('fake') || lowerFeature.includes('missing')) {
			return { color: 'text-red-400', icon: <XCircle size={16} className="text-red-400" /> };
		}
		return { color: 'text-gray-300', icon: <Eye size={16} className="text-gray-300" /> };
	}

	return (
		<div className="space-y-4 text-white">
			{/* Authenticity Status */}
			<div className="bg-[#1a2332] p-4 border-2 border-gray-700 rounded-xl">
				<div className="flex justify-between items-center mb-3">
					<h3 className="flex items-center font-semibold text-lg">
						{getAuthenticityIcon(data.authenticity_status)}
						<span className="ml-2">Authenticity Status</span>
					</h3>
					{data.confidence_score && (
						<div className={`px-3 py-1 rounded-full text-sm font-bold ${getConfidenceColor(data.confidence_score)}`}>
							{data.confidence_score}% Confidence
						</div>
					)}
				</div>
				<p className={`text-xl font-bold ${getAuthenticityColor(data.authenticity_status)}`}>
					{data.authenticity_status}
				</p>
			</div>

			{/* Security Features Analysis */}
			{data.security_features && (
				<div className="bg-[#1a2332] p-4 border border-gray-700 rounded-xl">
					<h3 className="flex items-center mb-3 font-semibold text-lg">
						<Lock className="mr-2 text-blue-400" size={20} />
						Security Features Analysis
					</h3>
					<div className="gap-3 grid grid-cols-1 text-sm">
						{Object.entries(data.security_features).map(([key, value]) => {
							if (value && value !== "Not analyzed" && value !== "Not available") {
								const { color, icon } = getFeatureStatus(value);
								return (
									<div key={key} className="flex justify-between items-center bg-[#0f1419] p-2 rounded-lg">
										<div className="flex items-center">
											{icon}
											<span className="ml-2 text-gray-300 capitalize">
												{key.replace('_', ' ')}:
											</span>
										</div>
										<span className={`font-medium ${color} text-right max-w-[60%]`}>
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

			{/* Quality Assessment */}
			<div className="gap-4 grid grid-cols-1 md:grid-cols-2">
				{data.paper_quality && data.paper_quality !== "Not available" && (
					<div className="bg-[#1a2332] p-4 border border-gray-700 rounded-xl">
						<h3 className="flex items-center mb-3 font-semibold text-lg">
							<Fingerprint className="mr-2 text-purple-400" size={20} />
							Paper Quality
						</h3>
						<p className="text-gray-300 text-sm leading-relaxed">{data.paper_quality}</p>
					</div>
				)}

				{data.printing_quality && data.printing_quality !== "Not available" && (
					<div className="bg-[#1a2332] p-4 border border-gray-700 rounded-xl">
						<h3 className="flex items-center mb-3 font-semibold text-lg">
							<Zap className="mr-2 text-orange-400" size={20} />
							Printing Quality
						</h3>
						<p className="text-gray-300 text-sm leading-relaxed">{data.printing_quality}</p>
					</div>
				)}
			</div>

			{/* Serial Number Analysis */}
			{data.serial_number_analysis && data.serial_number_analysis !== "Not available" && (
				<div className="bg-[#1a2332] p-4 border border-gray-700 rounded-xl">
					<h3 className="flex items-center mb-3 font-semibold text-lg">
						<Search className="mr-2 text-cyan-400" size={20} />
						Serial Number Analysis
					</h3>
					<p className="text-gray-300 text-sm leading-relaxed">{data.serial_number_analysis}</p>
				</div>
			)}

			{/* Red Flags */}
			{data.red_flags && data.red_flags.length > 0 && (
				<div className="bg-red-950/30 p-4 border border-red-500/30 rounded-xl">
					<h3 className="flex items-center mb-3 font-semibold text-lg">
						<AlertTriangle className="mr-2 text-red-400" size={20} />
						Security Concerns
					</h3>
					<ul className="space-y-2 text-sm">
						{data.red_flags.map((flag, index) => (
							<li key={index} className="flex items-start">
								<XCircle className="flex-shrink-0 mt-0.5 mr-2 text-red-400" size={14} />
								<span className="text-red-300">{flag}</span>
							</li>
						))}
					</ul>
				</div>
			)}

			{/* Authentication Tips */}
			{data.authentication_tips && data.authentication_tips.length > 0 && (
				<div className="bg-[#1a2332] p-4 border border-gray-700 rounded-xl">
					<h3 className="flex items-center mb-3 font-semibold text-lg">
						<Award className="mr-2 text-green-400" size={20} />
						Authentication Tips
					</h3>
					<ul className="space-y-2 text-sm">
						{data.authentication_tips.map((tip, index) => (
							<li key={index} className="flex items-start">
								<CheckCircle className="flex-shrink-0 mt-0.5 mr-2 text-green-400" size={14} />
								<span className="text-gray-300">{tip}</span>
							</li>
						))}
					</ul>
				</div>
			)}

			{/* Overall Assessment */}
			{data.overall_assessment && data.overall_assessment !== "Not available" && (
				<div className="bg-[#1a2332] p-4 border border-gray-700 rounded-xl">
					<h3 className="flex items-center mb-3 font-semibold text-lg">
						<Eye className="mr-2 text-indigo-400" size={20} />
						Overall Assessment
					</h3>
					<p className="text-gray-300 text-sm leading-relaxed">{data.overall_assessment}</p>
				</div>
			)}

			{/* Detailed Analysis */}
			{data.detailed_analysis && data.detailed_analysis !== "Not available" && (
				<div className="bg-[#1a2332] p-4 border border-gray-700 rounded-xl">
					<h3 className="flex items-center mb-3 font-semibold text-lg">
						<Search className="mr-2 text-teal-400" size={20} />
						Detailed Technical Analysis
					</h3>
					<p className="text-gray-300 text-sm leading-relaxed">{data.detailed_analysis}</p>
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
								className="flex justify-center items-center bg-gradient-to-br from-green-500 to-blue-600 shadow-lg mb-4 rounded-full size-16 shrink-0"
								aria-hidden="true"
							>
								<Shield className="size-8 text-white" />
							</div>
							<p className="mb-2 font-semibold text-gray-700 text-lg">Drop your currency note here</p>
							<p className="mb-4 text-muted-foreground text-sm">
								SVG, PNG, JPG or GIF (max. {maxSizeMB}MB)
							</p>
							<Button
								variant="outline"
								className="hover:bg-accent/50 border-2 hover:border-green-400 text-black transition-all duration-200 hover:cursor-pointer"
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

export default FakeNoteDetection