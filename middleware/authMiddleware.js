const jwt = require('jsonwebtoken');
const config = require('../config');

function authMiddleware(req, res, next) {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, config.secretKey); // Используй твой секретный ключ
        // console.log(decoded);
        req.user = decoded; // Добавляем информацию о пользователе в запрос
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({ message: 'Token is not valid' });
    }
}

module.exports = authMiddleware;