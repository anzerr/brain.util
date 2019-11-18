
const {Network} = require('./index');

const dataset = [
	{inputs: [0, 0], outputs: [0]},
	{inputs: [0, 1], outputs: [0]},
	{inputs: [1, 0], outputs: [0]},
	{inputs: [1, 1], outputs: [1]}
];

let network = new Network({
	input: 2,
	hidden1: 2,
	outputs: 1
});

const train = (iterations = 1) => {
	while (iterations > 0) {
		dataset.map((datum) => {
			network.activate(datum.inputs);
			network.propagate(datum.outputs);
		});
		iterations--;
	}
};

train(10000);
network.load(network.save());

console.log(network.activate([0, 0])); // ~0 (0.01214291222508886)
console.log(network.activate([0, 1])); // ~0 (0.08100696632854297)
console.log(network.activate([1, 0])); // ~0 (0.07793351045035582)
console.log(network.activate([1, 1])); // ~1 (0.8780115291725155)
