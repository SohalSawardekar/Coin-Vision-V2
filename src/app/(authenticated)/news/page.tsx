"use client";

import React, { useEffect, useState } from "react";
import {
	Loader2,
	Clock,
	User,
	ExternalLink,
	TrendingUp,
	Globe,
	Calendar,
	ArrowRight,
	DollarSign,
	Activity,
	AlertCircle
} from "lucide-react";

interface Article {
	id: number;
	title: string;
	author: string;
	createdAt: string;
	content: string;
	url: string;
}

export default function ArticlesPage() {
	const [articles, setArticles] = useState<Article[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string>('');

	useEffect(() => {
		const fetchNews = async () => {
			try {
				const res = await fetch("/api/articles");
				if (!res.ok) throw new Error("Failed to fetch news");
				const data = await res.json();
				setArticles(data);
			} catch (err) {
				console.error(err);
				setError('Failed to load articles');
			} finally {
				setLoading(false);
			}
		};
		fetchNews();
	}, []);

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		const now = new Date();
		const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

		if (diffInHours < 1) return 'Just now';
		if (diffInHours < 24) return `${diffInHours}h ago`;
		if (diffInHours < 48) return '1 day ago';
		return date.toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
		});
	};

	const getCategoryIcon = (title: string) => {
		if (title.toLowerCase().includes('crypto') || title.toLowerCase().includes('digital')) {
			return <Activity className="text-purple-400" size={16} />;
		}
		if (title.toLowerCase().includes('fed') || title.toLowerCase().includes('reserve')) {
			return <TrendingUp className="text-green-400" size={16} />;
		}
		if (title.toLowerCase().includes('euro') || title.toLowerCase().includes('ecb')) {
			return <Globe className="text-blue-400" size={16} />;
		}
		return <DollarSign className="text-yellow-400" size={16} />;
	};

	return (
		<div className="bg-[#0f1419] min-h-screen text-white">
			{/* Header */}
			<div className="bg-[#1a2332] border-gray-700 border-b">
				<div className="flex sm:flex-row flex-col justify-between items-start sm:items-center gap-2 sm:gap-0 mx-auto px-2 xs:px-4 sm:px-6 py-4 sm:py-6 max-w-full sm:max-w-6xl">
					<div>
						<h1 className="mb-2 font-bold text-white text-2xl xs:text-3xl">Currency News</h1>
						<p className="text-gray-400 text-sm xs:text-base">Stay updated with the latest financial market developments</p>
					</div>
					<div className="flex items-center gap-2 mt-2 sm:mt-0 text-gray-400 text-xs xs:text-sm">
						<Clock size={16} />
						<span>Updated {new Date().toLocaleString()}</span>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="mx-auto px-2 xs:px-4 sm:px-6 py-4 sm:py-6 max-w-full sm:max-w-6xl">
				{loading ? (
					<div className="flex flex-col justify-center items-center py-16 xs:py-20">
						<div className="bg-[#27324b] p-6 xs:p-8 rounded-2xl xs:rounded-3xl w-full max-w-xs xs:max-w-md sm:max-w-lg text-center">
							<div className="flex justify-center items-center mb-4">
								<Loader2 className="text-blue-400 animate-spin" size={32} />
							</div>
							<p className="text-gray-300 text-base xs:text-lg">Loading latest news...</p>
							<p className="mt-2 text-gray-500 text-xs xs:text-sm">Fetching the most recent currency updates</p>
						</div>
					</div>
				) : error && articles.length === 0 ? (
					<div className="flex flex-col justify-center items-center py-16 xs:py-20">
						<div className="bg-[#27324b] p-6 xs:p-8 rounded-2xl xs:rounded-3xl w-full max-w-xs xs:max-w-md sm:max-w-lg text-center">
							<AlertCircle className="mx-auto mb-4 text-red-400" size={48} />
							<h2 className="mb-2 font-semibold text-red-400 text-lg xs:text-xl">Failed to Load Articles</h2>
							<p className="text-gray-400 text-sm xs:text-base">Unable to fetch the latest currency news</p>
							<button
								onClick={() => window.location.reload()}
								className="bg-blue-600 hover:bg-blue-700 mt-4 px-4 py-2 rounded-lg font-medium transition-colors"
							>
								Try Again
							</button>
						</div>
					</div>
				) : articles.length > 0 ? (
					<div className="space-y-6">
						{/* Featured Article */}
						{articles[0] && (
							<div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 p-4 xs:p-6 border-2 border-blue-500/30 rounded-2xl xs:rounded-3xl">
								<div className="flex items-center gap-2 mb-3">
									<TrendingUp className="text-blue-400" size={20} />
									<span className="font-semibold text-blue-400 text-xs xs:text-sm uppercase tracking-wide">Featured Story</span>
								</div>
								<h2 className="mb-3 font-bold text-white text-xl xs:text-2xl leading-tight">
									{articles[0].title}
								</h2>
								<div className="flex flex-wrap items-center gap-2 xs:gap-4 mb-4 text-gray-400 text-xs xs:text-sm">
									<div className="flex items-center gap-1">
										<User size={14} />
										<span>{articles[0].author}</span>
									</div>
									<div className="flex items-center gap-1">
										<Calendar size={14} />
										<span>{formatDate(articles[0].createdAt)}</span>
									</div>
								</div>
								<p className="mb-4 text-gray-300 text-base xs:text-lg leading-relaxed">
									{articles[0].content}
								</p>
								<a
									href={articles[0].url}
									target="_blank"
									rel="noopener noreferrer"
									className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium text-white transition-colors"
								>
									Read Full Article
									<ExternalLink size={16} />
								</a>
							</div>
						)}

						{/* Regular Articles Grid */}
						<div className="gap-4 xs:gap-6 grid grid-cols-1 md:grid-cols-2">
							{articles.slice(1).map((article) => (
								<article key={article.id} className="group bg-[#27324b] hover:bg-[#2d3a52] p-4 xs:p-6 border border-gray-600 hover:border-gray-500 rounded-2xl xs:rounded-3xl transition-all duration-200">
									<div className="flex justify-between items-start mb-3">
										<div className="flex items-center gap-2">
											{getCategoryIcon(article.title)}
											<span className="font-semibold text-[10px] text-gray-400 xs:text-xs uppercase tracking-wide">
												Market News
											</span>
										</div>
										<div className="text-[10px] text-gray-500 xs:text-xs">
											{formatDate(article.createdAt)}
										</div>
									</div>

									<h2 className="mb-3 font-bold text-white group-hover:text-blue-300 text-base xs:text-xl leading-tight transition-colors">
										{article.title}
									</h2>

									<div className="flex items-center gap-1 xs:gap-2 mb-2 xs:mb-4 text-gray-400 text-xs xs:text-sm">
										<User size={12} />
										<span>{article.author}</span>
									</div>

									<p className="mb-4 text-gray-300 text-xs xs:text-sm line-clamp-3 leading-relaxed">
										{article.content}
									</p>

									<a
										href={article.url}
										target="_blank"
										rel="noopener noreferrer"
										className="group inline-flex items-center gap-2 font-medium text-blue-400 hover:text-blue-300 text-xs xs:text-sm transition-colors"
									>
										<span>Read more</span>
										<ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
									</a>
								</article>
							))}
						</div>
					</div>
				) : (
					<div className="flex flex-col justify-center items-center py-16 xs:py-20">
						<div className="bg-[#27324b] p-6 xs:p-8 rounded-2xl xs:rounded-3xl w-full max-w-xs xs:max-w-md sm:max-w-lg text-center">
							<Globe className="mx-auto mb-4 text-gray-400" size={48} />
							<h2 className="mb-2 font-semibold text-gray-300 text-lg xs:text-xl">No Articles Available</h2>
							<p className="text-gray-500 text-sm xs:text-base">Check back later for the latest currency news</p>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}