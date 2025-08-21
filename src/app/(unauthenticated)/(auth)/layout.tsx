import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function Layout({ children }: { children: React.ReactNode }) {
	const supabase = await createClient()

	const {
		data: { session },
	} = await supabase.auth.getSession()

	if (session) {
		redirect('/dashboard')
	}

	return (
		<div className="justify-center items-center grid grid-cols-1 md:grid-cols-2 w-full min-h-screen">
			<div className="flex justify-center items-center bg-gradient-to-r from-[#101521] to-[#151928] h-full">
				<h1 className="flex flex-col gap-y-[2rem] font-bold text-slate-200 text-5xl">
					<p className="flex justify-center items-center">Coin</p>
					<p className="flex justify-center items-center !text-[#616da1] animate-bounce">
						Vision
					</p>
				</h1>
			</div>
			<div className="flex justify-center w-full h-full">{children}</div>
		</div>
	)
}