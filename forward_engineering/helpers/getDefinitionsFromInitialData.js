const getDefinitionsFromInitialData = (data, schema) => ({
	modelDefinitions: JSON.parse(data.modelDefinitions).properties,
	externalDefinitions: JSON.parse(data.externalDefinitions).properties,
	internalDefinitions: schema.definitions,
});

module.exports = getDefinitionsFromInitialData;
