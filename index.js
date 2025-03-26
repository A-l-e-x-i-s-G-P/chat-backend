const express = require('express');
const app = express();
app.use(express.json());
const path = require('path');
require('dotenv').config();
//dbconfig
require('./database/config.js').dbConnection();


// Node server
const server = require('http').createServer(app);
const io = require('socket.io')(server);
module.exports.io = io;

// Mensajes de sockets
require('./sockets/socket');

// Path público
const publicPath = path.resolve(__dirname, './public');
app.use(express.static(publicPath));
//mis rutas
app.use('/api/login', require('./routes/auth'));
app.use('/api/login/mensajes', require('./routes/mensajes'));

server.listen(process.env.PORT, (err) => {
    if (err) throw new Error(err);

    console.log(`Servidor está corriendo en el puerto ${process.env.PORT}`);
});