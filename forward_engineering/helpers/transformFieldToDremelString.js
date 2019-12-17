const getRepetition = field => field.repetition;
const getName = field => field.name;

const getType = field => {
	const { type, physicalType } = field;
	if (physicalType) {
		return physicalType;
	}

	switch(type) {
		case 'list':
		case 'map': return 'group';
		case 'int': return `int${field.bitWidth}`;
		default: return type;
	}
};

const getLogicalType = field => {
	const { type, logicalType } = field;
	if (type === 'list') {
		return '(LIST)';
	}

	if (type === 'map') {
		return '(MAP)';
	}

	if (!logicalType) {
		return '';
	}

	return `(${logicalType})`;
};

const transformFieldToDremelString = field => {
	return [
		getRepetition(field),
		getType(field),
		getName(field),
		getLogicalType(field),
	].join(' ').trim();
};

module.exports = transformFieldToDremelString;
