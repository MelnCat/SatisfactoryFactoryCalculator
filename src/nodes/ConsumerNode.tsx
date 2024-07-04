import { ConsumerMachine } from "@/machine/machines";
import { MachinesContext } from "@/machine/MachinesContext";
import { useContext } from "react";
import { Handle, NodeProps, Position } from "reactflow";
import nodeStyles from "./Node.module.scss";

export const ConsumerNode = ({ data }: NodeProps<ConsumerMachine>) => {
	const machines = useContext(MachinesContext);
	return (
		<>
			<Handle type="target" position={Position.Top} id="0" />
			<div className={nodeStyles.nodeContainer}>
				<h1>{data.name}</h1>
				<p>Inputs:</p>
				<ul>
					{data.getEffectiveInputs(machines).map(x => (
						<li key={`${x.count}${x.type}`}>
							{x.count} {x.type}
						</li>
					))}
				</ul>
			</div>
		</>
	);
};
