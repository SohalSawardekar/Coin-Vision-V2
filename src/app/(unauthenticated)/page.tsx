'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import {
	Eye,
	Shield,
	Activity,
	ArrowRightLeft,
	Newspaper,
	Gamepad2,
	MousePointer,
	Lock,
	Zap,
	CheckCircle,
	ArrowRight,
	Menu,
	X,
	Star,
	Users,
	Award,
	Globe,
	Camera,
	Smartphone,
	Server
} from 'lucide-react'


const features = [
	{
		icon: Eye,
		title: 'Currency Recognition',
		description: 'Instantly identify any currency from around the world using advanced AI image recognition technology.',
		highlight: 'AI-Powered'
	},
	{
		icon: Shield,
		title: 'Fake Note Detection',
		description: 'Detect counterfeit currency with 99.2% accuracy using deep learning algorithms and security feature analysis.',
		highlight: '99.2% Accuracy'
	},
	{
		icon: Activity,
		title: 'Note Condition Assessment',
		description: 'Evaluate currency condition and estimated value based on wear, damage, and collectibility factors.',
		highlight: 'Smart Analysis'
	},
	{
		icon: ArrowRightLeft,
		title: 'Currency Conversion',
		description: 'Real-time exchange rates with historical data and conversion tracking for informed decisions.',
		highlight: 'Live Rates'
	},
	{
		icon: Newspaper,
		title: 'Financial News',
		description: 'Stay updated with curated financial news, market trends, and currency-related developments.',
		highlight: 'Real-Time'
	},
	{
		icon: Gamepad2,
		title: 'FunZone Interactive',
		description: 'Learn through engaging quizzes and create custom virtual currencies in our gamified learning environment.',
		highlight: 'Educational'
	}
];

const LandingPage = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [particles, setParticles] = useState<{
		left: string;
		top: string;
		width: string;
		height: string;
		animationDelay: string;
		animationDuration: string;
	}[]>([]);

	React.useEffect(() => {
		const arr = Array.from({ length: 20 }, () => ({
			left: `${Math.random() * 100}%`,
			top: `${Math.random() * 100}%`,
			width: `${2 + Math.random() * 4}px`,
			height: `${2 + Math.random() * 4}px`,
			animationDelay: `${Math.random() * 6}s`,
			animationDuration: `${3 + Math.random() * 4}s`,
		}));
		setParticles(arr);
	}, []);

	const stats = [
		{ number: '10K+', label: 'Currencies Recognized' },
		{ number: '99.2%', label: 'Detection Accuracy' },
		{ number: '<1s', label: 'Recognition Speed' },
		{ number: '256-bit', label: 'Data Encryption' }
	]

	return (
		<div className="relative bg-gradient-to-br from-gray-950 via-gray-900 to-black min-h-screen overflow-hidden text-white">
			{/* Advanced Background Effects */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				<div className="top-0 left-0 absolute bg-gradient-to-br from-purple-600/5 to-blue-600/5 blur-3xl rounded-full w-[800px] h-[800px] animate-pulse"></div>
				<div className="right-0 bottom-0 absolute bg-gradient-to-tl from-indigo-600/5 to-cyan-600/5 blur-3xl rounded-full w-[600px] h-[600px] animate-pulse" style={{ animationDelay: '2s' }}></div>
				<div className="top-1/2 left-1/2 absolute bg-gradient-to-r from-violet-600/3 to-purple-600/3 blur-3xl rounded-full w-[400px] h-[400px] -translate-x-1/2 -translate-y-1/2 animate-pulse" style={{ animationDelay: '4s' }}></div>
			</div>

			{/* Floating particles effect */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				{particles.map((p, i) => (
					<div
						key={i}
						className="absolute bg-white/10 rounded-full animate-float"
						style={p}
					></div>
				))}
			</div>

			{/* Navigation */}
			<nav className="top-0 z-50 sticky bg-black/20 backdrop-blur-xl border-white/5 border-b">
				<div className="mx-auto px-6 py-4 max-w-7xl">
					<div className="flex justify-between items-center">
						<div className="flex items-center space-x-3">
							<div className="flex justify-center items-center bg-gradient-to-br from-purple-600 to-indigo-700 shadow-2xl shadow-purple-500/20 rounded-xl w-12 h-12">
								<Camera className="text-white" size={20} />
							</div>
							<div>
								<h1 className="font-bold text-white text-xl">Coin <span className="bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400 text-transparent">Vision</span></h1>
								<p className="text-white/40 text-xs">Currency Recognition AI</p>
							</div>
						</div>

						{/* Desktop Menu */}
						<div className="hidden md:flex items-center space-x-8">
							<a href="#features" className="text-white/60 hover:text-white hover:scale-105 transition-all duration-300">Features</a>
							<a href="#security" className="text-white/60 hover:text-white hover:scale-105 transition-all duration-300">Security</a>
							<a href="#contact" className="text-white/60 hover:text-white hover:scale-105 transition-all duration-300">Contact</a>
							<Link href="/login" className="bg-gradient-to-r from-purple-600 hover:from-purple-500 to-indigo-600 hover:to-indigo-500 shadow-lg shadow-purple-500/25 px-6 py-2 rounded-xl font-semibold hover:scale-105 transition-all duration-300">
								Launch App
							</Link>
						</div>

						{/* Mobile Menu Button */}
						<button
							onClick={() => setIsMenuOpen(!isMenuOpen)}
							className="md:hidden hover:bg-white/5 p-2 rounded-lg transition-all duration-300"
						>
							{isMenuOpen ? <X size={24} /> : <Menu size={24} />}
						</button>
					</div>

					{/* Mobile Menu */}
					{isMenuOpen && (
						<div className="md:hidden bg-black/40 backdrop-blur-xl mt-4 p-6 border border-white/10 rounded-xl">
							<div className="flex flex-col space-y-4">
								<a href="#features" className="text-white/70 hover:text-white transition-colors">Features</a>
								<a href="#security" className="text-white/70 hover:text-white transition-colors">Security</a>
								<a href="#contact" className="text-white/70 hover:text-white transition-colors">Contact</a>
								<Link href="/register" className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-3 rounded-xl font-semibold text-center hover:scale-105 transition-all duration-300">
									Launch App
								</Link>
							</div>
						</div>
					)}
				</div>
			</nav>

			{/* Hero Section */}
			<section className="relative flex justify-center items-center px-6 pt-16 min-h-screen">
				<div className="z-10 relative mx-auto max-w-6xl text-center">
					<div className="mb-8">
						<div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 shadow-lg backdrop-blur-md mb-8 px-6 py-3 border border-purple-500/20 rounded-full">
							<MousePointer className="text-purple-400" size={16} />
							<span className="font-medium text-purple-200 text-sm">All Details with a Single Click</span>
						</div>

						<h1 className="mb-8 font-black text-6xl md:text-8xl leading-none tracking-tight">
							<span className="block">Currency</span>
							<span className="block bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-400 to-cyan-400 text-transparent">
								Recognition
							</span>
							<span className="block text-white/90">Redefined</span>
						</h1>

						<p className="mx-auto mb-10 max-w-4xl text-white/70 text-xl md:text-2xl leading-relaxed">
							Unlock the power of AI-driven currency analysis. <strong className="text-purple-300">Recognize, verify, assess, and convert</strong> any currency instantly with military-grade security and lightning-fast accuracy.
						</p>
					</div>

					<div className="flex sm:flex-row flex-col justify-center items-center gap-6 mb-16">
						<Link href="/register" className="group flex items-center gap-3 bg-gradient-to-r from-purple-600 hover:from-purple-500 to-indigo-600 hover:to-indigo-500 shadow-2xl shadow-purple-500/30 px-10 py-5 rounded-2xl font-bold text-xl hover:scale-105 transition-all duration-300">
							<Camera size={24} />
							Start Scanning
							<ArrowRight size={24} className="transition-transform group-hover:translate-x-1 duration-300" />
						</Link>
						<button className="flex items-center gap-3 bg-white/5 hover:bg-white/10 backdrop-blur-xl px-10 py-5 border border-white/10 rounded-2xl font-bold text-xl hover:scale-105 transition-all duration-300">
							<Eye size={24} />
							View Demo
						</button>
					</div>

					{/* Enhanced Stats */}
					<div className="gap-6 grid grid-cols-2 md:grid-cols-4 mx-auto max-w-5xl">
						{stats.map((stat, index) => (
							<div key={index} className="group bg-gradient-to-br from-white/5 hover:from-purple-600/10 to-white/[0.02] hover:to-indigo-600/10 backdrop-blur-xl p-8 border border-white/5 rounded-2xl hover:scale-110 transition-all duration-500">
								<div className="mb-3 font-black text-purple-300 group-hover:text-purple-200 text-3xl md:text-4xl transition-colors duration-300">{stat.number}</div>
								<div className="font-medium text-white/60 text-sm">{stat.label}</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section id="features" className="z-10 relative px-6 py-24">
				<div className="mx-auto max-w-7xl">
					<div className="mb-20 text-center">
						<h2 className="mb-8 font-black text-5xl md:text-6xl">
							<span className="bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400 text-transparent">Powerful</span>
							<span className="text-white"> Features</span>
						</h2>
						<p className="mx-auto max-w-3xl text-white/60 text-xl leading-relaxed">
							Experience next-generation currency technology with our comprehensive AI-powered recognition suite
						</p>
					</div>

					<div className="gap-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
						{features.map((feature, index) => (
							<div
								key={index}
								className="group relative bg-gradient-to-br from-white/[0.08] hover:from-purple-600/10 to-white/[0.02] hover:to-indigo-600/10 backdrop-blur-xl p-8 border border-white/5 rounded-3xl overflow-hidden hover:scale-105 transition-all duration-500"
							>
								{/* Glow effect */}
								<div className="top-0 left-0 -z-10 absolute bg-gradient-to-br from-purple-600/20 to-indigo-600/20 opacity-0 group-hover:opacity-100 blur-xl rounded-full w-full h-full transition-opacity duration-500"></div>

								<div className="flex justify-between items-start mb-6">
									<div className="flex justify-center items-center bg-gradient-to-br from-purple-600/20 to-indigo-600/20 backdrop-blur-sm p-4 border border-purple-500/20 rounded-2xl group-hover:scale-110 transition-transform duration-300">
										<feature.icon size={32} className="text-purple-300" />
									</div>
									<span className="bg-gradient-to-r from-purple-500/20 to-indigo-500/20 backdrop-blur-sm px-3 py-1 border border-purple-500/30 rounded-full font-medium text-purple-300 text-xs">
										{feature.highlight}
									</span>
								</div>

								<h3 className="mb-4 font-bold text-white group-hover:text-purple-200 text-2xl transition-colors duration-300">
									{feature.title}
								</h3>
								<p className="text-white/60 leading-relaxed">
									{feature.description}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Security & Data Protection */}
			<section id="security" className="z-10 relative px-6 py-24">
				<div className="mx-auto max-w-7xl">
					<div className="items-center gap-16 grid grid-cols-1 lg:grid-cols-2">
						<div>
							<h2 className="mb-8 font-black text-5xl md:text-6xl">
								<span className="text-white">Military-Grade</span>
								<br />
								<span className="bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400 text-transparent">Data Security</span>
							</h2>
							<p className="mb-10 text-white/70 text-xl leading-relaxed">
								Your financial data deserves the highest level of protection. We employ enterprise-grade security
								measures to ensure your information remains completely private and secure.
							</p>

							<div className="space-y-6">
								{[
									{ icon: Lock, text: '256-bit AES encryption for all data transmission' },
									{ icon: Shield, text: 'Zero data retention policy - images processed and deleted instantly' },
									{ icon: Server, text: 'Secure cloud infrastructure with ISO 27001 certification' },
									{ icon: Smartphone, text: 'On-device processing for maximum privacy protection' }
								].map((item, index) => (
									<div key={index} className="group flex items-center gap-4">
										<div className="flex justify-center items-center bg-gradient-to-br from-purple-600/20 to-indigo-600/20 p-3 border border-purple-500/20 rounded-xl group-hover:scale-110 transition-transform duration-300">
											<item.icon size={24} className="text-purple-300" />
										</div>
										<span className="font-medium text-white/80">{item.text}</span>
									</div>
								))}
							</div>
						</div>

						<div className="relative">
							<div className="bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl p-10 border border-white/10 rounded-3xl">
								<div className="gap-8 grid grid-cols-1">
									<div className="text-center">
										<Lock size={64} className="mx-auto mb-6 text-purple-300" />
										<h3 className="mb-3 font-bold text-purple-200 text-2xl">End-to-End Encryption</h3>
										<p className="text-white/60">Your data is encrypted from capture to processing, ensuring complete privacy.</p>
									</div>

									<div className="flex justify-center items-center space-x-8">
										<div className="text-center">
											<div className="flex justify-center items-center bg-gradient-to-br from-green-600/20 to-emerald-600/20 mb-3 rounded-full w-16 h-16">
												<CheckCircle size={32} className="text-green-400" />
											</div>
											<span className="text-white/60 text-sm">GDPR Compliant</span>
										</div>
										<div className="text-center">
											<div className="flex justify-center items-center bg-gradient-to-br from-blue-600/20 to-cyan-600/20 mb-3 rounded-full w-16 h-16">
												<Shield size={32} className="text-blue-400" />
											</div>
											<span className="text-white/60 text-sm">SOC 2 Certified</span>
										</div>
										<div className="text-center">
											<div className="flex justify-center items-center bg-gradient-to-br from-purple-600/20 to-indigo-600/20 mb-3 rounded-full w-16 h-16">
												<Zap size={32} className="text-purple-400" />
											</div>
											<span className="text-white/60 text-sm">Real-time Processing</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="z-10 relative px-6 py-24">
				<div className="mx-auto max-w-5xl text-center">
					<div className="relative bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl p-16 border border-white/10 rounded-3xl overflow-hidden">
						{/* Background glow */}
						<div className="top-1/2 left-1/2 -z-10 absolute bg-gradient-to-r from-purple-600/20 to-indigo-600/20 blur-3xl rounded-full w-96 h-96 -translate-x-1/2 -translate-y-1/2"></div>

						<h2 className="mb-8 font-black text-5xl md:text-6xl">
							<span className="text-white">Ready to</span>
							<br />
							<span className="bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400 text-transparent">Revolutionize</span>
							<br />
							<span className="text-white">Currency Recognition?</span>
						</h2>
						<p className="mb-12 text-white/70 text-xl leading-relaxed">
							Join the future of digital currency analysis. Get instant recognition, fraud detection,
							and comprehensive financial insights with just one click.
						</p>
						<div className="flex sm:flex-row flex-col justify-center gap-6">
							<Link href="/register" className="group flex items-center gap-3 bg-gradient-to-r from-purple-600 hover:from-purple-500 to-indigo-600 hover:to-indigo-500 shadow-2xl shadow-purple-500/30 px-10 py-5 rounded-2xl font-bold text-xl hover:scale-105 transition-all duration-300">
								<Camera size={24} />
								Start Scanning Now
								<ArrowRight size={24} className="transition-transform group-hover:translate-x-1 duration-300" />
							</Link>
							<Link href="/login" className="flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-xl px-10 py-5 border border-white/20 rounded-2xl font-bold text-xl hover:scale-105 transition-all duration-300">
								<Eye size={24} />
								Sign In
							</Link>
						</div>
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer id="contact" className="z-10 relative px-6 py-20 border-white/5 border-t">
				<div className="mx-auto max-w-7xl">
					<div className="justify-between gap-12 grid grid-cols-1 md:grid-cols-4 mb-16">
						<div className="md:col-span-2">
							<div className="flex items-center space-x-3 mb-6">
								<div className="flex justify-center items-center bg-gradient-to-br from-purple-600 to-indigo-700 rounded-xl w-12 h-12">
									<Camera className="text-white" size={20} />
								</div>
								<h3 className="font-bold text-2xl">Coin <span className="text-purple-400">Vision</span></h3>
							</div>
							<p className="mb-6 text-white/60 leading-relaxed">
								Revolutionary AI-powered currency recognition technology that delivers instant, accurate,
								and secure financial analysis with military-grade data protection.
							</p>
							<div className="flex space-x-4">
								<div className="bg-white/5 hover:bg-white/10 p-3 rounded-xl transition-colors cursor-pointer">
									<Globe size={20} className="text-purple-400" />
								</div>
								<div className="bg-white/5 hover:bg-white/10 p-3 rounded-xl transition-colors cursor-pointer">
									<Shield size={20} className="text-indigo-400" />
								</div>
								<div className="bg-white/5 hover:bg-white/10 p-3 rounded-xl transition-colors cursor-pointer">
									<Zap size={20} className="text-cyan-400" />
								</div>
							</div>
						</div>

						<div>
							<h4 className="mb-6 font-bold text-purple-300">Core Features</h4>
							<ul className="space-y-3 text-white/60">
								<li><a href="#" className="hover:text-purple-300 transition-colors">Currency Recognition</a></li>
								<li><a href="#" className="hover:text-purple-300 transition-colors">Fake Note Detection</a></li>
								<li><a href="#" className="hover:text-purple-300 transition-colors">Condition Assessment</a></li>
								<li><a href="#" className="hover:text-purple-300 transition-colors">Live Conversion</a></li>
								<li><a href="#" className="hover:text-purple-300 transition-colors">Financial News</a></li>
								<li><a href="#" className="hover:text-purple-300 transition-colors">FunZone Games</a></li>
							</ul>
						</div>

						<div>
							<h4 className="mb-6 font-bold text-indigo-300">Security & Support</h4>
							<ul className="space-y-3 text-white/60">
								<li><a href="#" className="hover:text-indigo-300 transition-colors">Data Protection</a></li>
								<li><a href="#" className="hover:text-indigo-300 transition-colors">Privacy Policy</a></li>
								<li><a href="#" className="hover:text-indigo-300 transition-colors">Terms of Service</a></li>
								<li><a href="#" className="hover:text-indigo-300 transition-colors">24/7 Support</a></li>
								<li><a href="#" className="hover:text-indigo-300 transition-colors">API Documentation</a></li>
								<li><a href="#" className="hover:text-indigo-300 transition-colors">Developer Resources</a></li>
							</ul>
						</div>
					</div>

					<div className="pt-8 border-white/5 border-t text-white/40 text-sm text-center">
						<p>&copy; 2025 Coin Vision. All rights reserved. Powered by advanced AI technology with military-grade security.</p>
					</div>
				</div>
			</footer>

			{/* Custom animations */}
			<style jsx>{`
				@keyframes float {
					0%, 100% {
						transform: translateY(0px) rotate(0deg);
						opacity: 0.1;
					}
					50% {
						transform: translateY(-20px) rotate(180deg);
						opacity: 0.3;
					}
				}
				.animate-float {
					animation: float 6s ease-in-out infinite;
				}
			`}</style>
		</div>
	)
}

export default LandingPage