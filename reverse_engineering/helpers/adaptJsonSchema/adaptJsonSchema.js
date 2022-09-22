const mapJsonSchema = require('./mapJsonSchema');

const handleNumericType = (jsonSchema) => {
	if (jsonSchema.mode === 'int') {
		return {
			...jsonSchema,
			type: 'int'
		}
	}
	if (jsonSchema.mode === 'decimal') {
		return {
			...jsonSchema,
			type: 'double',
		}
	}
	if (jsonSchema.mode === 'double') {
		return {
			...jsonSchema,
			type: 'double',
		}
	}

	return jsonSchema;
};

const adaptJsonSchema = (jsonSchema) => {
	return mapJsonSchema(jsonSchema, (jsonSchemaItem) => {
		if (jsonSchemaItem.type === 'number') {
			return handleNumericType(jsonSchemaItem);
		} 
		return jsonSchemaItem;
	});
};

module.exports = adaptJsonSchema;