//dashboard

const express = require('express');
const authMiddleware = require('../middleware/authMiddleware'); // Импортируем middleware для проверки токена
const router = express.Router();
const User = require('../models/User');

// Личный кабинет
router.get('/dashboard', authMiddleware, async (req, res) => {
    try {

        const user = req.user; // Получаем пользователя из middleware
        res.json({
            message: `Welcome to your dashboard, ${user.login}`,
            user: {
                id: user.id,
                login: user.login,
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
