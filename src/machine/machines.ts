import { Mixin } from "ts-mixer";
export interface Item {
	type: string;
	count: number;
}

export interface BaseMachine {
	readonly type: string;
	id: string;
	name: string;
}

export interface ProcessingMachine extends BaseMachine {
	speed: number; // Operations per minute
}

export abstract class AbstractMachine implements BaseMachine {
	abstract readonly type: string;
	constructor(public id: string, public name: string) {}
}

export abstract class InputMachine extends AbstractMachine {
	inputConnections: (string | undefined)[] = [];
	getEffectiveInputs(machines: Machine[]) {
		return this.inputConnections
			.map(x => (x === undefined ? undefined : (machines.find(y => y.id === x) as OutputMachine)))
			.map(x => x?.getEffectiveOutputs(machines)[x.outputConnections.indexOf(this.id)])
			.filter(x => x !== undefined);
	}
}

export abstract class OutputMachine extends AbstractMachine {
	outputConnections: (string | undefined)[] = [];

	abstract calculateOutputs(inputs: Item[]): Item[];
	getEffectiveOutputs(machines: Machine[]): Item[] {
		return "getEffectiveInputs" in this ? this.calculateOutputs((this as unknown as InputMachine).getEffectiveInputs(machines)) : this.calculateOutputs([]);
	}
}

export class ProducerMachine extends OutputMachine {
	readonly type = "producer";

	constructor(id: string, name: string, public speed: number, public recipeOutputs: Item[]) {
		super(id, name);
	}

	calculateOutputs(inputs: Item[]): Item[] {
		return this.recipeOutputs.map(x => ({ ...x, count: x.count * this.speed }));
	}
}

export class ConsumerMachine extends InputMachine {
	readonly type = "consumer";

	constructor(id: string, name: string, public recipeInputs: Item[]) {
		super(id, name);
	}
}

export class ConverterMachine extends Mixin(InputMachine, OutputMachine) {
	readonly type = "converter";

	constructor(id: string, name: string, public speed: number, public recipeInputs: Item[], public recipeOutputs: Item[]) {
		super(id, name);
	}

	calculateOutputs(inputs: Item[]): Item[] {
		if (this.recipeInputs.length !== inputs.length) return [];
		const lowest = Math.min(...this.recipeInputs.map((x, i) => ((inputs.find(y => y.type === x.type)?.count ?? 0) / (x.count * this.speed))), 1);
		return this.recipeOutputs.map((x, i) => ({ ...x, count: x.count * lowest * this.speed }));
	}
}

export class SplitterMachine extends Mixin(InputMachine, OutputMachine) {
	readonly type = "splitter";

	calculateOutputs(inputs: Item[]): Item[] {
		if (inputs.length === 0) return [];
		const populated = this.outputConnections.filter(x => x !== undefined).length;
		return this.outputConnections.map(x => x === undefined ? ({ type: inputs[0].type, count: 0 }) : ({ type: inputs[0].type, count: inputs[0].count / populated }));
	}
}

export class MergerMachine extends Mixin(OutputMachine, InputMachine) {
	readonly type = "merger";

	calculateOutputs(inputs: Item[]): Item[] {
		if (inputs.some(x => x.type !== inputs[0].type)) return [];
		return [{ type: inputs[0].type, count: inputs.reduce((acc, x) => acc + x.count, 0) }];
	}
}

export type Machine = ProducerMachine | ConsumerMachine | ConverterMachine | SplitterMachine;
