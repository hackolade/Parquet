'use strict'

const fileReadWriteService = require('./services/fileReadWriteService');
const JSONConvertService = require('./services/JSONConvertService');
const wrapFieldsIntoJSONSchema = require('./helpers/wrapFieldsIntoJSONSchema');
const includeMetadataInJSONSchema = require('./helpers/includeMetadataInJSONSchema');
const pipe = require('../helpers/pipe');
const path = require('path');
const adaptJsonSchema = require('./helpers/adaptJsonSchema/adaptJsonSchema');

module.exports = {
	async reFromFile(data, logger, callback) {
		try {
			const { filePath } = data;
			const fileName = path.basename(filePath, '.parquet');
			const { schema, metadata, rowGroups } = await fileReadWriteService.readParquetFile(filePath);
			const JSONSchema = JSONConvertService.convertFieldSchemasToJSON(schema);
			const preparedJSONSchema = pipe([
				wrapFieldsIntoJSONSchema(fileName),
				includeMetadataInJSONSchema(metadata),
			])(JSONSchema);

			callback(null, {
				containerName:"New namespace",
				jsonSchema: JSON.stringify( { ...preparedJSONSchema, rowGroups }, null, 4),
			});
		} catch(error) {
			const fileName = path.basename(data.filePath);
			const errorObject = {
				message: `${error.message}\nFile name: ${fileName}`,
				stack: error.stack,
			};

			logger.log('error', errorObject, 'Parquet Reverse-Engineering Error');
			callback(errorObject);
		}
	},

	adaptJsonSchema(data, logger, callback) {
		logger.log('info', 'Adaptation of JSON Schema started...', 'Adapt JSON Schema');
		try {
			const jsonSchema = JSON.parse(data.jsonSchema);

			const adaptedJsonSchema = adaptJsonSchema(jsonSchema);

			logger.log('info', 'Adaptation of JSON Schema finished.', 'Adapt JSON Schema');

			callback(null, {
				jsonSchema: JSON.stringify(adaptedJsonSchema)
			});
		} catch(e) {
			const errorObject = {
				message: `${error.message}\nFile name: ${fileName}`,
				stack: error.stack,
			};
			logger.log('error', errorObject, 'Adaptation of JSON Schema Error');
			callback(errorObject);
		}
	},
};
