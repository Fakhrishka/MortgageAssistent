// USER

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
	login: {type: String, required : true, unique: true},
	password: {type: String, required: true},
	email: {type: String, required: true},
	role: {type: String, enum:['broker', 'bank'], required:true},
	createdAt: {type: Date, default: Date.now }
});


UserSchema.pre('save', async function (next){
	if (!this.isModified('password')) return next();

	const saltRounds = 10;
    try {
        const salt = await bcrypt.genSalt(saltRounds);
        this.password = await bcrypt.hash(this.password, salt); // Пароль заменяется хешем


        console.log(this.password + " hashed");
        next(); // Переходим к следующему шагу сохранения
    } catch (error) {
        return next(error); // Если ошибка, передаем её дальше
    }
});


const User = mongoose.model('User', UserSchema);
module.exports = User;