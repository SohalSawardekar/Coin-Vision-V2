'use client'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import Image from "next/image"
import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"

type LoginForm = {
	email: string
	password: string
}

export default function LoginForm() {
	const supabase = createClient()
	const router = useRouter()
	const [loading, setLoading] = useState(false)
	const [showPassword, setShowPassword] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [formData, setFormData] = useState<LoginForm>({
		email: "",
		password: "",
	})

	const signInWithEmail = async (e: React.FormEvent) => {
		e.preventDefault()
		setLoading(true)
		setError(null)

		try {
			const { error } = await supabase.auth.signInWithPassword({
				email: formData.email, // Use actual form data
				password: formData.password, // Use actual form data
			})

			if (error) {
				setError(error.message)
				console.error("Error signing in:", error)
				return
			}

			// Redirect to dashboard on success
			router.push('/dashboard')
			router.refresh() // Refresh to update auth state

		} catch (err) {
			setError('An unexpected error occurred')
			console.error('Login error:', err)
		} finally {
			setLoading(false)
		}
	}

	const handleGoogleSignIn = async () => {
		setLoading(true)
		setError(null)

		try {
			const { error } = await supabase.auth.signInWithOAuth({
				provider: "google",
				options: {
					redirectTo: `${window.location.origin}/api/auth/callback`
				}
			})

			if (error) {
				setError(error.message)
				console.error("Error signing in with Google:", error)
			}
		} catch (err) {
			setError('Failed to sign in with Google')
			console.error('Google sign in error:', err)
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="flex justify-center items-center bg-gradient-to-b from-[#232844] to-[#181c2a] p-2 sm:p-4 w-full md:min-h-screen">
			<div
				className={cn(
					"flex flex-col gap-6 bg-gradient-to-b from-[#343e72] to-[#232844] shadow-slate-100 shadow-xs mx-auto p-4 xs:p-6 sm:p-8 md:p-10 lg:p-12 rounded-2xl sm:rounded-3xl w-full max-w-sm sm:max-w-md md:max-w-md text-white",
				)}
			>
				<div className="flex flex-col items-center gap-2 text-center">
					<h1 className="font-bold text-xl xs:text-2xl sm:text-3xl">Login to your account</h1>
				</div>

				{/* Error Message */}
				{error && (
					<div className="bg-red-500/20 p-2 xs:p-3 border border-red-500 rounded-lg text-red-100 text-xs xs:text-sm">
						{error}
					</div>
				)}

				<form onSubmit={signInWithEmail} className="gap-5 xs:gap-6 grid">
					<div className="gap-2 xs:gap-3 grid">
						<Label htmlFor="email" className="text-xs xs:text-sm">Email</Label>
						<Input
							id="email"
							type="email"
							placeholder="Enter your email"
							className="bg-white px-2 py-2 xs:py-2.5 text-black text-xs xs:text-sm"
							value={formData.email}
							onChange={(e) => {
								setFormData({ ...formData, email: e.target.value })
							}}
							required
						/>
					</div>
					<div className="gap-2 xs:gap-3 grid">
						<div className="flex items-center">
							<Label htmlFor="password" className="text-xs xs:text-sm">Password</Label>
							<Link
								href="/forgot-password"
								className="ml-auto text-xs xs:text-sm hover:underline underline-offset-4"
							>
								Forgot your password?
							</Link>
						</div>
						<div className="relative">
							<Input
								id="password"
								type={showPassword ? "text" : "password"}
								placeholder="Enter your password"
								className="bg-white px-2 py-2 xs:py-2.5 pr-10 text-black text-xs xs:text-sm"
								value={formData.password}
								onChange={(e) => {
									setFormData({ ...formData, password: e.target.value })
								}}
								required
							/>
							<button
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								className="top-1/2 right-2 xs:right-3 absolute text-black -translate-y-1/2 hover:cursor-pointer transform"
							>
								{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
							</button>
						</div>
					</div>
					<Button
						type="submit"
						disabled={loading}
						className="bg-[#121521] hover:bg-[#1f2937] disabled:opacity-50 py-2 xs:py-2.5 w-full font-semibold text-xs xs:text-sm hover:cursor-pointer"
					>
						{loading ? 'Signing in...' : 'Login'}
					</Button>
				</form>

				<div className="after:top-1/2 after:z-0 after:absolute relative after:inset-0 after:flex after:items-center after:border-t after:border-border text-xs xs:text-sm text-center">
					<span className="z-10 relative bg-[#232844] px-2 rounded-full">
						Or continue with
					</span>
				</div>

				<Button
					type="button"
					disabled={loading}
					className="flex items-center gap-2 bg-[#121521] hover:bg-[#1f2937] disabled:opacity-50 py-2 xs:py-2.5 outline-[#2d3b4e] outline-1 w-full font-semibold text-white hover:text-white text-xs xs:text-sm hover:cursor-pointer"
					onClick={handleGoogleSignIn}
				>
					<Image
						src="/logo/google.svg"
						alt="Google Logo"
						width={18}
						height={18}
					/>
					{loading ? 'Signing in...' : 'Login with Google'}
				</Button>

				<div className="text-xs xs:text-sm text-center">
					Don&apos;t have an account?{" "}
					<Link href="/register" className="underline underline-offset-4">
						Sign up
					</Link>
				</div>
			</div>
		</div>
	)
}