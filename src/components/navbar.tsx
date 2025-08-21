/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React from 'react'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { User, LogOut, Wallet2, AlbumIcon, Settings, LayoutDashboardIcon, Gamepad2Icon, ChevronDown, Newspaper } from 'lucide-react'
import Link from 'next/link'
import { useRouter, usePathname } from "next/navigation"
import { createClient } from '@/utils/supabase/client'
import { useMemo } from 'react'

const navBtns = [
	{
		label: 'Dashboard',
		path: '/dashboard',
		icon: LayoutDashboardIcon
	},
	{
		label: 'Currency',
		path: '/currency',
		icon: Wallet2
	},
	{
		label: 'FunZone',
		path: '/funzone',
		icon: Gamepad2Icon
	},
	{
		label: 'News',
		path: '/news',
		icon: Newspaper
	},
]

const NavBar = () => {
	const supabase = useMemo(() => createClient(), [])
	const router = useRouter()
	const pathname = usePathname()
	const [userData, setUserData] = React.useState<any>(null)

	React.useEffect(() => {
		const fetchUser = async () => {
			const { data: { user }, error } = await supabase.auth.getUser()
			console.log(user)
			if (error) {
				console.error('Error fetching user:', error)
			} else {
				setUserData(user)
			}
		}
		fetchUser()
	}, [supabase])

	const handleLogOut = async () => {
		const { error } = await supabase.auth.signOut()
		if (!error) {
			router.push('/login')
		}
	}

	return (
		<nav className='top-0 z-50 sticky bg-gradient-to-r from-[#1a1f3a]/95 via-[#242a42]/90 to-[#2a324c]/95 shadow-2xl backdrop-blur-md border-white/10 border-b'>
			<div className='mx-auto px-6 py-4 max-w-7xl'>
				<div className='flex justify-between items-center'>
					{/* Logo Section */}
					<div className='flex items-center space-x-2 hover:cursor-default select-none'>
						<div className='flex justify-center items-center bg-gradient-to-br from-[#636fac] to-[#4c5899] shadow-lg rounded-xl w-10 h-10'>
							<span className='flex flex-row font-bold text-white text-xl'>
								<p>C</p>
								<p className='text-[#1d254d]'>V</p>
							</span>
						</div>
						<div className='flex flex-col'>
							<div className='flex items-center gap-1'>
								<h1 className='font-bold text-white text-xl tracking-tight'>Coin</h1>
								<h1 className='font-bold text-[#636fac] text-xl tracking-tight'>Vision</h1>
							</div>
							<p className='text-white/50 text-xs'>Financial Tool</p>
						</div>
					</div>

					{/* Navigation Links */}
					<div className='hidden lg:flex items-center space-x-1 bg-white/5 backdrop-blur-sm p-2 rounded-2xl'>
						{navBtns.map((data, index) => {
							const Icon = data.icon
							const isActive =
								pathname === data.path || pathname.startsWith(data.path + "/");

							return (
								<Link
									key={index}
									href={data.path}
									className={`group relative flex items-center gap-3 px-5 py-3 rounded-xl transition-all duration-300 ${isActive
										? 'bg-gradient-to-r from-[#636fac]/20 to-[#4c5899]/20 text-white shadow-lg border border-[#636fac]/30'
										: 'text-white/70 hover:text-white hover:bg-white/10'
										}`}
								>
									<Icon
										size={18}
										className={`transition-all duration-300 ${isActive ? 'text-[#636fac]' : 'group-hover:scale-110'
											}`}
									/>
									<span className='font-medium text-sm'>{data.label}</span>

									{/* Active indicator */}
									{isActive && (
										<div className='-z-10 absolute inset-0 bg-gradient-to-r from-[#636fac]/10 to-[#4c5899]/10 blur-sm rounded-xl' />
									)}
								</Link>
							)
						})}
					</div>

					{/* Right Section */}
					<div className='flex items-center space-x-4'>
						{/* User Dropdown */}
						<DropdownMenu>
							<DropdownMenuTrigger className='group flex items-center gap-3 hover:bg-white/10 px-3 py-2 rounded-xl transition-all duration-200'>
								<Avatar className="ring-2 ring-white/20 ring-offset-2 ring-offset-transparent w-8 h-8">
									<AvatarImage src={userData?.user_metadata?.avatar_url || undefined} />
									<AvatarFallback className="bg-gradient-to-br from-[#636fac] to-[#4c5899] font-semibold text-white">
										{userData?.user_metadata?.display_name && typeof userData.user_metadata.display_name === 'string' && userData.user_metadata.display_name.length > 0
											? userData.user_metadata.display_name[0].toUpperCase()
											: <User size={16} />}
									</AvatarFallback>
								</Avatar>
								<div className="hidden sm:flex flex-col items-start">
									<span className="font-medium text-white text-sm">{userData?.user_metadata?.display_name || userData?.user_metadata?.name || 'User'}</span>
									<span className="text-white/50 text-xs">{userData?.user_metadata?.email || ''}</span>
								</div>
								<ChevronDown size={16} className="text-white/50 group-hover:text-white transition-colors duration-200" />
							</DropdownMenuTrigger>

							<DropdownMenuContent
								className='bg-[#1a1f3a]/95 shadow-2xl backdrop-blur-xl border-white/20 min-w-[220px]'
								align="end"
							>
								<DropdownMenuLabel className='px-4 py-3 font-semibold text-white/90'>
									<div className="flex flex-col space-y-1">
										<span>My Account</span>
										<span className="font-normal text-white/50 text-xs">Manage your profile</span>
									</div>
								</DropdownMenuLabel>

								<DropdownMenuSeparator className="bg-white/10" />

								<DropdownMenuItem className='hover:bg-white/10 px-4 py-3 text-white/80 hover:text-white transition-colors duration-200'>
									<Link href={"/dashboard/me"} className='flex items-center gap-3 w-full'>
										<User size={16} />
										<div className="flex flex-col">
											<span>Profile</span>
											<span className="text-white/50 text-xs">View and edit profile</span>
										</div>
									</Link>
								</DropdownMenuItem>

								<DropdownMenuItem disabled className='px-4 py-3 text-white/40'>
									<div className="flex items-center gap-3 w-full">
										<Settings size={16} />
										<div className="flex flex-col">
											<span>Settings</span>
											<span className="text-white/30 text-xs">Coming soon</span>
										</div>
									</div>
								</DropdownMenuItem>

								<DropdownMenuItem disabled className='px-4 py-3 text-white/40'>
									<div className="flex items-center gap-3 w-full">
										<Wallet2 size={16} />
										<div className="flex flex-col">
											<span>Billing</span>
											<span className="text-white/30 text-xs">Coming soon</span>
										</div>
									</div>
								</DropdownMenuItem>

								<DropdownMenuItem disabled className='px-4 py-3 text-white/40'>
									<div className="flex items-center gap-3 w-full">
										<AlbumIcon size={16} />
										<div className="flex flex-col">
											<span>Subscription</span>
											<span className="text-white/30 text-xs">Coming soon</span>
										</div>
									</div>
								</DropdownMenuItem>

								<DropdownMenuSeparator className="bg-white/10" />

								<DropdownMenuItem
									className='hover:bg-red-500/10 px-4 py-3 text-red-400 hover:text-red-300 transition-colors duration-200'
									onClick={handleLogOut}
								>
									<div className="flex items-center gap-3 w-full">
										<LogOut size={16} />
										<span>Log Out</span>
									</div>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>
			</div>

			{/* Mobile Navigation */}
			<div className='lg:hidden flex justify-center px-6 pb-4'>
				<div className='space-x-1 grid grid-cols-4 bg-white/5 p-2 rounded-2xl w-[95%] sm:max-w-[75%]'>
					{navBtns.map((data, index) => {
						const Icon = data.icon
						const isActive = data.path === pathname

						return (
							<Link
								key={index}
								href={data.path}
								className={`flex flex-col items-center gap-1 px-4 py-3 rounded-xl transition-all duration-300 ${isActive
									? 'bg-[#636fac]/20 text-white'
									: 'text-white/60 hover:text-white hover:bg-white/10'
									}`}
							>
								<Icon size={20} className={isActive ? 'text-[#636fac]' : ''} />
								<span className='font-medium text-xs'>{data.label}</span>
							</Link>
						)
					})}
				</div>
			</div>
		</nav >
	)
}

export default NavBar