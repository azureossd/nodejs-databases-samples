const mongoose = require("mongoose")

const schema = mongoose.Schema({
	first_name: String,
	last_name: String,
})

module.exports = mongoose.model("User", schema)