"use client";
import { ConsumerMachine, ConverterMachine, InputMachine, Machine, OutputMachine, ProducerMachine, SplitterMachine } from "@/machine/machines";
import { MachinesContext } from "@/machine/MachinesContext";
import { ConsumerNode } from "@/nodes/ConsumerNode";
import { ConverterNode } from "@/nodes/ConverterNode";
import { ProducerNode } from "@/nodes/ProducerNode";
import { useCallback, useState } from "react";
import ReactFlow, { addEdge, applyEdgeChanges, applyNodeChanges, Background, Controls, Edge, Node, NodeMouseHandler, OnConnect, OnEdgesChange, OnNodesChange } from "reactflow";
import styles from "./page.module.css";
import { SplitterNode } from "@/nodes/SplitterNode";
import { ContextMenu, ContextMenuData } from "@/component/ContextMenu";

const nodeTypes = {
	producer: ProducerNode,
	consumer: ConsumerNode,
	converter: ConverterNode,
	splitter: SplitterNode,
};

export default function Home() {
	const [machines, setMachines] = useState<Machine[]>([
		new ProducerMachine("1", "Miner", 60, [{ type: "ironOre", count: 1 }]),
		new ConsumerMachine("2", "Output", [{ type: "ironIngot", count: 1 }]),
		new ConverterMachine("3", "Smelter", 30, [{ type: "ironOre", count: 1 }], [{ type: "ironIngot", count: 1 }]),
		new SplitterMachine("4", "Splitter"),
		new SplitterMachine("5", "Splitter"),
		new SplitterMachine("6", "Splitter"),
		// add the iron products (rod, plate, screw, etc)
		new ConverterMachine("7", "Constructor", 15, [{ type: "ironIngot", count: 1 }], [{ type: "ironRod", count: 1 }]),
		new ConverterMachine("8", "Constructor", 10, [{ type: "ironIngot", count: 2 }], [{ type: "ironPlate", count: 3 }]),
		new ConverterMachine("9", "Constructor", 10, [{ type: "ironRod", count: 1 }], [{ type: "ironScrew", count: 4 }]),
		new ConverterMachine("9", "Assembler", 5, [{ type: "ironPlate", count: 6 }, { type: "ironScrew", count: 12 }], [{ type: "reinforcedIronPlate", count: 4 }]),
		

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
	const [menuData, setMenuData] = useState<ContextMenuData | null>(null);

	const onNodesChange = useCallback<OnNodesChange>(changes => setNodes(nds => applyNodeChanges(changes, nds)), []);
	const onEdgesChange = useCallback<OnEdgesChange>(changes => setEdges(eds => applyEdgeChanges(changes, eds)), []);
	const onConnect = useCallback<OnConnect>(params => {
		setEdges(eds => {
			setMachines(machines => {
				const newMachines = machines.map(x => Object.assign(Object.create(Object.getPrototypeOf(x)), x));
				const source = newMachines.find(x => x.id === params.source) as OutputMachine;
				const target = newMachines.find(x => x.id === params.target) as InputMachine;
				if (source.outputConnections[+params.sourceHandle!] !== undefined)
					newMachines.find(x => x.id === source.outputConnections[+params.sourceHandle!])!.inputConnections[
						newMachines.find(x => x.id === source.outputConnections[+params.sourceHandle!])!.inputConnections.indexOf(source.id)
					] = undefined;
				if (target.inputConnections[+params.targetHandle!] !== undefined)
					newMachines.find(x => x.id === target.inputConnections[+params.targetHandle!])!.outputConnections[
						newMachines.find(x => x.id === target.inputConnections[+params.targetHandle!])!.outputConnections.indexOf(target.id)
					] = undefined;
				source.outputConnections[+params.sourceHandle!] = target.id;
				target.inputConnections[+params.targetHandle!] = source.id;
				return newMachines;
			});
			return addEdge(
				params,
				eds.filter(x => !((x.source === params.source && x.sourceHandle === params.sourceHandle) || (x.target === params.target && x.targetHandle === params.targetHandle)))
			);
		});
	}, []);
	const onNodeContextMenu = useCallback<NodeMouseHandler>((event, node) => {
		event.preventDefault();
		setMenuData({
			x: event.clientX,
			y: event.clientY,
			nodeId: node.id,
			data: node.data,
		});
	}, []);
	const onPaneClick = useCallback(() => {
		setMenuData(null);
	}, []);
	return (
		<MachinesContext.Provider value={machines}>
			<main className={styles.main}>
				<div className={styles.flowContainer}>
					<ReactFlow
						nodes={nodes}
						edges={edges}
						onNodesChange={onNodesChange}
						onEdgesChange={onEdgesChange}
						onConnect={onConnect}
						nodeTypes={nodeTypes}
						onNodeContextMenu={onNodeContextMenu}
						onPaneClick={onPaneClick}
					>
						<Background />
						{menuData && <ContextMenu setMachines={setMachines} data={menuData} setNodes={setNodes} setMenuData={setMenuData} setEdges={setEdges} />}
					</ReactFlow>
				</div>
			</main>
		</MachinesContext.Provider>
	);
}
