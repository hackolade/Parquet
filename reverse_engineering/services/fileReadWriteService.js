const parquet = require('parquetjs-lite');
const rawFileDataTransformService = require('./rawFileDataTransformService');
const { getRowGroups } = require('./rawFileDataTransformService');

const getMetadataFromFile = async filePath => {
	const reader = await parquet.ParquetReader.openFile(filePath);
	reader.close();
	return reader;
};

const getRawMetadataFromFile = async filePath => {
	const envelopeReader = await parquet.ParquetEnvelopeReader.openFile(filePath);
	await envelopeReader.readHeader();
	const metadata = await envelopeReader.readFooter();
	await envelopeReader.close();
	return metadata;
};

const readParquetFile = async filePath => {
	try {
		const metadata = await getRawMetadataFromFile(filePath);
		const { key_value_metadata, created_by } = metadata;
		const schema = rawFileDataTransformService.transformMetadata(metadata);

		return {
			metadata: {
				key_value_metadata,
				created_by,
			},
			schema,
			rowGroups: getRowGroups(metadata, schema),
		};
	} catch (err) {
		throw new Error(err);
	}
};

module.exports = {
	readParquetFile,
};
