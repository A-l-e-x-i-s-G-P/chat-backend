const { comprobarJWT } = require('../helpers/jwt');
const { io } = require('../index');
const { usuarioCo, usuarioDesconectado, grabarMensaje } = require('../controllers/socket');



io.on('connection', client => {
    console.log('Usuario conectado');
    const [valido, uid] = comprobarJWT(client.handshake.headers['x-token']);
    //verificar autenticacion
    if (!valido) { return client.disconnect(); }
    //cliente autenticado
    usuarioCo(uid);
    //Ingresar al usuario a una sala en particular
    //sala global, client.id, uid
    client.join(uid);
    //escuchar del cliente el mensaje-personal
    client.on('mensaje-personal', async(payload) => {
        //grabar mensaje
        await grabarMensaje(payload);
        io.to(payload.para).emit('mensaje-personal', payload);
    });    
    console.log('Cliente autenticado');
    client.on('disconnect', () => {
        console.log('Usuario desconectado');
        usuarioDesconectado(uid);
    });
});