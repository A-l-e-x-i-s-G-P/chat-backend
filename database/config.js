const mongoose = require('mongoose');

const dbConnection = async () => {
    try {
        console.log('Base de datos online');
        await mongoose.connect(process.env.DB_CNN, {
            
        });
    } catch (error) {
        console.log(error);
        throw new Error('Error en la base de datos');
    }
}

module.exports = {
    dbConnection
}
