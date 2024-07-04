import { ConverterMachine } from "@/machine/machines";
import { MachinesContext } from "@/machine/MachinesContext";
import { useContext, useEffect } from "react";
import { Handle, NodeProps, Position, useUpdateNodeInternals } from "reactflow";
import nodeStyles from "./Node.module.scss";
import { numberFormat } from "@/data/format";

export const ConverterNode = ({ data }: NodeProps<ConverterMachine>) => {
	const updateNodeInternals = useUpdateNodeInternals();
	const machines = useContext(MachinesContext);
	useEffect(() => updateNodeInternals(data.id), [data, updateNodeInternals]);
	return (
		<>
			{data.recipeInputs.map((_, i) => (
				<Handle key={i} type="target" position={Position.Top} id={i.toString()} style={{ left: `${((i + 1) * 100) / (data.recipeInputs.length + 1)}%` }} />
			))}
			<div className={nodeStyles.nodeContainer}>
				<h1>{data.name}</h1>
				<p className={nodeStyles.recipeName}>{data.recipeName}</p>
				<p>Current Output: {data.getEffectiveOutputs(machines).map(x => `${numberFormat.format(x.count)} ${x.type}`).join(", ") || "None"}</p>
			</div>
			<Handle type="source" position={Position.Bottom} id="0" />
		</>
	);
};
