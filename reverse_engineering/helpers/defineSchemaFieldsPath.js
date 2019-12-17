const auxiliaryFieldProperties = ['num_children', 'parent'];

const defineFieldPath = (fieldName, fieldBody, parentPath) => {
	const path = parentPath.concat([fieldName]);
	if (!fieldBody.fields) {
		return Object.assign({}, fieldBody, { path });
	}

	return Object.assign({}, fieldBody, { fields: defineSchemaFieldsPath(fieldBody.fields, path) });
};

const defineSchemaFieldsPath = (schema, parentPath = []) => {
	return Object.entries(schema).reduce((acc, [fieldName, fieldBody]) => {
		if (auxiliaryFieldProperties.includes(fieldName)) {
			return acc;
		}

		return Object.assign(acc, { [fieldName]: defineFieldPath(fieldName, fieldBody, parentPath) });
	}, {});
}

module.exports = defineSchemaFieldsPath;
