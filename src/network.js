
const Neuron = require('./neuron');

class Network {

	constructor(layer) {
		this.config = layer;
		this.build(layer);
	}

	neuron(data) {
		let n = new Neuron();
		if (data) {
			for (let i in data) {
				if (i !== 'incoming' && i !== 'outgoing') {
					n[i] = data[i];
				}
			}
		}
		return n;
	}

	build(layer, data = {}) {
		this.layer = {};
		let before = null, map = {};
		for (let i in layer) {
			this.layer[i] = [];
			for (let x = 0; x < layer[i]; x++) {
				let d = (data[i] || {})[x], neuron = this.neuron(d);
				map[neuron.id] = d;
				this.layer[i].push(neuron);
			}
			if (before) {
				for (let v in before) {
					for (let x in this.layer[i]) {
						if (map[before[v].id]) {
							before[v].connect(this.layer[i][x], map[before[v].id].outgoing[this.layer[i][x].id]);
						} else {
							before[v].connect(this.layer[i][x]);
						}
					}
				}
			}
			before = this.layer[i];
		}
	}

	each(cd, reverse) {
		let count = 0, keys = Object.keys(this.layer);
		if (reverse) {
			keys = keys.reverse();
		}
		for (let i in keys) {
			let k = keys[i];
			for (let x in this.layer[k]) {
				cd(this.layer[k][x], x, count);
			}
			count++;
		}
		return this;
	}

	activate(input) {
		let out = [], max = Object.keys(this.layer).length - 1;
		this.each((neuron, x, count) => {
			if (count === 0 && (input[x] === undefined || input[x] > 1)) {
				throw new Error(`invalid activate "input" data on key "${x}" "${input[x]}"`);
			}
			let n = neuron.activate((count === 0) ? input[x] : undefined);
			if (max === count) {
				out.push(n);
			}
		});
		return out;
	}

	propagate(target) {
		this.each((neuron, x, count) => {
			if (count === 0 && (target[x] === undefined || target[x] > 1)) {
				throw new Error(`invalid propagate "target" data on key "${x}" "${target[x]}"`);
			}
			neuron.propagate((count === 0) ? target[x] : undefined);
		}, true);
	}

	load(data) {
		this.build(this.config, data);
		return this;
	}

	save() {
		let out = {};
		for (let i in this.layer) {
			out[i] = {};
			for (let x in this.layer[i]) {
				out[i][x] = {
					id: this.layer[i][x].id,
					incoming: this.layer[i][x].incoming.weights,
					outgoing: this.layer[i][x].outgoing.weights,
					bias: this.layer[i][x].bias,
					squash: this.layer[i][x].squash,
					cost: this.layer[i][x].cost,
					error: this.layer[i][x].error
				};
			}
		}
		return out;
	}

}

module.exports = Network;
