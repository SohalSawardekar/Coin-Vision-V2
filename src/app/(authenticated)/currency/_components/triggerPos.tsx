'use client'
import { useSidebar } from "@/components/ui/sidebar";
import clsx from "clsx";

export function MainContent({ children }: { children: React.ReactNode }) {
	const { open } = useSidebar(); // <-- sidebar open/close state
	return (
		<div
			className="transition-all duration-300"
			style={{
				transform: open ? "translateX(var(--sidebar-width))" : "translateX(0)",
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
				open && "md:blur-md md:pointer-events-none" // blur + disable clicks on md+
			)}
		>
			{children}
		</div>
	)
}