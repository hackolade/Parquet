const getChildren = field => {
	const { items, properties, patternProperties } = field;
	if (properties || patternProperties) {
		return Object.assign({}, properties, patternProperties);
	}

	if (items && Array.isArray(items)) {
		return items.reduce((acc, item, i) => Object.assign({}, acc, { [`[${i}]`]: item }),{});
	}

	return { element: items };
};

const getFieldChildren = field => {
	const children = getChildren(field);
	if (field.type === 'list') {
		const listMiddleLayerField = {
			list: {
				type: 'group',
				repetition: 'repeated',
				properties: children,
			}
		};

		return listMiddleLayerField;
	}

	if (field.type === 'map') {
		const mapMiddleLayerField = {
			key_value: {
				type: 'group',
				logicalType: 'MAP_KEY_VALUE',
				repetition: 'repeated',
				properties: children,
			}
		};

		return mapMiddleLayerField;
	}

	return children;
};

module.exports = getFieldChildren;
