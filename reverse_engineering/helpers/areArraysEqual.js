const areArraysEqual = (first, second) =>
	Array.isArray(first)
	&& Array.isArray(second)
	&& first.length === second.length
	&& first.every((elem, i) => second[i] === elem);

module.exports = areArraysEqual;
