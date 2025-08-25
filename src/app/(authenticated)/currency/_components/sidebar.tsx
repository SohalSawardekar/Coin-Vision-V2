'use client'
import * as React from "react"
import { Wallet2, StickyNote, AlertCircleIcon, ArrowLeftRightIcon } from "lucide-react"
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"

const data = {
	navMain: [
		{
			title: "Recognise Currency",
			url: "/currency/recognise",
			symbol: Wallet2
		},
		{
			title: "Currency Conversion",
			url: "/currency/conversion",
			symbol: ArrowLeftRightIcon
		},
		{
			title: "Note Condition",
			url: "/currency/note-condition",
			symbol: StickyNote
		},
		{
			title: "Fake Note",
			url: "/currency/fake-note",
			symbol: AlertCircleIcon
		},
	],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const { setOpen } = useSidebar()
	return (
		<Sidebar variant="floating" {...props} className="relative">
			<SidebarHeader >
				<SidebarMenu>
					<SidebarMenuItem className="p-4 font-semibold text-center">
						Menu
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<Separator className="bg-white" />
			<SidebarContent >
				<SidebarGroup>
					<SidebarMenu className="gap-2">
						{data.navMain.map((item) => (
							<SidebarMenuItem key={item.title}>
								<SidebarMenuButton asChild>
									<Link
										href={item.url}
										className="flex flex-row gap-1 font-medium hover:scale-105 transition-transform duration-200"
										onClick={() => {
											setTimeout(() => {
												setOpen(false)
											}, 500);
										}}>
										{item.symbol && <item.symbol className="inline-block mr-2" />}
										<p className="text-medium">{item.title}</p>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						))}
					</SidebarMenu>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	)
}
