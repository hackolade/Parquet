const { MAP, LIST } = require('../constants');

const defineGroupNextFields = (field, type) => (type === MAP || type === LIST)
	? Object.values(field.fields)[0].fields
	: field.fields;

module.exports = defineGroupNextFields;
