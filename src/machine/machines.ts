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

export interface InputMachine extends BaseMachine {
	recipeInputs: Item[];
	inputConnections: OutputMachine[];
}

export interface OutputMachine extends BaseMachine {
	recipeOutputs: Item[];
	outputConnections: InputMachine[];

	calculateOutputs: (inputs: Item[]) => Item[];
	getOutputs: () => Item[];
}

export abstract class AbstractMachine implements BaseMachine {
	abstract readonly type: string;
	constructor(public id: string, public name: string) {}
}

export class ProducerMachine extends AbstractMachine implements OutputMachine {
	readonly type = "producer";
	outputConnections: InputMachine[] = [];

	constructor(id: string, name: string, public speed: number, public recipeOutputs: Item[]) {
		super(id, name);
	}

	calculateOutputs(inputs: Item[]): Item[] {
		return this.recipeOutputs.map(x => ({ ...x, count: x.count * this.speed }));
	}

	getOutputs() {
		return this.calculateOutputs([]);
	}
}

export class ConsumerMachine extends AbstractMachine implements InputMachine {
	readonly type = "consumer";
	inputConnections: OutputMachine[] = [];

	constructor(id: string, name: string, public recipeInputs: Item[]) {
		super(id, name);
	}
}

export class ConverterMachine extends AbstractMachine implements InputMachine, OutputMachine {
	readonly type = "converter";
	inputConnections: OutputMachine[] = [];
	outputConnections: InputMachine[] = [];

	constructor(id: string, name: string, public speed: number, public recipeInputs: Item[], public recipeOutputs: Item[]) {
		super(id, name);
	}

	calculateOutputs(inputs: Item[]): Item[] {
		if (this.recipeInputs.length !== inputs.length) return [];
		const lowest = Math.min(...this.recipeInputs.map((x, i) => (inputs[i].count / x.count) * this.speed));
		return this.recipeOutputs.map((x, i) => ({ ...x, count: x.count * lowest * this.speed }));
	}

	getOutputs() {
		return this.calculateOutputs(this.inputConnections.map(x => x.getOutputs()[x.outputConnections.indexOf(this)]));
	}
}

export type Machine = ProducerMachine | ConsumerMachine | ConverterMachine;