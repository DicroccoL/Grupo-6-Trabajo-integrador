const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME, 
    process.env.DB_USER, 
    process.env.DB_PASSWORD, 
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 3305, 
        dialect: 'mysql',
        logging: false,
        pool: {
            max: 10, 
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

sequelize.authenticate()
    .then(() => {
        console.log('Conexión Exitosa a la base de datos con Sequelize ORM');
    })
    .catch(error => {
        console.error('Error al conectar con la base de datos:', error.message);
    });

module.exports = sequelize;