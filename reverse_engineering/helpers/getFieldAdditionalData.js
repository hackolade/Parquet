const areArraysEqual = require('./areArraysEqual');

const getFieldAdditionalData = (fieldsMetadata, field) =>
	fieldsMetadata.find(fieldMeta =>
		areArraysEqual(fieldMeta.meta_data.path_in_schema, field.path));

module.exports = getFieldAdditionalData;
