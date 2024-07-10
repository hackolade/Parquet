const removeChildrenFromField = field => {
	const newField = { ...field };
	delete newField.properties;
	delete newField.patternProperties;
	delete newField.items;
	return newField;
};

module.exports = removeChildrenFromField;
