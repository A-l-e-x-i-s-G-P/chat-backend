const { io } = require('../index');

io.on('connection', client => {
    console.log('Usuario conectado');
    client.on('disconnect', () => {
        console.log('Usuario desconectado');
    });

    client.on('mensaje', (payload) => {
        console.log('Mensaje', payload);
        io.emit('mensaje', { admin: 'Nuevo mensaje' });
    });
});