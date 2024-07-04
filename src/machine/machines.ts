export interface Item {
	type: string;
	count: number;
}

export interface BaseMachine {
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
}

export abstract class AbstractMachine {
	constructor(public id: string, public name: string) {}
}

export class ProducerMachine extends AbstractMachine implements OutputMachine {
	outputConnections = [];

	constructor(id: string, name: string, public speed: number, public recipeOutputs: Item[]) {
		super(id, name);
	}

	calculateOutputs(inputs: Item[]): Item[] {
		return this.recipeOutputs.map(x => ({ ...x, count: x.count * this.speed }));
	}
}

export class ConsumerMachine extends AbstractMachine implements InputMachine {
	inputConnections = [];

	constructor(id: string, name: string, public recipeInputs: Item[]) {
		super(id, name);
	}

}

export class ConverterMachine extends AbstractMachine implements InputMachine, OutputMachine {
	inputConnections = [];
	outputConnections = [];

	constructor(id: string, name: string, public speed: number, public inputs: Item[], public recipeInputs: Item[], public recipeOutputs: Item[]) {
		super(id, name);
	}

	calculateOutputs(inputs: Item[]): Item[] {
		if (this.recipeInputs.length !== inputs.length) return [];
		if (this.recipeInputs.some(x => !inputs.some(y => y.type === x.type))) return [];
		
		const rate = Math.min(...inputs.map((x, i) => x.count / this.recipeInputs[i].count));
	}
}