const isModelDef = field => field.$ref.indexOf('#model/') === 0;
const isInternalDef = field => field.$ref.indexOf('#/') === 0;
const getName = field => field.$ref.split('/').slice(-1)[0];

const getFieldDefinition = ({ internalDefinitions, modelDefinitions, externalDefinitions }) => field => {
	if (isModelDef(field)) {
		return modelDefinitions[getName(field)];
	}

	if (isInternalDef(field)) {
		return internalDefinitions[getName(field)];
	}

	return externalDefinitions[getName(field)];
}

module.exports = getFieldDefinition;
