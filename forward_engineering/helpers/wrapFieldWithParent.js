const wrapFieldWithParent = (field, parent) => {
	if (!parent) {
		return field;
	}

	const parentPieces = parent.split('\n');
	const [parentStart] = parentPieces.slice(0, 1);
	const [parentEnd] = parentPieces.slice(-1);
	const parentBody = parentPieces.slice(1, parentPieces.length - 1);
	if (!parentBody.length) {
		return [parentStart, field, parentEnd].join('\n');
	}

	return [
		parentStart,
		parentBody.join('\n'),
		field,
		parentEnd,
	].join('\n');
};

module.exports = wrapFieldWithParent;
