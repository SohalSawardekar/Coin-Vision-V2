'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import {
	Brain,
	TrendingUp,
	Shield,
	Gamepad2,
	DollarSign,
	Eye,
	BarChart3,
	Zap,
	CheckCircle,
	ArrowRight,
	Menu,
	X,
	Star,
	Users,
	Award,
	Globe
} from 'lucide-react'

const LandingPage = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false)

	const features = [
		{
			icon: Brain,
			title: 'AI-Powered Insights',
			description: 'Advanced AI analyzes your spending patterns and provides personalized financial recommendations.'
		},
		{
			icon: TrendingUp,
			title: 'Investment Tracking',
			description: 'Monitor your investments in real-time with detailed analytics and performance metrics.'
		},
		{
			icon: Shield,
			title: 'Fake Note Detection',
			description: 'Advanced computer vision technology to detect counterfeit currency instantly.'
		},
		{
			icon: Eye,
			title: 'Note Condition Assessment',
			description: 'Evaluate the condition of your currency notes for accurate valuation.'
		},
		{
			icon: DollarSign,
			title: 'Currency Conversion',
			description: 'Real-time currency conversion with live exchange rates from around the world.'
		},
		{
			icon: BarChart3,
			title: 'Inflation Adjustment',
			description: 'Track how inflation affects your purchasing power over time.'
		},
		{
			icon: Gamepad2,
			title: 'FunZone Gaming',
			description: 'Learn finance through interactive quizzes and games in our FunZone.'
		},
		{
			icon: Zap,
			title: 'Smart Automation',
			description: 'Automate your financial tracking and get intelligent spending alerts.'
		}
	]

	const stats = [
		{ number: '4+', label: 'Active Users' },
		{ number: '₹100+', label: 'Transactions Tracked' },
		{ number: '90%', label: 'Accuracy Rate' },
		{ number: '24/7*', label: 'AI Support' }
	]

	return (
		<div className="relative bg-gradient-to-br from-[#1a1f3a] via-[#242a42] to-[#2a324c] min-h-screen overflow-hidden text-white">
			{/* Background Effects */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				<div className="top-1/4 left-1/4 absolute bg-[#636fac]/10 blur-3xl rounded-full w-72 h-72 animate-pulse"></div>
				<div className="right-1/4 bottom-1/4 absolute bg-[#4c5899]/10 blur-3xl rounded-full w-96 h-96 animate-pulse" style={{ animationDelay: '2s' }}></div>
				<div className="top-3/4 left-1/2 absolute bg-[#8b9dc3]/10 blur-3xl rounded-full w-64 h-64 animate-pulse" style={{ animationDelay: '4s' }}></div>
			</div>

			{/* Navigation */}
			<nav className="top-0 z-50 sticky bg-white/5 backdrop-blur-md border-white/10 border-b">
				<div className="mx-auto px-6 py-4 max-w-7xl">
					<div className="flex justify-between items-center">
						<div className="flex items-center space-x-3">
							<div className="flex justify-center items-center bg-gradient-to-br from-[#636fac] to-[#4c5899] shadow-lg rounded-xl w-10 h-10">
								<span className="font-bold text-white text-lg">CV</span>
							</div>
							<div>
								<h1 className="font-bold text-white text-xl">Coin <span className="text-[#636fac]">Vision</span></h1>
								<p className="text-white/50 text-xs">AI Finance Management</p>
							</div>
						</div>

						{/* Desktop Menu */}
						<div className="hidden md:flex items-center space-x-8">
							<a href="#features" className="text-white/70 hover:text-white transition-colors duration-300">Features</a>
							<a href="#about" className="text-white/70 hover:text-white transition-colors duration-300">About</a>
							<a href="#contact" className="text-white/70 hover:text-white transition-colors duration-300">Contact</a>
							<Link href="/login" className="bg-gradient-to-r from-[#636fac] to-[#4c5899] shadow-lg px-6 py-2 rounded-xl font-semibold hover:scale-105 transition-all duration-300">
								Get Started
							</Link>
						</div>

						{/* Mobile Menu Button */}
						<button
							onClick={() => setIsMenuOpen(!isMenuOpen)}
							className="md:hidden hover:bg-white/10 p-2 rounded-lg transition-colors"
						>
							{isMenuOpen ? <X size={24} /> : <Menu size={24} />}
						</button>
					</div>

					{/* Mobile Menu */}
					{isMenuOpen && (
						<div className="md:hidden bg-white/5 backdrop-blur-md mt-4 p-4 rounded-xl">
							<div className="flex flex-col space-y-4">
								<a href="#features" className="text-white/70 hover:text-white transition-colors">Features</a>
								<a href="#about" className="text-white/70 hover:text-white transition-colors">About</a>
								<a href="#contact" className="text-white/70 hover:text-white transition-colors">Contact</a>
								<Link href="/register" className="bg-gradient-to-r from-[#636fac] to-[#4c5899] px-6 py-2 rounded-xl font-semibold text-center">
									Get Started
								</Link>
							</div>
						</div>
					)}
				</div>
			</nav>

			{/* Hero Section */}
			<section className="relative flex justify-center items-center px-6 pt-20 min-h-screen">
				<div className="z-10 relative mx-auto max-w-6xl text-center">
					<div className="mb-8">
						<div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md mb-6 px-4 py-2 border border-white/20 rounded-full">
							<Star className="text-[#636fac]" size={16} />
							<span className="font-medium text-sm">AI-Powered Finance Management</span>
						</div>

						<h1 className="mb-6 font-bold text-5xl md:text-7xl leading-tight">
							Smart Finance
							<br />
							<span className="bg-clip-text bg-gradient-to-r from-[#636fac] to-[#8b9dc3] text-transparent">
								Made Simple
							</span>
						</h1>

						<p className="mx-auto mb-8 max-w-4xl text-white/80 text-xl md:text-2xl leading-relaxed">
							Transform your financial life with AI-powered insights, real-time tracking, and intelligent recommendations.
							Detect fake notes, convert currencies, and learn through gamified experiences.
						</p>
					</div>

					<div className="flex sm:flex-row flex-col justify-center items-center gap-4 mb-12">
						<Link href="/register" className="flex items-center gap-2 bg-gradient-to-r from-[#636fac] to-[#4c5899] shadow-2xl px-8 py-4 rounded-xl font-semibold text-lg hover:scale-105 transition-all duration-300">
							Explore
							<ArrowRight size={20} />
						</Link>
						<button className="bg-white/10 hover:bg-white/20 backdrop-blur-md px-8 py-4 border border-white/20 rounded-xl font-semibold text-lg transition-all duration-300">
							Watch Demo
						</button>
					</div>

					{/* Stats */}
					<div className="gap-6 grid grid-cols-2 md:grid-cols-4 mx-auto max-w-4xl">
						{stats.map((stat, index) => (
							<div key={index} className="bg-white/5 hover:bg-white/10 backdrop-blur-md p-6 border border-white/10 rounded-xl transition-all duration-300">
								<div className="mb-2 font-bold text-[#636fac] text-2xl md:text-3xl">{stat.number}</div>
								<div className="text-white/70 text-sm">{stat.label}</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section id="features" className="z-10 relative px-6 py-20">
				<div className="mx-auto max-w-7xl">
					<div className="mb-16 text-center">
						<h2 className="mb-6 font-bold text-4xl md:text-5xl">
							Powerful <span className="text-[#636fac]">Features</span>
						</h2>
						<p className="mx-auto max-w-3xl text-white/70 text-xl">
							Experience the future of finance management with our comprehensive suite of AI-powered tools
						</p>
					</div>

					<div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
						{features.map((feature, index) => (
							<div
								key={index}
								className="group bg-white/5 hover:bg-white/10 backdrop-blur-md p-6 border border-white/10 rounded-2xl hover:scale-105 transition-all duration-300"
							>
								<div className="flex justify-center items-center bg-gradient-to-br from-[#636fac] to-[#4c5899] mb-4 rounded-xl w-12 h-12 group-hover:scale-110 transition-transform duration-300">
									<feature.icon size={24} className="text-white" />
								</div>
								<h3 className="mb-3 font-semibold text-white group-hover:text-[#636fac] text-xl transition-colors duration-300">
									{feature.title}
								</h3>
								<p className="text-white/70 leading-relaxed">
									{feature.description}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* About Section */}
			<section id="about" className="z-10 relative px-6 py-20">
				<div className="mx-auto max-w-7xl">
					<div className="items-center gap-12 grid grid-cols-1 lg:grid-cols-2">
						<div>
							<h2 className="mb-6 font-bold text-4xl md:text-5xl">
								Why Choose <span className="text-[#636fac]">Coin Vision</span>?
							</h2>
							<p className="mb-8 text-white/80 text-xl leading-relaxed">
								Our AI-powered platform combines cutting-edge technology with user-friendly design to deliver
								the most comprehensive finance management experience available today.
							</p>

							<div className="space-y-4">
								{[
									'Advanced AI algorithms for personalized insights',
									'Real-time currency detection and validation',
									'Gamified learning experience in FunZone',
									'24/7 customer support and assistance'
								].map((item, index) => (
									<div key={index} className="flex items-center gap-3">
										<CheckCircle size={20} className="flex-shrink-0 text-[#636fac]" />
										<span className="text-white/80">{item}</span>
									</div>
								))}
							</div>
						</div>

						<div className="relative">
							<div className="bg-white/5 backdrop-blur-md p-8 border border-white/10 rounded-3xl">
								<div className="gap-6 grid grid-cols-2">
									<div className="text-center">
										<Users size={48} className="mx-auto mb-4 text-[#636fac]" />
										<div className="font-bold text-2xl">4+</div>
										<div className="text-white/70">Happy Users</div>
									</div>
									<div className="text-center">
										<Award size={48} className="mx-auto mb-4 text-[#4c5899]" />
										<div className="font-bold text-2xl">90%</div>
										<div className="text-white/70">Uptime</div>
									</div>
									<div className="text-center">
										<Globe size={48} className="mx-auto mb-4 text-[#8b9dc3]" />
										<div className="font-bold text-2xl">150+</div>
										<div className="text-white/70">Countries</div>
									</div>
									<div className="text-center">
										<Shield size={48} className="mx-auto mb-4 text-[#636fac]" />
										<div className="font-bold text-2xl">100%*</div>
										<div className="text-white/70">Secure</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="z-10 relative px-6 py-20">
				<div className="mx-auto max-w-4xl text-center">
					<div className="bg-gradient-to-r from-[#636fac]/20 to-[#4c5899]/20 backdrop-blur-md p-12 border border-white/20 rounded-3xl">
						<h2 className="mb-6 font-bold text-4xl md:text-5xl">
							Ready to Transform Your Finances?
						</h2>
						<p className="mb-8 text-white/80 text-xl">
							Join thousands of users who have already revolutionized their financial management with Coin Vision.
						</p>
						<div className="flex sm:flex-row flex-col justify-center gap-4">
							<Link href="/register" className="bg-gradient-to-r from-[#636fac] to-[#4c5899] shadow-2xl px-8 py-4 rounded-xl font-semibold text-lg hover:scale-105 transition-all duration-300">
								Start Your Journey
							</Link>
							<Link href="/login" className="bg-white/10 hover:bg-white/20 backdrop-blur-md px-8 py-4 border border-white/20 rounded-xl font-semibold text-lg transition-all duration-300">
								Sign In
							</Link>
						</div>
					</div>
				</div>
			</section>

			{/* Footer with Terms */}
			<footer id="contact" className="z-10 relative px-6 py-16 border-white/10 border-t">
				<div className="mx-auto max-w-7xl">
					<div className="justify-around gap-8 grid grid-cols-1 md:grid-cols-4 mb-12">
						<div className='flex flex-col justify-center items-center w-full'>
							<div className="flex items-center space-x-3 mb-4">
								<div className="flex justify-center items-center bg-gradient-to-br from-[#636fac] to-[#4c5899] rounded-xl w-10 h-10">
									<span className="font-bold text-white text-lg">CV</span>
								</div>
								<h3 className="font-bold text-xl">Coin <span className="text-[#636fac]">Vision</span></h3>
							</div>
							<p className="text-white/70">
								AI-powered finance management that makes smart financial decisions accessible to everyone.
							</p>
						</div>

						<div className='flex flex-col justify-center items-center w-full'>
							<h4 className="mb-4 font-semibold">Features</h4>
							<ul className="space-y-2 text-white/70">
								<li><a href="#" className="hover:text-white transition-colors">AI Insights</a></li>
								<li><a href="#" className="hover:text-white transition-colors">Investment Tracking</a></li>
								<li><a href="#" className="hover:text-white transition-colors">Currency Detection</a></li>
								<li><a href="#" className="hover:text-white transition-colors">FunZone</a></li>
							</ul>
						</div>

						<div className='flex flex-col justify-center items-center w-full'>
							<h4 className="mb-4 font-semibold">Company</h4>
							<ul className="space-y-2 text-white/70">
								<li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
								<li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
								<li><a href="#" className="hover:text-white transition-colors">Press</a></li>
								<li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
							</ul>
						</div>

					</div>

					{/* Terms and Conditions */}
					<div className="pt-8 border-white/10 border-t">
						<div className="bg-white/5 backdrop-blur-md mb-8 p-6 border border-white/10 rounded-2xl">
							<h3 className="mb-4 font-semibold text-xl">Terms and Conditions</h3>
							<div className="space-y-3 text-white/70 text-sm">
								<p>
									<strong>AI Accuracy:</strong> While our AI provides highly accurate insights, all financial decisions
									remain your responsibility. We recommend consulting with financial advisors for major investment decisions.
								</p>
								<p>
									<strong>Currency Detection:</strong> Our fake note detection feature uses advanced computer vision
									technology with 95% accuracy rate. Results should be verified through official channels when necessary.
								</p>
								<p>
									<strong>Service Availability:</strong> We strive for 99.9% uptime but cannot guarantee uninterrupted
									service. Scheduled maintenance will be communicated in advance.
								</p>
								<p>
									<strong>FunZone:</strong> Educational games and quizzes are designed for learning purposes and should
									not replace professional financial education.
								</p>
							</div>
						</div>
					</div>

					<div className="text-white/50 text-sm text-center">
						<p>&copy; 2025 Coin Vision. All rights reserved. Made with ❤️ for smarter finance management.</p>
					</div>
				</div>
			</footer>
		</div>
	)
}

export default LandingPage