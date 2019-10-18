
const Neuron = require('./src/neuron');

const dataset = [
	{inputs: [0, 0], outputs: [0]},
	{inputs: [0, 1], outputs: [0]},
	{inputs: [1, 0], outputs: [0]},
	{inputs: [1, 1], outputs: [1]}
];

const inputs = [new Neuron(), new Neuron()]; // Input Layer w/ 2 neurons
const hiddens = [];
const outputs = [new Neuron()]; // Output Layer w/ 1 neuron

const addHidden = (n) => {
	for (let i = 0; i < n; i++) {
		const nur = new Neuron();
		hiddens.push(nur);
		for (let x in inputs) {
			inputs[x].connect(nur);
		}
		for (let x in outputs) {
			nur.connect(outputs[x]);
		}
	}
};
addHidden(2);

const activate = (input) => {
	inputs.forEach((neuron, i) => neuron.activate(input[i]));
	hiddens.forEach((neuron) => neuron.activate());
	return outputs.map((neuron) => neuron.activate());
};

const propagate = (target) => {
	outputs.forEach((neuron, t) => neuron.propagate(target[t]));
	hiddens.forEach((neuron) => neuron.propagate());
	return inputs.forEach((neuron) => neuron.propagate());
};

const train = (iterations = 1) => {
	while(iterations > 0) {
		dataset.map((datum) => {
			activate(datum.inputs);
			propagate(datum.outputs);
		});
		iterations--;
	}
};

train(10000);

// Test Network
console.log(activate([0, 0])); // ~0 (0.01214291222508886)
console.log(activate([0, 1])); // ~0 (0.08100696632854297)
console.log(activate([1, 0])); // ~0 (0.07793351045035582)
console.log(activate([1, 1])); // ~1 (0.8780115291725155)
