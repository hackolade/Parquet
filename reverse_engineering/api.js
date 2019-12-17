'use strict'

const fileReadWriteService = require('./services/fileReadWriteService');
const JSONConvertService = require('./services/JSONConvertService');
const wrapFieldsIntoJSONSchema = require('./helpers/wrapFieldsIntoJSONSchema');
const includeMetadataInJSONSchema = require('./helpers/includeMetadataInJSONSchema');
const pipe = require('../helpers/pipe');
const path = require('path');

module.exports = {
	async reFromFile(data, logger, callback) {
		try {
			const { filePath } = data;
			const fileName = path.basename(filePath, '.parquet');
			const { schema, metadata } = await fileReadWriteService.readParquetFile(filePath);
			const JSONSchema = JSONConvertService.convertFieldSchemasToJSON(schema);
			const preparedJSONSchema = pipe([
				wrapFieldsIntoJSONSchema(fileName),
				includeMetadataInJSONSchema(metadata),
			])(JSONSchema);

			callback(null, {
				containerName:"New namespace",
				jsonSchema: JSON.stringify(preparedJSONSchema, null, 4),
			});
		} catch(err) {
			callback(err);
		}
	}
};
