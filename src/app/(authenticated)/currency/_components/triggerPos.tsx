'use client'
import { useSidebar } from "@/components/ui/sidebar";
import clsx from "clsx";

export function MainContent({ children }: { children: React.ReactNode }) {
	const { open } = useSidebar(); // <-- sidebar open/close state
	return (
		<div
			className={`transition-all duration-300`}
			style={{
				transform: open ? "translateX(20dvw)" : "translateX(0)",
			}}
		>
			{children}
		</div>
	);
}

export function ContentWithBlur({ children }: { children: React.ReactNode }) {
	const { open } = useSidebar()

	return (
		<div
			className={clsx(
				"flex-1 transition-all duration-300",
				open && "blur-md pointer-events-none" // blur + disable clicks
			)}
		>
			{children}
		</div>
	)
}