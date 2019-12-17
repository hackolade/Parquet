const { MAP, LIST, ELEMENT, KEY, KEY_VALUE, VALUE, GROUP } = require('../constants');

const isMap = field => {
	const [keyValue] = Object.values(field.fields);
	const [key, value] = Object.values(keyValue.fields || {});
	return field.fieldCount === 1
		&& keyValue.fieldCount === 2
		&& keyValue && keyValue.name === KEY_VALUE
		&& key && key.name === KEY
		&& value && value.name === VALUE
};

const isList = field => {
	const [list] = Object.values(field.fields);
	const [element] = Object.values(list.fields || {});
	return field.fieldCount === 1
		&& list.fieldCount === 1
		&& list && list.name === LIST
		&& element && element.name === ELEMENT
};

const defineGroupType = field => {
	switch(true) {
		case isMap(field): return MAP;
		case isList(field): return LIST;
		default: return GROUP;
	}
}

module.exports = defineGroupType;
