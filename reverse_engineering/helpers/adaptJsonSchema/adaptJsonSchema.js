const { setDependencies } = require('../../appDependencies');
const mapJsonSchema = require('./mapJsonSchema');

const handleNumericType = jsonSchema => {
	if (jsonSchema.mode === 'int') {
		return {
			...jsonSchema,
			type: 'int',
		};
	}
	if (jsonSchema.mode === 'decimal') {
		return {
			...jsonSchema,
			type: 'double',
		};
	}
	if (jsonSchema.mode === 'double') {
		return {
			...jsonSchema,
			type: 'double',
		};
	}

	return jsonSchema;
};

const adaptSchema = jsonSchema => {
	return mapJsonSchema(jsonSchema, jsonSchemaItem => {
		if (jsonSchemaItem.type === 'number') {
			return handleNumericType(jsonSchemaItem);
		}
		return jsonSchemaItem;
	});
};

const adaptJsonSchema = (data, logger, callback, app) => {
	setDependencies(app);
	logger.log('info', 'Adaptation of JSON Schema started...', 'Adapt JSON Schema');
	try {
		const jsonSchema = JSON.parse(data.jsonSchema);
		const adaptedJsonSchema = adaptSchema(jsonSchema);

		logger.log('info', 'Adaptation of JSON Schema finished.', 'Adapt JSON Schema');

		callback(null, {
			jsonSchema: JSON.stringify(adaptedJsonSchema),
		});
	} catch (e) {
		const errorObject = {
			message: `${error.message}\nFile name: ${fileName}`,
			stack: error.stack,
		};
		logger.log('error', errorObject, 'Adaptation of JSON Schema Error');
		callback(errorObject);
	}
};

module.exports = { adaptJsonSchema };
