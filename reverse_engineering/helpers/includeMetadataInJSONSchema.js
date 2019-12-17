const pipe = require('../../helpers/pipe');

const includeCreator = createdBy => JSONSchema => {
	if (!createdBy) {
		return JSONSchema;
	}

	return Object.assign({}, JSONSchema, { creator: createdBy });
}

const includeExtra = keyValueMetadata => JSONSchema => {
	if (!keyValueMetadata || !Array.isArray(keyValueMetadata)) {
		return JSONSchema;
	}

	return Object.assign({}, JSONSchema, {
		extra: keyValueMetadata.map(({ key, value }) => ({ extraKey: key, extraValue: value }))
	});
}

const includeMetadataInJSONSchema = metadata => JSONSchema =>
	pipe([
		includeCreator(metadata.created_by),
		includeExtra(metadata.key_value_metadata),
	])(JSONSchema);

module.exports = includeMetadataInJSONSchema;
