const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({
	name: 		{type :String, required: true	},
	salary: 	{type :Number, required: true	},
	emiratesID: {type: Number, required: true	},
	birthdate: 	{type: Date, required: true		},
});

const Request = mongoose.model('Request', RequestSchema);
module.exports = Request;