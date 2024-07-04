import { ConsumerMachine, ProducerMachine } from "@/machine/machines";
import { useCallback } from "react";
import { Handle, NodeProps, Position } from "reactflow";
import nodeStyles from "./Node.module.scss";

export const ConsumerNode = ({ data }: NodeProps<ConsumerMachine>) => {
	return (
		<>
			<Handle type="target" position={Position.Top} id="0" />
			<div className={nodeStyles.nodeContainer}>
				<h1>{data.name}</h1>
				<p>{data.recipeInputs[0].count} {data.recipeInputs[0].type}</p>
				<p>Speed: {data.inputConnections.length ? data.inputConnections[0].getOutputs()[0].count / data.recipeInputs[0].count : 0}</p>
			</div>
		</>
	);
};
