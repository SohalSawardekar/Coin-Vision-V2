import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar"
import { AppSidebar } from "./_components/sidebar"
import { Separator } from "@/components/ui/separator"
import React from "react"
import { ContentWithBlur, MainContent } from "./_components/triggerPos"

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<SidebarProvider
			style={{
				"--sidebar-width": "clamp(220px, 80vw, 320px)",
			} as React.CSSProperties}
		>
			<AppSidebar />
			<SidebarInset className="absolute flex flex-col bg-inherit h-full overflow-x-clip text-white">
				<header className="flex items-center gap-2 px-4 h-16 shrink-0">
					<MainContent>
						<div className="flex flex-row justify-center items-center gap-2">
							<SidebarTrigger className="-ml-1" />
							<Separator
								orientation="vertical"
								className="mr-2 data-[orientation=vertical]:h-4"
							/>
						</div>
					</MainContent>
				</header>

				{/* wrap children in blur container */}
				<ContentWithBlur>{children}</ContentWithBlur>
			</SidebarInset>
		</SidebarProvider>
	)
}
