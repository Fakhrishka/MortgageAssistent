const express = require('express');
const router = express.Router();
const Request = require('../models/Request');
const multer = require('multer');
const mongoose = require('mongoose');

// REQUEST STRUCTURE :
	// name: {type :String, required: true},
	// salary: {type :Number, required: true},
	// emiratesID: {type: Number, required: true},
	// birthdate: {type: Date, required: true},

	// document: {type: String, required: true},
const upload = multer({ dest: 'uploads/' });


router.get('/', async(req,res) => {
	try
	{
		console.log('wtf');

		const requests = await Request.find();
		if(requests.length === 0)
			console.log('no requests available');
		else
			res.json(requests);
	} catch(error){
		console.log(error.message);
		res.status(500).send('error while getting all requests');
	}
});




router.post('/submit', upload.single('document'), async (req, res) => {
  try {
		// console.log('test_line13');
	    const { name, salary, emiratesID, birthdate  } = req.body;
	    console.log(req.body);

	    // Создаём нового клиента и сохраняем его в базе данных
	    const request = new Request({
			name, 
			salary, 
			emiratesID,
			birthdate, // Сохраняем путь к файлу
	    });
	    console.log(Request);
	   	console.log('test'); 
	    await request.save(); // Сохраняем данные в базе

	    res.send(`Данные клиента сохранены! Имя: ${name}, Дата рождения: ${birthdate}, Зарплата: ${salary}`);
	  } catch (error) {
	  	console.log(error);
	    res.status(500).send('Ошибка при сохранении данных: ' + error);
	  }
});

module.exports = router;