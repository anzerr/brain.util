
module.exports = {
	run: (x, func) => {
		let total = 0, count = 0;
		for (let i = 0; i < x; i++) {
			let start = process.hrtime();
			func();
			let end = process.hrtime(start);
			total += ((end[0] * 1e9 + end[1]) / 1e9);
			count += 1;
		}
		return [total, count];
	}
};
