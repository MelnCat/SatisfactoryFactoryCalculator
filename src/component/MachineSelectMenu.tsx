import { Dispatch, SetStateAction, useRef } from "react";
import { useOnClickOutside } from "usehooks-ts";
import styles from "./MachineSelectMenu.module.scss";
import { ConsumerMachine, ConverterMachine, Machine, MergerMachine, ProducerMachine, SplitterMachine } from "@/machine/machines";
import { Node, useReactFlow } from "reactflow";
import { recipes } from "@/data/recipes";

const machineList = [
	{ name: "Output", machine: new ConsumerMachine("", "Output", "") },
	{ name: "Splitter", machine: new SplitterMachine("", "Splitter", "") },
	{ name: "Merger", machine: new MergerMachine("", "Merger", "") },
	{ name: "Miner MK1", machine: new ProducerMachine("", "Miner MK1", "miner_mk1", 1, []) },
	{ name: "Miner MK2", machine: new ProducerMachine("", "Miner MK2", "miner_mk1", 2, []) },
	{ name: "Miner MK3", machine: new ProducerMachine("", "Miner MK3", "miner_mk1", 4, []) },
	{ name: "Smelter", machine: new ConverterMachine("", "Smelter", "smelter", 1, [], []) },
	{ name: "Constructor", machine: new ConverterMachine("", "Constructor", "constructor", 1, [], []) },
	{ name: "Assembler", machine: new ConverterMachine("", "Assembler", "assembler", 1, [], []) }
];

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
		const toAdd = Object.assign(Object.create(Object.getPrototypeOf(machine)), structuredClone({ ...machine, id: Math.random().toString() })) as Machine;
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
