import { ConverterMachine } from "@/machine/machines";
import { MachinesContext } from "@/machine/MachinesContext";
import { useContext } from "react";
import { Handle, NodeProps, Position } from "reactflow";
import nodeStyles from "./Node.module.scss";

export const ConverterNode = ({ data }: NodeProps<ConverterMachine>) => {
	const machines = useContext(MachinesContext);
	return (
		<>
			<Handle type="target" position={Position.Top} id="0" />
			<div className={nodeStyles.nodeContainer}>
				<h1>{data.name}</h1>
				<p>
					In: {data.recipeInputs[0].count * data.speed} {data.recipeInputs[0].type} / min
				</p>
				<p>
					Out: {data.recipeOutputs[0].count * data.speed} {data.recipeOutputs[0].type} / min
				</p>
				<p>Current Output: {data.getEffectiveOutputs(machines).map(x => x.type + x.count)}</p>
			</div>
			<Handle type="source" position={Position.Bottom} id="0" />
		</>
	);
};
