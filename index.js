const express = require('express');
const config = require('./config');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const axios = require('axios');

const multer = require('multer');
// const axios = require('axios');

// models
const user = require('./models/User');
const client = require('./models/Client');
const Request = require('./models/Request');

// routings :
const dashboardRoutes = require('./routes/dashboard');
const authRoutes = require('./routes/auth');
const requestRoutes = require('./routes/request');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/auth', authRoutes);
app.use('/api/request', requestRoutes);
app.use('/api', dashboardRoutes);

// console.log(Request);

// getAllRequests is collecting all the REQUEST records from DB 
// by using axios.get - it is sending GET request to 3001/api/request and receives the response
async function getAllRequests()  
    {
        try
        {
            const response = await axios.get('http://localhost:3001/api/request');
                    // alert('Registration successful!');
            console.log('All clients :', response.data);
        } catch (error) {
            console.error('Registration error:', error.message);
            // alert('failed failed!');
          }
    };
// getAllRequests();


const upload = multer({ dest: 'uploads/' });
app.post('/submit', upload.single('document'), async (req, res) => {
  try {
		// console.log('test_line13');
	    const { name, salary, emiratesID, birthdate  } = req.body;
	    console.log('11');

	    // Создаём нового клиента и сохраняем его в базе данных
	    const request = new Request({
			name, 
			salary, 
			emiratesID,
			birthdate, // Сохраняем путь к файлу
	    });
	    console.log(request);
	   	console.log('test'); 
	   	const a =  await request.save(); // Сохраняем данные в базе
console.log(a);
	    res.send(`Данные клиента сохранены! Имя: ${name}, Дата рождения: ${birthdate}, Зарплата: ${salary}`);
	  } catch (error) {
	  	console.log(error);
	    res.status(500).send('Ошибка при сохранении данных: ' + error);
	  }
});

// async function getClients() {
//     try {
//     	console.log('he');
//         const response = await axios.get('http://localhost:3001/api/clients');
//         console.log('hehe');
//        	// console.log(
//         // console.log(response.data);
//     } catch (error) {
//         console.error('Error fetching users:', error.message);
//     }
// }

// getClients();



// console.log('hehehe');
// app.get('./routes/auth.js', (req, res) => {
//   console.log('allworks');
// });

// SERVER START
app.listen(config.port, () =>
{
	config.connectDB();
	console.log(`server connected on port ${config.port}`);
});