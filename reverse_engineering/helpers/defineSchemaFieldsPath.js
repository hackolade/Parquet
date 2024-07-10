const auxiliaryFieldProperties = ['num_children', 'parent'];

const defineFieldPath = (fieldName, fieldBody, parentPath) => {
	const path = parentPath.concat([fieldName]);
	if (!fieldBody.fields) {
		return { ...fieldBody, path };
	}

	return { ...fieldBody, fields: defineSchemaFieldsPath(fieldBody.fields, path) };
};

const defineSchemaFieldsPath = (schema, parentPath = []) => {
	return Object.entries(schema).reduce((acc, [fieldName, fieldBody]) => {
		if (auxiliaryFieldProperties.includes(fieldName)) {
			return acc;
		}

		return {
			...acc,
			[fieldName]: defineFieldPath(fieldName, fieldBody, parentPath),
		};
	}, {});
};

module.exports = defineSchemaFieldsPath;
