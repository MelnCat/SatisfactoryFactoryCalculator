import { ConsumerMachine, MergerMachine, SplitterMachine } from "@/machine/machines";
import { MachinesContext } from "@/machine/MachinesContext";
import { useContext } from "react";
import { Handle, NodeProps, Position } from "reactflow";
import nodeStyles from "./Node.module.scss";

export const MergerNode = ({ data }: NodeProps<MergerMachine>) => {
	const machines = useContext(MachinesContext);
	return (
		<>
			<Handle type="target" position={Position.Top} id="0" style={{ left: "25%" }} />
			<Handle type="target" position={Position.Top} id="1" style={{ left: "50%" }} />
			<Handle type="target" position={Position.Top} id="2" style={{ left: "75%" }} />
			<div className={nodeStyles.nodeContainer}>
				<h1>{data.name}</h1>
			</div>
			<Handle type="source" position={Position.Bottom} id="0" />
		</>
	);
};
