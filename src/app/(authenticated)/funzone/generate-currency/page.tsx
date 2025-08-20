"use client";
import { useState } from "react";

export default function Home() {
	const [prompt, setPrompt] = useState("");
	const [imageUrl, setImageUrl] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleGenerate = async () => {
		setLoading(true);
		setError(null);

		try {
			const res = await fetch("/api/generate-image", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ prompt }),
			});

			const data = await res.json();

			if (!res.ok) {
				throw new Error(data.error || "Unknown error");
			}

			setImageUrl(data.imageUrl);
		} catch (err: any) {
			console.error(err);
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<main className="flex justify-center items-center bg-gradient-to-br from-gray-900 via-indigo-900 to-sky-900 p-6 min-h-screen">
			<div className="bg-white/10 shadow-2xl backdrop-blur-xl p-8 border border-white/20 rounded-2xl w-full max-w-2xl text-white">
				<h1 className="drop-shadow-lg mb-6 font-bold text-3xl text-center">
					💰 Currency Redesign Generator
				</h1>

				<textarea
					className="bg-white/20 mb-4 px-4 py-3 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 w-full text-white transition resize-none placeholder-white/60"
					rows={4}
					placeholder="Describe your futuristic currency idea..."
					value={prompt}
					onChange={(e) => setPrompt(e.target.value)}
				/>

				<button
					onClick={handleGenerate}
					disabled={loading}
					className="bg-gradient-to-r from-blue-500 hover:from-indigo-600 to-indigo-500 hover:to-blue-600 disabled:opacity-50 shadow-lg hover:shadow-blue-500/50 py-3 rounded-lg w-full font-semibold transition-all duration-300 disabled:cursor-not-allowed"
				>
					{loading ? "Generating..." : "Generate Image"}
				</button>

				{error && <p className="mt-4 text-red-400 text-center">{error}</p>}

				{imageUrl && (
					<div className="mt-6 animate-fadeIn">
						<img
							src={imageUrl}
							alt="Generated currency"
							className="shadow-lg border border-white/30 rounded-xl hover:scale-105 transition-transform duration-500"
						/>
					</div>
				)}
			</div>
		</main>
	);
}
