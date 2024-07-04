"use client";
import { ConsumerMachine, ConverterMachine, InputMachine, Machine, MergerMachine, OutputMachine, ProducerMachine, SplitterMachine } from "@/machine/machines";
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
	EdgeMouseHandler,
	Node,
	NodeMouseHandler,
	OnConnect,
	OnEdgesChange,
	OnNodesChange,
} from "reactflow";
import styles from "./page.module.css";
import { SplitterNode } from "@/nodes/SplitterNode";
import { ContextMenu, ContextMenuData } from "@/component/ContextMenu";
import { MergerNode } from "@/nodes/MergerNode";
import { MachineSelectMenu } from "@/component/MachineSelectMenu";
import { RecipeSelectButton, RecipeSelectMenu } from "@/component/RecipeSelectMenu";

const nodeTypes = {
	producer: ProducerNode,
	consumer: ConsumerNode,
	converter: ConverterNode,
	splitter: SplitterNode,
	merger: MergerNode,
};

export default function Home() {
	const [machines, setMachines] = useState<Machine[]>([
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
	const [machineMenu, setMachineMenu] = useState<boolean>(false);
	const [recipeMenu, setRecipeMenu] = useState<Machine | null>(null);
	const [menuData, setMenuData] = useState<ContextMenuData | null>(null);

	const onNodesChange = useCallback<OnNodesChange>(changes => setNodes(nds => applyNodeChanges(changes, nds)), []);
	const onEdgesChange = useCallback<OnEdgesChange>(changes => setEdges(eds => applyEdgeChanges(changes, eds)), []);
	const onConnect = useCallback<OnConnect>(params => {
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
		setEdges(eds => {
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
	const onEdgeContextMenu = useCallback<EdgeMouseHandler>((event, edge) => {
		event.preventDefault();
		setEdges(eds => eds.filter(x => x.id !== edge.id));
		const newMachines = machines.map(x => Object.assign(Object.create(Object.getPrototypeOf(x)), x));
		const source = newMachines.find(x => x.id === edge.source) as OutputMachine;
		const target = newMachines.find(x => x.id === edge.target) as InputMachine;
		source.outputConnections[+edge.sourceHandle!] = undefined;
		target.inputConnections[+edge.targetHandle!] = undefined;
		setMachines(newMachines);
		setNodes(nodes => nodes.map(x => ({ ...x, data: newMachines.find(y => y.id === x.id) })));
	}, []);
	const onPaneClick = useCallback(() => {
		setMenuData(null);
		setMachineMenu(false);
		setRecipeMenu(null);
	}, []);
	const onMachineMenuButtonClick = useCallback(() => {
		setMachineMenu(true);
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
						onEdgeContextMenu={onEdgeContextMenu}
					>
						<Background />
						<button className={styles.machineMenuButton} onClick={onMachineMenuButtonClick}>Machines</button>
						{machineMenu && <MachineSelectMenu setMachineMenu={setMachineMenu} setMachines={setMachines} setNodes={setNodes} />}
						{recipeMenu && <RecipeSelectMenu machine={recipeMenu} setRecipeMenu={setRecipeMenu} setMachines={setMachines} setNodes={setNodes} />}

						{menuData && <ContextMenu setRecipeMenu={setRecipeMenu} setMachines={setMachines} data={menuData} setNodes={setNodes} setMenuData={setMenuData} setEdges={setEdges} />}
					</ReactFlow>
				</div>
			</main>
		</MachinesContext.Provider>
	);
}
