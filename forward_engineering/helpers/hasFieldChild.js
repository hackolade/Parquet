const hasFieldChild = field =>
	(field.properties && Object.values(field.properties).length > 0)
	|| (field.patternProperties && Object.values(field.patternProperties).length > 0)
	|| field.items;

module.exports = hasFieldChild;
