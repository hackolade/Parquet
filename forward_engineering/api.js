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
		} catch (e) {
			callback({ message: e.message, stack: e.stack });
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
		} catch (e) {
			callback({ message: e.message, stack: e.stack });
		}
	}
};
