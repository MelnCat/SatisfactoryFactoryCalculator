import { BaseEdge, EdgeProps, getStraightPath } from "reactflow";

export const CustomEdge = ({ id, sourceX, sourceY, targetX, targetY }: EdgeProps) => {
	const [edgePath] = getStraightPath({
		sourceX,
		sourceY,
		targetX,
		targetY,
	});

	return <BaseEdge id={id} path={edgePath} />;
};
