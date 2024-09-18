// const port = 3001;
// const dbPath = 'mongodb://localhost/27017/MortgageAssist';
const mongoose = require('mongoose');

const dotenv = require('dotenv');
dotenv.config();


const connectDataBase = async () => {
	try
	{
		console.log('mongodb://'+process.env.ROOT_URL+process.env.DATABASE_URL);
		await mongoose.connect('mongodb://'+process.env.ROOT_URL+process.env.DATABASE_URL);
		console.log('DataBase connected');
	}
		catch (error){
			console.log('failed to connect to DB!');
			process.exit(1);
		}
};

// 
// console.log(connectDataBase);

module.exports = {
	port: process.env.PORT,
	secretKey: process.env.JWT_SECRET,
	connectDB: connectDataBase,
};