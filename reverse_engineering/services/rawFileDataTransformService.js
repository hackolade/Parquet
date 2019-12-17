const parquet_util = require('parquetjs-lite/lib/util');
const parquet_thrift = require('parquetjs-lite/gen-nodejs/parquet_types');
const isNumber = require('../helpers/isNumber');
const generateSchemaFieldsTree = require('../helpers/generateSchemaFieldsTree');
const defineSchemaFieldsPath = require('../helpers/defineSchemaFieldsPath');
const getFieldAdditionalData = require('../helpers/getFieldAdditionalData');
const pipe = require('../../helpers/pipe');

const transformRepetitionType = repetitionTypeEnum => ({
	repetitionType: parquet_util.getThriftEnum(
		parquet_thrift.FieldRepetitionType,
		repetitionTypeEnum
	),
});

const transformType = typeEnum => ({
	primitiveType: parquet_util.getThriftEnum(parquet_thrift.Type, typeEnum),
});

const transformConvertedType = convertedTypeEnum => ({
	originalType: parquet_util.getThriftEnum(parquet_thrift.ConvertedType, convertedTypeEnum),
});

const transformCodec = codec => ({
	compression: parquet_util.getThriftEnum(parquet_thrift.CompressionCodec, codec),
});

const transformEncoding = encodingArray => ({
	encoding: encodingArray.map(encodingCode => parquet_util.getThriftEnum(parquet_thrift.Encoding, encodingCode)),
});

const transformFieldProperty = (propertyName, value) => {
	switch(propertyName) {
		case 'name': return { name: value };
		case 'type': return isNumber(value) ? transformType(value) : {};
		case 'repetition_type': return isNumber(value) ? transformRepetitionType(value) : {};
		case 'converted_type': return isNumber(value) ? transformConvertedType(value) : {};
		case 'scale': return isNumber(value) ? { scale: value } : {};
		case 'precision': return isNumber(value) ? { precision: value } : {};
		case 'num_children': return { num_children: value };
		case 'codec': return transformCodec(value);
		case 'encodings': return transformEncoding(value);
		default: {};
	}
}

const transformField = field => {
	return Object.entries(field).reduce((acc, [propertyName, value]) => {
		return Object.assign(acc, transformFieldProperty(propertyName, value));
	}, {});
}

const defineFieldAdditionalData = fieldsMetadata => fields =>
	Object.entries(fields).reduce((acc, [name, field]) => {
		if (name === 'parent') {
			return acc;
		}

		if (field.fields) {
			return Object.assign(acc, {
				[name]: Object.assign({}, field, {
					fields: defineFieldAdditionalData(fieldsMetadata)(field.fields)
				}),
			});
		}

		const additionalData = getFieldAdditionalData(fieldsMetadata, field);
		const additionalFieldMeta = additionalData ? additionalData.meta_data : {};
		return Object.assign(acc, {
			[name]: Object.assign({}, field, transformField(additionalFieldMeta)),
		});
	}, {});

const getFieldsMetadata = rawMetadata => {
	const [firstRowGroup] = rawMetadata.row_groups;
	if (!firstRowGroup || !firstRowGroup.columns) {
		return [];
	}

	return firstRowGroup.columns;
}

const transformMetadata = rawMetadata => {
	const { schema } = rawMetadata;
	const fieldsMetadata = getFieldsMetadata(rawMetadata);
	const transformedFields = schema.slice(1).map((field) => transformField(field));
	return pipe([
		generateSchemaFieldsTree,
		defineSchemaFieldsPath,
		defineFieldAdditionalData(fieldsMetadata),
	])(transformedFields);
}

module.exports = {
	transformMetadata,
}