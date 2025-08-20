"use client";

import React, { useState } from "react";
import { Image as ImageIcon, Upload, X } from "lucide-react";

export default function ImageUpload({
	file,
	setFile,
}: {
	file: File | null;
	setFile: React.Dispatch<React.SetStateAction<File | null>>;
}) {
	const [drag, setDrag] = useState(false);
	const [preview, setPreview] = useState<string | null>(null);

	const onFile = (f: File) => {
		const ok = ["image/png", "image/jpeg", "image/jpg", "image/gif"].includes(f.type);
		if (!ok) return alert("Please upload PNG/JPG/GIF");
		if (f.size > 15 * 1024 * 1024) return alert("Max size 15MB");
		setFile(f);
		const reader = new FileReader();
		reader.onload = () => setPreview(reader.result as string);
		reader.readAsDataURL(f);
	};

	return (
		<div
			className={`relative p-4 rounded-xl border-2 border-dashed  ${drag ? "border-blue-400" : "border-gray-300"}`}
			onDragOver={(e) => {
				e.preventDefault();
				setDrag(true);
			}}
			onDragLeave={() => setDrag(false)}
			onDrop={(e) => {
				e.preventDefault();
				setDrag(false);
				if (e.dataTransfer.files?.[0]) onFile(e.dataTransfer.files[0]);
			}}
		>
			<input
				type="file"
				accept="image/*"
				className="sr-only"
				id="note-file"
				onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
			/>
			{!preview ? (
				<div className="py-6 text-center">
					<div className="flex justify-center items-center mx-auto mb-3 border rounded-full w-12 h-12">
						<ImageIcon />
					</div>
					<p className="opacity-80">Drop your currency note here</p>
					<p className="opacity-60 text-xs">PNG, JPG, GIF (max 15MB)</p>
					<label
						htmlFor="note-file"
						className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 mt-3 px-3 py-2 border rounded-lg text-black cursor-pointer"
					>
						<Upload size={16} /> Select Image
					</label>
				</div>
			) : (
				<div className="relative">
					<img src={preview} alt="preview" className="rounded-lg w-full max-h-72 object-contain" />
					<button
						className="top-2 right-2 absolute bg-black/60 p-2 rounded-full text-white"
						onClick={() => {
							setFile(null);
							setPreview(null);
						}}
					>
						<X size={16} />
					</button>
				</div>
			)}
		</div>
	);
}