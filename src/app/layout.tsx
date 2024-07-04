import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.scss";
import "reactflow/dist/style.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Satisfactory Factory Calculator",
	description: "1 computer per hour",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={inter.className}>{children}</body>
		</html>
	);
}
