const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema(
{
	name: {type: String, required : true, unique: true},
	birthdate: {type: Date, required: true},
	salary: {type: Number , required: true},
	document: {type: String, required: true}
});

const Client = mongoose.model('Client', ClientSchema);
module.exports = Client;