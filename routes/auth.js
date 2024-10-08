const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
require('dotenv').config();
const config = require('../config');


const User = require('../models/User');
// const Client = require('../models/Client');
// const Request = require('../models/Request');

// Регистрация пользователя

router.get('/getUserByToken', async(req,res) => {
    const token = req.header('Authorization');

    if (!token)
        return res.status(401).json({ message: 'No token, authorization denied' });

    try
    {
        const decoded = jwt.verify(token, config.secretKey); // Используй твой секретный ключ
        return res.json(decoded);
    }
    catch (error) {
        console.log(error);
        res.status(401).json({ message: 'Token is not valid' });
    }
});

router.post('/getUserData', async(req,res) => {
    const { token } = req.body;

    if(!token)
        return res.status(401).json({ message: 'No token, authorization denied' });

    const User = jwt.verify(token, config.secretKey);
    return res.json(User);
});

router.post('/getUserDataByLogin', async(req,res) => { // getting User Info via his Login
    const {login} = req.body;

    const user = await User.findOne({login}); // delete password sending (block it) or make some verification who can check this info
    if(user) res.json(user);
});


router.post('/getUsersByRole', async(req,res) => {
    const { token } = req.body; // console.log(req.header('Authorization'));

    if (!token)
        return res.status(401).json({ message: 'No token, authorization denied' });

    try
    {
        const userInfo = jwt.verify(token, config.secretKey);

        let roleFilter;

        if (userInfo.role ==='bank')
            roleFilter = 'broker';
        else if(userInfo.role === 'broker')
            roleFilter = 'bank';

        const Users = await User.find({ role : roleFilter});
        let arrayOfUsers = [];

        for (const [key, value] of Object.entries(Users)) {
            // console.log(`${key}: ${value} line 61`);
            for(const [key1, value1] of Object.entries(value))
            {
                const userObj = { login: value1.login, email: value1.email};
                arrayOfUsers.push(userObj);
            }
        }
        return res.json(arrayOfUsers);
    }
    catch (error){
        console.log(error);
        res.status(500).json({message: error.message});
    }
});

router.get('/users', async(req,res) => { // getting all users + make it for admin ONLY in future
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

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // Создаем нового пользователя
        user = new User({ login, email, password, role });
        await user.save();

        // Генерация JWT
        const token = jwt.sign({ id: user._id, login: user.login, role: user.role}, process.env.JWT_SECRET, { expiresIn: '1h' });
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
        const token = jwt.sign({ id: user._id, login: user.login, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });

    } catch (error) {
        console.log('wtf');
        res.status(500).json({ message: error });
    }
});

module.exports = router;
