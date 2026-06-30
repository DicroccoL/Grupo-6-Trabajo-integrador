const { Sequelize } = require('sequelize');
require('dotenv').config();

//Configura la conexión a la base de datos MySQL usando Sequelize

const sequelize = new Sequelize(
    process.env.DB_NAME, 
    process.env.DB_USER, 
    process.env.DB_PASSWORD, 
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 3305,
        dialect: 'mysql',

        logging: false, // para no mostrar consultas SQL en consola

        // configuración de conexiones
        pool: {
            max: 10,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

//Prueba la conexión a la base de datos

sequelize.authenticate()
    .then(() => {
        console.log('Conexión Exitosa a la base de datos');
    })
    .catch(error => {
        console.error('Error de conexión:', error.message);
    });

// Exporta la conexión para usarla en el resto del proyecto

module.exports = sequelize;