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

export default function LoginForm() { // Changed from "form" to "div"
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
		<div className="w-[60%]">
			<div
				className={cn(
					"flex flex-col gap-6 bg-gradient-to-b from-[#343e72] to-[#232844] shadow-slate-100 shadow-xs p-[3rem] rounded-3xl text-white",
				)}
			>
				<div className="flex flex-col items-center gap-2 text-center">
					<h1 className="font-bold text-2xl">Login to your account</h1>
				</div>

				{/* Error Message */}
				{error && (
					<div className="bg-red-500/20 p-3 border border-red-500 rounded-lg text-red-100 text-sm">
						{error}
					</div>
				)}

				<form onSubmit={signInWithEmail} className="gap-6 grid">
					<div className="gap-3 grid">
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							type="email"
							placeholder="Enter your email"
							className="bg-white text-black"
							value={formData.email}
							onChange={(e) => {
								setFormData({ ...formData, email: e.target.value })
							}}
							required
						/>
					</div>
					<div className="gap-3 grid">
						<div className="flex items-center">
							<Label htmlFor="password">Password</Label>
							<Link
								href="/forgot-password"
								className="ml-auto text-sm hover:underline underline-offset-4"
							>
								Forgot your password?
							</Link>
						</div>
						<div className="relative">
							<Input
								id="password"
								type={showPassword ? "text" : "password"}
								placeholder="Enter your password"
								className="bg-white pr-10 text-black"
								value={formData.password}
								onChange={(e) => {
									setFormData({ ...formData, password: e.target.value })
								}}
								required
							/>
							<button
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								className="top-1/2 right-3 absolute text-black -translate-y-1/2 hover:cursor-pointer transform"
							>
								{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
							</button>
						</div>
					</div>
					<Button
						type="submit"
						disabled={loading}
						className="bg-[#121521] hover:bg-[#1f2937] disabled:opacity-50 w-full font-semibold hover:cursor-pointer"
					>
						{loading ? 'Signing in...' : 'Login'}
					</Button>
				</form>

				<div className="after:top-1/2 after:z-0 after:absolute relative after:inset-0 after:flex after:items-center after:border-t after:border-border text-sm text-center">
					<span className="z-10 relative bg-[#232844] px-2 rounded-full">
						Or continue with
					</span>
				</div>

				<Button
					type="button"
					disabled={loading}
					className="flex items-center gap-2 bg-[#121521] hover:bg-[#1f2937] disabled:opacity-50 outline-[#2d3b4e] outline-1 w-full font-semibold text-white hover:text-white hover:cursor-pointer"
					onClick={handleGoogleSignIn}
				>
					<Image
						src="/logo/google.svg"
						alt="Google Logo"
						width={20}
						height={20}
					/>
					{loading ? 'Signing in...' : 'Login with Google'}
				</Button>

				<div className="text-sm text-center">
					Don&apos;t have an account?{" "}
					<Link href="/register" className="underline underline-offset-4">
						Sign up
					</Link>
				</div>
			</div>
		</div>
	)
}