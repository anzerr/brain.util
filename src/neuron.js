
const key = require('unique.util'),
	is = require('type.util');

const sigmoid = (x) => 1 / (1 + Math.exp(-x)),
	_sigmoid = (x) => sigmoid(x) * (1 - sigmoid(x));

class Neuron {

	constructor(bias) {
		this.id = key.short(); // ID
		this.bias = !is.defined(bias) ? Math.random() * 2 - 1 : bias; // this.bias ∈ ℝ && -1 < this.bias < 1
		this.squash = null;
		this.cost = null;

		// Incoming Connections
		this.incoming = {
			targets: {}, // new Map(),
			weights: {} // new Map()
		};
		this.outgoing = {
			targets: {}, // new Map(),
			weights: {} // new Map()
		};

		this._output = null; // f'(x)
		this.output = null; // f(x)
		this.error = null; // E'(f(x))
	}

	connect(neuron, weight) {
		if (!is.instance(neuron, Neuron)) {
			throw new Error('can\'t connect object that is not a neuron');
		}
		this.outgoing.targets[neuron.id] = neuron;
		neuron.incoming.targets[this.id] = this;
		const w = !is.defined(weight) ? Math.random() * 2 - 1 : weight;
		this.outgoing.weights[neuron.id] = w;
		neuron.incoming.weights[this.id] = w;
	}

	activate(input) {
		if (is.defined(input)) {
			this._output = 1;
			return (this.output = input);
		}
		// Σ (x • w)
		let sum = this.bias;
		for (let i in this.incoming.targets) {
			sum += this.incoming.targets[i].output * this.incoming.weights[i];
		}

		this._output = _sigmoid(sum); // f'(x)
		this.output = sigmoid(sum); // f(x)
		return this.output;
	}

	propagate(t, rate = 0.3) {
		let sum = 0;
		if (!is.defined(t)) {
			for (let i in this.outgoing.targets) {
				this.outgoing.weights[i] -= rate * this.outgoing.targets[i].error * this.output;
				this.outgoing.targets[i].incoming.weights[this.id] = this.outgoing.weights[i];
				sum += this.outgoing.targets[i].error * this.outgoing.weights[i];
			}
		} else {
			sum = this.output - t;
		}

		this.error = sum * this._output;
		this.bias -= rate * this.error;

		return this.error;
	}

}

module.exports = Neuron;
