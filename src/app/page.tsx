"use client";
import Image from "next/image";
import styles from "./page.module.css";
import ReactFlow, { Background, Controls } from "reactflow";

export default function Home() {
	return (
		<main className={styles.main}>
			<div className={styles.flowContainer}>
				<ReactFlow>
					<Background />
					<Controls />
				</ReactFlow>
			</div>
		</main>
	);
}
