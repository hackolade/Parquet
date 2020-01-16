'use strict'

const getJsonSchemasFromInitialData = require('./helpers/getJsonSchemasFromInitialData');
const getDefinitionsFromInitialData = require('./helpers/getDefinitionsFromInitialData');
const transformJsonSchemaToDremelService = require('./services/transformJsonSchemaToDremelService');

module.exports = {
	generateScript(data, logger, callback) {
		try {
			const schema = JSON.parse(data.jsonSchema);
			const dremelSchema = transformJsonSchemaToDremelService.transformSchema(
				schema,
				getDefinitionsFromInitialData(data, schema)
			);

			callback(null, dremelSchema);
		} catch (error) {
			const errorObject = {
				message: error.message,
				stack: error.stack,
			};

			logger.log('error', errorObject, 'Parquet Forward-Engineering Error');
			callback(errorObject);
		}
	},
	generateContainerScript(data, logger, callback) {
		try {
			const schemas = getJsonSchemasFromInitialData(data);
			const dremelSchemas = schemas.map(schema =>
				transformJsonSchemaToDremelService.transformSchema(
					schema,
					getDefinitionsFromInitialData(data, schema)
				));

			callback(null, dremelSchemas.join('\n\n=====================\n\n'));
		} catch (error) {
			const errorObject = {
				message: error.message,
				stack: error.stack,
			};

			logger.log('error', errorObject, 'Parquet Forward-Engineering Error');
			callback(errorObject);
		}
	}
};
