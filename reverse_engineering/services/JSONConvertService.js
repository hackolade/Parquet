const defineGroupType = require('../helpers/defineGroupType');
const reverseFieldSchema = require('../helpers/reverseFieldSchema');
const defineGroupNestedFields = require('../helpers/defineGroupNestedFields');

const reverseGroupField = field => {
	const type = defineGroupType(field);
	return Object.assign({}, reverseFieldSchema(field), {
		type,
		properties: convertFieldSchemasToJSON(defineGroupNestedFields(field, type)),
	});
}

const isGroupType = schema => schema.isNested;

const convertFieldSchemasToJSON = fieldSchemas =>
	Object.values(fieldSchemas).reduce((resultedSchemas, field) => {
		if (isGroupType(field)) {
			return Object.assign(resultedSchemas, { [field.name]: reverseGroupField(field) });
		}

		return Object.assign(resultedSchemas, { [field.name]: reverseFieldSchema(field) });
	}, {});

module.exports = {
	convertFieldSchemasToJSON,
};
