"use client";
import { ConsumerMachine, ConverterMachine, InputMachine, Machine, OutputMachine, ProducerMachine, SplitterMachine } from "@/machine/machines";
import { MachinesContext } from "@/machine/MachinesContext";
import { ConsumerNode } from "@/nodes/ConsumerNode";
import { ConverterNode } from "@/nodes/ConverterNode";
import { ProducerNode } from "@/nodes/ProducerNode";
import { useCallback, useState } from "react";
import ReactFlow, {
	addEdge,
	applyEdgeChanges,
	applyNodeChanges,
	Background,
	Controls,
	Edge,
	Node,
	OnConnect,
	OnEdgesChange,
	OnNodesChange
} from "reactflow";
import styles from "./page.module.css";
import { SplitterNode } from "@/nodes/SplitterNode";

const nodeTypes = {
	producer: ProducerNode,
	consumer: ConsumerNode,
	converter: ConverterNode,
	splitter: SplitterNode,
};

export default function Home() {
	const [machines, setMachines] = useState<Machine[]>([
		new ProducerMachine("1", "Iron Miner", 60, [{ type: "ironOre", count: 1 }]),
		new ConsumerMachine("2", "Iron Eater", [{ type: "ironIngot", count: 1 }]),
		new ConverterMachine("3", "Iron Smelter", 30, [{ type: "ironOre", count: 1 }], [{ type: "ironIngot", count: 1 }]),
		new SplitterMachine("4", "Splitter"),
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
	const onConnect = useCallback<OnConnect>(params => {
		setEdges(eds =>
			addEdge(
				params,
				eds.filter(x => !((x.source === params.source && x.sourceHandle === params.sourceHandle) || (x.target === params.target && x.targetHandle === params.targetHandle)))
			)
		);
		setMachines(machines => {
			const newMachines = machines.map(x => Object.assign(Object.create(Object.getPrototypeOf(x)), x));
			const source = newMachines.find(x => x.id === params.source) as OutputMachine;
			const target = newMachines.find(x => x.id === params.target) as InputMachine;
			source.outputConnections[+params.sourceHandle!] = target.id;
			target.inputConnections[+params.targetHandle!] = source.id;
			return newMachines;
		});
	}, []);
	return (
		<MachinesContext.Provider value={machines}>
			<main className={styles.main}>
				<div className={styles.flowContainer}>
					<ReactFlow nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect} nodeTypes={nodeTypes}>
						<Background />
						<Controls />
					</ReactFlow>
				</div>
			</main>
		</MachinesContext.Provider>
	);
}
