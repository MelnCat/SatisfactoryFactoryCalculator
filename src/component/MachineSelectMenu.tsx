import { Dispatch, SetStateAction, useRef } from "react";
import { useOnClickOutside } from "usehooks-ts";
import styles from "./MachineSelectMenu.module.scss";
import { Machine, ProducerMachine } from "@/machine/machines";
import { Node, useReactFlow } from "reactflow";
import { recipes } from "@/data/recipes";

const machineList = [{ name: "Miner MK1", machine: new ProducerMachine("", "Miner", "miner", 60, [recipes.miner_mk1[0].output]) }];

export const MachineSelectMenu = ({
	setMachineMenu,
	setMachines,
	setNodes,
}: {
	setMachineMenu: Dispatch<SetStateAction<boolean>>;
	setMachines: Dispatch<SetStateAction<Machine[]>>;
	setNodes: Dispatch<SetStateAction<Node[]>>;
}) => {
	const ref = useRef(null);
	const handleClickOutside = () => {
		setMachineMenu(false);
	};
	useOnClickOutside(ref, handleClickOutside, "focusin");
	return (
		<article className={styles.menu} ref={ref}>
			{machineList.map(x => (
				<MachineSelectButton key={x.name} machine={x.machine} name={x.name} setMachineMenu={setMachineMenu} setMachines={setMachines} setNodes={setNodes} />
			))}
		</article>
	);
};

export const MachineSelectButton = ({
	machine,
	name,
	setMachineMenu,
	setMachines,
	setNodes,
}: {
	machine: Machine;
	name: string;
	setMachineMenu: Dispatch<SetStateAction<boolean>>;
	setMachines: Dispatch<SetStateAction<Machine[]>>;
	setNodes: Dispatch<SetStateAction<Node[]>>;
}) => {
	const a = useReactFlow();
	const onClick = () => {
		setMachineMenu(false);
		const toAdd = Object.assign(Object.create(Object.getPrototypeOf(machine)), { ...machine, id: Math.random().toString() }) as Machine;
		setNodes(nodes => [
			...nodes,
			{
				id: toAdd.id,
				type: toAdd.type,
				position: { x: -a.getViewport().x, y: -a.getViewport().y },
				data: toAdd,
			},
		]);
		setMachines(machines => {
			return [...machines, toAdd];
		});
	};
	return <button onClick={onClick}>{name}</button>;
};
