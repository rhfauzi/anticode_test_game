import React, { ReactNode } from "react";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
	title: "Tile Game",
	description: "A fun tile collection game built with Next.js",
};

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en">
			<body className={inter.className + " bg-black"}>{children}</body>
		</html>
	);
}
