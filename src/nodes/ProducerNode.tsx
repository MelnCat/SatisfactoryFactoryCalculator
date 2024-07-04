import { ProducerMachine } from "@/machine/machines";
import { Handle, NodeProps, Position } from "reactflow";
import nodeStyles from "./Node.module.scss";

export const ProducerNode = ({ data }: NodeProps<ProducerMachine>) => {
	return (
		<>
			<div className={nodeStyles.nodeContainer}>
				<h1>{data.name}</h1>
				<p>{data.recipeOutputs[0].count * data.speed} {data.recipeOutputs[0].type} / min</p>
			</div>
			<Handle type="source" position={Position.Bottom} id="0" />
		</>
	);
};
