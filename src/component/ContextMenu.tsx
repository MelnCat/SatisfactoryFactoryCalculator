import { Machine } from "@/machine/machines";
import styles from "./ContextMenu.module.scss";
import { Dispatch, SetStateAction, useRef } from "react";
import { useOnClickOutside } from "usehooks-ts";
import { Edge, Node } from "reactflow";
import { recipes } from "@/data/recipes";

export interface ContextMenuData {
	x: number;
	y: number;
	nodeId: string;
	data: Machine;
}
export const ContextMenu = ({
	data,
	setMachines,
	setNodes,
	setEdges,
	setMenuData,
	setRecipeMenu,
}: {
	data: ContextMenuData;
	setMachines: Dispatch<SetStateAction<Machine[]>>;
	setNodes: Dispatch<SetStateAction<Node[]>>;
	setMenuData: Dispatch<SetStateAction<ContextMenuData | null>>;
	setEdges: Dispatch<SetStateAction<Edge[]>>;
	setRecipeMenu: Dispatch<SetStateAction<Machine | null>>;
}) => {
	const ref = useRef(null);
	const handleClickOutside = () => {
		setMenuData(null);
	};
	useOnClickOutside(ref, handleClickOutside, "focusin");
	return (
		<div ref={ref} className={styles.menu} style={{ top: data.y, left: data.x }}>
			{data.data.tag in recipes && (
				<button
					onClick={() => {
						setMenuData(null);
						setRecipeMenu(data.data);
					}}
				>
					Set Recipe
				</button>
			)}
			<button
				onClick={() => {
					setMachines(machines => {
						const newMachines: Machine[] = machines.map(x => Object.assign(Object.create(Object.getPrototypeOf(x)), x)).filter(x => x.id !== data.nodeId);
						for (const m of newMachines) {
							if ("inputConnections" in m) m.inputConnections = m.inputConnections.map(x => (x === data.nodeId ? undefined : x));
							if ("outputConnections" in m) m.outputConnections = m.outputConnections.map(x => (x === data.nodeId ? undefined : x));
						}
						setNodes(nodes => nodes.filter(x => x.id !== data.nodeId).map(x => ({ ...x, data: newMachines.find(y => y.id === x.id) })));

						return newMachines;
					});
					setEdges(edges => edges.filter(x => x.source !== data.nodeId && x.target !== data.nodeId));
					setMenuData(null);
				}}
			>
				Delete
			</button>
		</div>
	);
};
