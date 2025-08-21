'use client'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"

const RegisterPage = () => {
	const [loading, setLoading] = useState(false)
	const [showPassword, setShowPassword] = useState(false)
	const [showConfirmPassword, setShowConfirmPassword] = useState(false)
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		password: '',
		confirmPassword: ''
	})
	const [error, setError] = useState('')

	const supabase = createClient()
	const router = useRouter()

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value
		})
		setError('') // Clear error when user starts typing
	}

	const handleRegister = async (e: React.FormEvent) => {
		e.preventDefault()
		setLoading(true)
		setError('')

		// Validation
		if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
			setError('All fields are required')
			setLoading(false)
			return
		}

		if (formData.password !== formData.confirmPassword) {
			setError('Passwords do not match')
			setLoading(false)
			return
		}

		if (formData.password.length < 6) {
			setError('Password must be at least 6 characters long')
			setLoading(false)
			return
		}

		try {
			const { data, error } = await supabase.auth.signUp({
				email: formData.email,
				password: formData.password,
				options: {
					emailRedirectTo: `${window.location.origin}/login`,
					data: {
						full_name: formData.name,
						display_name: formData.name,
					}
				},
			})

			if (error) {
				setError(error.message)
			} else {
				// Check if email confirmation is required
				if (data.user && !data.session) {
					setError('Please check your email to confirm your account')
				} else {
					router.push('/dashboard')
				}
			}
		} catch (err) {
			console.error('Registration error:', err)
			setError('An unexpected error occurred')
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="flex justify-center items-center mx-auto px-2 xs:px-4 py-4 w-full max-w-[95vw] xs:max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl">
			<form
				className={cn("flex flex-col gap-5 xs:gap-6 bg-gradient-to-b from-[#343e72] to-[#232844] shadow-slate-100 shadow-xs p-4 xs:p-6 sm:p-8 md:p-10 lg:p-12 rounded-2xl sm:rounded-3xl w-[80%] md:w-[90%] lg:w-[70%] text-white")}
				onSubmit={handleRegister}
			>
				<div className="flex flex-col items-center gap-2 text-center">
					<h1 className="font-bold text-xl xs:text-2xl sm:text-3xl">Register</h1>
				</div>

				{error && (
					<div className="bg-red-500/10 p-2 xs:p-3 border border-red-500/50 rounded-lg text-red-200 text-xs xs:text-sm">
						{error}
					</div>
				)}

				<div className="gap-5 xs:gap-6 grid">
					<div className="gap-2 xs:gap-3 grid">
						<Label htmlFor="name" className="text-xs xs:text-sm">Name</Label>
						<Input
							id="name"
							name="name"
							type="text"
							placeholder="Enter your name"
							className="bg-white px-2 py-2 xs:py-2.5 text-black text-xs xs:text-sm"
							value={formData.name}
							onChange={handleInputChange}
							required
						/>
					</div>

					<div className="gap-2 xs:gap-3 grid">
						<Label htmlFor="email" className="text-xs xs:text-sm">Email</Label>
						<Input
							id="email"
							name="email"
							type="email"
							placeholder="Enter your email"
							className="bg-white px-2 py-2 xs:py-2.5 text-black text-xs xs:text-sm"
							value={formData.email}
							onChange={handleInputChange}
							required
						/>
					</div>

					<div className="gap-2 xs:gap-3 grid">
						<Label htmlFor="password" className="text-xs xs:text-sm">Enter Password</Label>
						<div className="relative">
							<Input
								id="password"
								name="password"
								type={showPassword ? "text" : "password"}
								placeholder="Enter your password"
								className="bg-white px-2 py-2 xs:py-2.5 pr-10 text-black text-xs xs:text-sm"
								value={formData.password}
								onChange={handleInputChange}
								required
							/>
							<button
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								className="top-1/2 right-2 xs:right-3 absolute text-gray-500 hover:text-gray-700 transition-colors -translate-y-1/2 transform"
							>
								{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
							</button>
						</div>
					</div>

					<div className="gap-2 xs:gap-3 grid">
						<Label htmlFor="confirm-password" className="text-xs xs:text-sm">Confirm Password</Label>
						<div className="relative">
							<Input
								id="confirm-password"
								name="confirmPassword"
								type={showConfirmPassword ? "text" : "password"}
								placeholder="Confirm your password"
								className="bg-white px-2 py-2 xs:py-2.5 pr-10 text-black text-xs xs:text-sm"
								value={formData.confirmPassword}
								onChange={handleInputChange}
								required
							/>
							<button
								type="button"
								onClick={() => setShowConfirmPassword(!showConfirmPassword)}
								className="top-1/2 right-2 xs:right-3 absolute text-gray-500 hover:text-gray-700 transition-colors -translate-y-1/2 transform"
							>
								{showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
							</button>
						</div>
					</div>

					<Button
						type="submit"
						className="bg-[#121521] hover:bg-[#1f2937] py-2 xs:py-2.5 w-full font-semibold text-xs xs:text-sm"
						disabled={loading}
					>
						{loading ? "Creating Account..." : "Register"}
					</Button>
				</div>

				<div className="text-xs xs:text-sm text-center">
					Already have an account?{" "}
					<Link href="/login" className="hover:text-blue-300 underline underline-offset-4 transition-colors">
						Login
					</Link>
				</div>
			</form>
		</div>
	)
}

export default RegisterPage