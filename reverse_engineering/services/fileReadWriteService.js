const parquet = require('parquetjs-lite');
const rawFileDataTransformService = require('./rawFileDataTransformService');
const { getRowGroups } = require('./rawFileDataTransformService');

const getMetadataFromFile = filePath =>
	new Promise(async (resolve, reject) => {
		try {
			const reader = await parquet.ParquetReader.openFile(filePath);
			reader.close();
			resolve(reader);
		} catch (e) {
			reject(e);
		}
	});

const getRawMetadataFromFile = filePath =>
	new Promise(async (resolve, reject) => {
		try {
			const envelopeReader = await parquet.ParquetEnvelopeReader.openFile(filePath);
			await envelopeReader.readHeader();
			const metadata = await envelopeReader.readFooter();
			await envelopeReader.close();
			resolve(metadata);
		} catch (e) {
			reject(e);
		}
	});

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
