export const recipes = {
	miner_mk1: [
		{
			name: "Normal Iron",
			output: { type: "ironOre", count: 60 },
		},
		{
			name: "Pure Iron",
			output: { type: "ironOre", count: 120 },
		},
		{
			name: "Impure Iron",
			output: { type: "ironOre", count: 30 },
		},
	],
	smelter: [
		{
			name: "Iron Ingot",
			input: { type: "ironOre", count: 1 },
			output: { type: "ironIngot", count: 1 },
			speed: 30,
		},
		{
			name: "Copper Ingot",
			input: { type: "copperOre", count: 1 },
			output: { type: "copperIngot", count: 1 },
			speed: 30,
		},
		{
			name: "Caterium Ingot",
			input: { type: "cateriumOre", count: 3 },
			output: { type: "cateriumIngot", count: 1 },
			speed: 15,
		},
	],
	constructor: [
		{
			name: "Iron Plate",
			input: { type: "ironIngot", count: 3 },
			output: { type: "ironPlate", count: 2 },
			speed: 10,
		},
		{
			name: "Iron Rod",
			input: { type: "ironIngot", count: 1 },
			output: { type: "ironRod", count: 1 },
			speed: 15,
		},
		{
			name: "Screw",
			input: { type: "ironRod", count: 1 },
			output: { type: "ironScrew", count: 4 },
			speed: 10,
		},
		{
			name: "Cast Screw [Alt]",
			input: { type: "ironIngot", count: 5 },
			output: { type: "ironScrew", count: 20 },
			speed: 2.5,
		},
		{
			name: "Wire",
			input: { type: "copperIngot", count: 1 },
			output: { type: "wire", count: 2 },
			speed: 15,
		},
		{
			name: "Cable",
			input: { type: "wire", count: 2 },
			output: { type: "cable", count: 1 },
			speed: 30,
		},
		{
			name: "Copper Sheet",
			input: { type: "copperIngot", count: 2 },
			output: { type: "copperSheet", count: 1 },
			speed: 10,
		},
	],
	assembler: [
		{
			name: "Reinforced Iron Plate",
			input: [
				{ type: "ironPlate", count: 6 },
				{ type: "ironScrew", count: 12 },
			],
			output: { type: "reinforcedIronPlate", count: 1 },
			speed: 5,
		},
		{
			name: "Rotor",
			input: [
				{ type: "ironRod", count: 5 },
				{ type: "ironScrew", count: 25 },
			],
			output: { type: "rotor", count: 1 },
			speed: 4,
		},
		{
			name: "Modular Frame",
			input: [
				{ type: "reinforcedIronPlate", count: 3 },
				{ type: "ironRod", count: 12 },
			],
			output: { type: "modularFrame", count: 1 },
			speed: 2,
		},
		{
			name: "Smart Plating",
			input: [
				{ type: "reinforcedIronPlate", count: 2 },
				{ type: "rotor", count: 2 },
			],
			output: { type: "smartPlating", count: 1 },
			speed: 2.5,
		},
	],
};
