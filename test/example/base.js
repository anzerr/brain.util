
const {Network} = require('../../index'),
	util = require('../util.js');

let network = new Network({
	input: 2,
	hidden1: 10,
	hidden2: 10,
	outputs: 10
});

const run = () => {
	let a = [Math.random(), Math.random()];
	let active = network.activate([a[0], a[1]]);
	let n = Math.floor(((Math.floor(a[0] * 10) * 10) + (a[1] * 10)) / 10), o = [];
	for (let x = 0; x < 10; x++) {
		o[x] = 0;
	}
	o[n] = 1;
	network.propagate(o);
	return {
		value: ((Math.floor(a[0] * 10) * 10) + (a[1] * 10)),
		input: a,
		output: active,
		valid: o
	};
};

const train = (max = 1) => {
	for (let i = 0; i < max; i++) {
		run();
	}
};

console.log('train', util.run(1, () => {
	train(200000);
}));
network.load(network.save());

for (let i = 0; i < 5; i++) {
	let result = run();
	let max = [0, 0];
	for (let x in result.output) {
		if (result.output[x] > max[0]) {
			max = [result.output[x], x];
		}
	}
	let out = [];
	for (let x in result.output) {
		out.push((x === max[1]) ? 1 : 0);
	}
	console.log('input', result.value, result.input);
	console.log(out);
	console.log(result.valid);
}
