"use client";
import Image from "next/image";
import styles from "./page.module.css";
import ReactFlow, {
	Background,
	Controls,
	Node,
	Edge,
	applyNodeChanges,
	applyEdgeChanges,
	NodeChange,
	EdgeChange,
	OnConnect,
	addEdge,
	OnEdgesChange,
	OnNodesChange,
} from "reactflow";
import { ConsumerMachine, ConverterMachine, InputMachine, Machine, OutputMachine, ProducerMachine } from "@/machine/machines";
import { useCallback, useState } from "react";
import { ProducerNode } from "@/nodes/ProducerNode";
import { ConsumerNode } from "@/nodes/ConsumerNode";
import { ConverterNode } from "@/nodes/ConverterNode";

const nodeTypes = {
	producer: ProducerNode,
	consumer: ConsumerNode,
	converter: ConverterNode,
};

export default function Home() {
	const [machines, setMachines] = useState<Machine[]>([
		new ProducerMachine("1", "Iron Miner", 60, [{ type: "ironOre", count: 1 }]),
		new ConsumerMachine("2", "Iron Eater", [{ type: "ironIngot", count: 1 }]),
		new ConverterMachine("3", "Iron Smelter", 30, [{ type: "ironOre", count: 1 }], [{ type: "ironIngot", count: 1 }]),
	]);

	const [nodes, setNodes] = useState<Node[]>(
		machines.map(x => ({
			id: x.id,
			data: x,
			position: { x: 0, y: 0 },
			type: x.type,
		}))
	);
	const [edges, setEdges] = useState<Edge[]>([]);
	const onNodesChange = useCallback<OnNodesChange>(changes => setNodes(nds => applyNodeChanges(changes, nds)), []);
	const onEdgesChange = useCallback<OnEdgesChange>(changes => setEdges(eds => applyEdgeChanges(changes, eds)), []);
	const onConnect = useCallback<OnConnect>(
		params => {
			setEdges(eds => addEdge(params, eds));
			setMachines(machines => {
				const source = machines.find(x => x.id === params.source) as OutputMachine;
				const target = machines.find(x => x.id === params.target) as InputMachine;
				source.outputConnections[+params.sourceHandle!] = target;
				target.inputConnections[+params.targetHandle!] = source;
				return machines;
			});
		
		},
		[]
	);
	return (
		<main className={styles.main}>
			<div className={styles.flowContainer}>
				<ReactFlow nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect} nodeTypes={nodeTypes}>
					<Background />
					<Controls />
				</ReactFlow>
			</div>
		</main>
	);
}
