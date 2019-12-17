const getJsonSchemasFromInitialData = data => data.entities.map(entityId => JSON.parse(data.jsonSchema[entityId]));

module.exports = getJsonSchemasFromInitialData;
