const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
require('dotenv').config();


const User = require('../models/User');
// const Client = require('../models/Client');
// const Request = require('../models/Request');

// Регистрация пользователя

router.get('/users', async(req,res) => {
    try
    {
        let Users = await User.find();
        if (Users)
            return res.json(Users);
    }
    catch (error)
    {
        res.status(500).json({ message: error.message });
    }
});


// router.get('/request', async(req,res) => {
//     try
//     {
//         const clients = await Request.find();
//         // console.log(clients);
//         res.json(clients);


//     } catch (error) {
//         // console.error('Error fetching clients:', error);  // Лог ошибки
//         res.status(500).json({ message: error.message });
//     }
// });


router.post('/register', async (req, res) => {
    const { login, password, email, role } = req.body;
    console.log(email);
    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // Создаем нового пользователя
        user = new User({ login, email, password, role });
        await user.save();

        // Генерация JWT
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });

    } catch (error) {
        console.log(error); 
        res.status(500).json({ message: error.message });
    }
});



// Авторизация пользователя
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    
  //  console.log(email);
    try {
        console.log(email); 
        const user = await User.findOne({ email }); // check with login too bla
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        console.log(typeof user.password);
        console.log(typeof password );

        const isMatch = await bcrypt.compare(password, user.password);
        console.log(isMatch);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Генерация JWT
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });

    } catch (error) {
        console.log('wtf');
        res.status(500).json({ message: error });
    }
});

module.exports = router;
