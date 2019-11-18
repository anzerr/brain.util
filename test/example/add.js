
const {Network} = require('../../index'),
	util = require('../util.js');

let network = new Network({
	input: 2,
	hidden1: 10,
	hidden2: 10,
	outputs: 1
});

const train = (max = 1) => {
	for (let i = 0; i < max; i++) {
		let a = [Math.random() * 0.5, Math.random() * 0.5];
		network.activate([a[0], a[1]]);
		network.propagate([a[0] + a[1]]);
	}
};

console.log('train', util.run(1, () => {
	train(100000);
}));
network.load(network.save());

for (let i = 0; i < 10; i++) {
	let a = [Math.random() * 0.5, Math.random() * 0.5];
	console.log(network.activate(a), a[0] + a[1]);
}
