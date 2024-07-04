import { ConverterMachine } from "@/machine/machines";
import { MachinesContext } from "@/machine/MachinesContext";
import { useContext } from "react";
import { Handle, NodeProps, Position } from "reactflow";
import nodeStyles from "./Node.module.scss";

export const ConverterNode = ({ data }: NodeProps<ConverterMachine>) => {
	const machines = useContext(MachinesContext);
	return (
		<>
			{data.recipeInputs.map((_, i) => (
				<Handle key={i} type="target" position={Position.Top} id={i.toString()} style={{ left: `${((i + 1) * 100) / (data.recipeInputs.length + 1)}%` }} />
			))}
			<div className={nodeStyles.nodeContainer}>
				<h1>{data.name}</h1>
				{data.recipeInputs.map((input, index) => (
					<p key={index}>
						In: {input.count * data.speed} {input.type} / min
					</p>
				))}

				<p>
					Out: {data.recipeOutputs[0].count * data.speed} {data.recipeOutputs[0].type} / min
				</p>
				<p>Current Output: {data.getEffectiveOutputs(machines).map(x => x.type + x.count)}</p>
			</div>
			<Handle type="source" position={Position.Bottom} id="0" />
		</>
	);
};
