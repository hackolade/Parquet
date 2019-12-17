module.exports = fileName => fields => ({
	$schema: "http://json-schema.org/draft-04/schema#",
	type: "object",
	title: fileName,
	properties: fields,
})
