const reverseType = value => {
	if (value.indexOf('INT') === 0) {
		return {
			type: 'int',
			bitWidth: value.slice(3),
		};
	}

	if (value.toLowerCase() === 'byte_array') {
		return {
			type: 'binary',
		};
	}

	return {
		type: value.toLowerCase(),
	};
};

const reverseTypeLength = value => !isNaN(value) ? { byteLength: Number(value) } : {};

const reverseCompression = value => {
	const lowerCaseValue = value.toLowerCase();
	const hashMap = {
		uncompressed: 'Uncompressed',
		snappy: 'Snappy',
		gzip: 'GZip',
		lzo: 'LZO',
		brotli: 'BROTLI',
		lz4: 'LZ4',
		zst: 'ZST',
	};
	const compressionCodec = hashMap[lowerCaseValue] || value;

	return { compressionCodec };
};

const reverseEncoding = encoding => {
	const hashMap = {
		plain: 'Plain',
		group_var_int: 'Group_Var_Int',
		plain_dictionary: 'Plain_Dictionary',
		rle: 'RLE',
		bit_packed: 'Bit_Packed',
		delta_binary_packed: 'Delta_Binary_Packed',
		delta_length_byte_array: 'Delta_Length_Byte_Array',
		delta_byte_array: 'Delta_Byte_Array',
		rle_dictionary: 'RLE_Dictionary',
	};
	if (Array.isArray(encoding)) {
		return {
			encoding: encoding.map(encodingType => hashMap[encodingType.toLowerCase()] || encoding)
		};
	}

	const lowerCaseValue = value.toLowerCase();
	const encodingType = hashMap[lowerCaseValue] || encoding;

	return { encoding: [ encodingType ] };
}

const reverseOriginalType = value => {
	if (value === 'DECIMAL') {
		return { decimal: true };
	}

	return { logicalType: value };
}

const reverseProperty = (propertyName, value) => {
	switch(propertyName) {
		case 'primitiveType': return reverseType(value);
		case 'encoding': return reverseEncoding(value);
		case 'repetitionType': return { repetition: value.toLowerCase() };
		case 'compression': return reverseCompression(value);
		case 'typeLength': return reverseTypeLength(value);
		case 'originalType': return reverseOriginalType(value);
		case 'precision': return { precision: value };
		case 'scale': return { scale: value };
		default: {};
	}
}

const reverseFieldSchema = fieldSchema =>
	Object.entries(fieldSchema).reduce((schema, [propertyName, value]) => {
		return Object.assign(schema, reverseProperty(propertyName, value));
	}, {});

module.exports = reverseFieldSchema;
