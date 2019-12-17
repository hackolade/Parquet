const SPACE = '\xa0';

const prependFieldWithSpaces = spaceAmount => field =>
	field.split('\n')
		.map(fieldLine => prependStringWithSpaces(fieldLine, spaceAmount))
		.join('\n');

const prependStringWithSpaces = (string, spaceAmount) => {
	let spaces = '';
	for (let i = 0; i < spaceAmount; i++) {
		spaces += SPACE;
	}

	return spaces + string;
}

module.exports = prependFieldWithSpaces;
