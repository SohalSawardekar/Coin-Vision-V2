import React from 'react'
import Link from "next/link"

const FunZone = () => {
	return (
		<main className="flex justify-center items-center bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 p-6 min-h-screen">
			<div className="bg-white/10 shadow-2xl backdrop-blur-xl p-10 border border-white/20 rounded-2xl w-full max-w-lg text-white text-center">
				<h1 className="drop-shadow-lg mb-8 font-bold text-4xl">
					🎮 Fun Zone
				</h1>
				<p className="opacity-80 mb-8 text-lg">
					Learn about currencies through games and creativity
				</p>

				<div className="flex flex-col gap-4">
					<Link
						href="/quiz"
						className="bg-gradient-to-r from-purple-500 hover:from-blue-500 to-blue-500 hover:to-purple-500 shadow-lg hover:shadow-purple-500/50 px-6 py-3 rounded-lg font-semibold transition-all duration-300"
					>
						🧠 Currency Quiz Challenge
					</Link>

					<Link
						href="/redesign"
						className="bg-gradient-to-r from-pink-500 hover:from-orange-500 to-orange-500 hover:to-pink-500 shadow-lg hover:shadow-pink-500/50 px-6 py-3 rounded-lg font-semibold transition-all duration-300"
					>
						🎨 Redesign Currency
					</Link>
				</div>

				<div className="opacity-60 mt-8 text-sm">
					Interactive learning made fun!
				</div>
			</div>
		</main>
	)
}

export default FunZone