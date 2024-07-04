import { Dispatch, SetStateAction, useContext, useRef, useState } from "react";
import { useOnClickOutside } from "usehooks-ts";
import styles from "./RecipeSelectMenu.module.scss";
import { Machine, ProducerMachine } from "@/machine/machines";
import { Node, useReactFlow } from "reactflow";
import { recipes } from "@/data/recipes";
import { MachinesContext } from "@/machine/MachinesContext";

export const RecipeSelectMenu = ({
	setRecipeMenu,
	setMachines,
	setNodes,
	machine,
}: {
	setRecipeMenu: Dispatch<SetStateAction<Machine | null>>;
	setMachines: Dispatch<SetStateAction<Machine[]>>;
	setNodes: Dispatch<SetStateAction<Node[]>>;
	machine: Machine;
}) => {
	const ref = useRef(null);
	const recipeList = recipes[machine.tag as keyof typeof recipes] ?? [];
	const handleClickOutside = () => {
		setRecipeMenu(null);
	};
	useOnClickOutside(ref, handleClickOutside, "focusin");
	return (
		<article className={styles.menu} ref={ref}>
			{recipeList.map(x => (
				<RecipeSelectButton key={x.name} machine={machine} recipe={x} setRecipeMenu={setRecipeMenu} setMachines={setMachines} setNodes={setNodes} />
			))}
		</article>
	);
};

export const RecipeSelectButton = ({
	machine,
	recipe,
	setRecipeMenu,
	setMachines,
	setNodes,
}: {
	machine: Machine;
	recipe: (typeof recipes)[keyof typeof recipes][0];
	setRecipeMenu: Dispatch<SetStateAction<Machine | null>>;
	setMachines: Dispatch<SetStateAction<Machine[]>>;
	setNodes: Dispatch<SetStateAction<Node[]>>;
}) => {
	const machines = useContext(MachinesContext);
	const onClick = () => {
		setRecipeMenu(null);
		const newMachines = machines.map(x => Object.assign(Object.create(Object.getPrototypeOf(x)), x)) as Machine[];
		const m = newMachines.find(x => x.id === machine.id)!;
		if ("recipeInputs" in m) {
			if ("input" in recipe) m.recipeInputs = recipe.input instanceof Array ? recipe.input : [recipe.input];
		}
		if ("recipeOutputs" in m) {
			if ("output" in recipe) m.recipeOutputs = recipe.output instanceof Array ? recipe.output : [recipe.output];
		}
		if ("speed" in m && "speed" in recipe) m.speed = recipe.speed;
		m.recipeName = recipe.name;
		setMachines(newMachines);
		setNodes(nodes => nodes.map(x => ({ ...x, data: newMachines.find(y => x.id === y.id) })));
	};
	const firstOutput = (recipe.output instanceof Array ? recipe.output : [recipe.output])[0];
	return (
		<button onClick={onClick}>
			<h2>{recipe.name}</h2>
			{"input" in recipe ? (
				<p>
					{(recipe.input instanceof Array ? recipe.input : [recipe.input]).map(x => `${x.count} ${x.type}`).join(", ")} {"→"}
					{(recipe.output instanceof Array ? recipe.output : [recipe.output]).map(x => `${x.count} ${x.type}`).join(", ")}{" "}
				</p>
			) : (
				<p>
					{firstOutput.count} {firstOutput.type}{" "}
				</p>
			)}
			{"speed" in recipe && <p>{firstOutput.count * recipe.speed} / min</p>}
		</button>
	);
};
