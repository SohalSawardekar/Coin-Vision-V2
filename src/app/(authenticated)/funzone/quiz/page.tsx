'use client';

import React, { useState } from "react";
import { generateQuiz } from "@/utils/generateQuiz";
import QuizBox from "@/components/QuizBox";

type QuizQuestion = {
	question: string;
	options: string[];
	answer: string;
};

export default function QuizPage() {
	const [questions, setQuestions] = useState<QuizQuestion[]>([]);
	const [loading, setLoading] = useState(false);

	const handleGenerate = async () => {
		setLoading(true);
		try {
			const quiz = await generateQuiz();
			setQuestions(quiz);
		} catch (err) {
			console.error("Quiz generation failed", err);
			alert("Quiz generation failed");
		} finally {
			setLoading(false);
		}
	};

	return (
		<main className="flex justify-center items-center bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 p-6 min-h-screen">
			<div className="bg-white/10 shadow-2xl backdrop-blur-xl p-10 border border-white/20 rounded-2xl w-full max-w-3xl text-center">
				<h1 className="drop-shadow-lg mb-8 font-extrabold text-white text-4xl">
					🧠 Currency Quiz
				</h1>

				<button
					onClick={handleGenerate}
					className="bg-gradient-to-r from-green-500 hover:from-emerald-500 to-emerald-500 hover:to-green-500 shadow-lg hover:shadow-emerald-500/50 px-8 py-3 rounded-lg font-semibold text-white text-lg transition-all duration-300"
					disabled={loading}
				>
					{loading ? "Generating..." : "🚀 Generate Quiz"}
				</button>

				{questions.length > 0 && (
					<div className="mt-10">
						<QuizBox questions={questions} />
					</div>
				)}
			</div>
		</main>
	);
}
