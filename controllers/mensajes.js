const Mensaje = require('../models/mensaje');
const obtenerChat = async (req, res) => {  
    const miId = req.uid;
    const mensajesDe = req.params.de;

    console.log('miId:', miId);
    console.log('mensajesDe:', mensajesDe);

    if (miId == mensajesDe) {
        return res.status(400).json({
            ok: false,
            msg: 'Cannot fetch messages with yourself'
        });
    }

    try {
        const last30 = await Mensaje.find({
            $or: [
                { de: miId, para: mensajesDe },
                { de: mensajesDe, para: miId }
            ]
        })
        .sort({ createdAt: 'desc' })
        .limit(70);

        console.log('last30:', last30);

        res.json({
            ok: true,
            mensaje: last30
        });
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({
            ok: false,
            msg: 'Error fetching messages'
        });
    }
};

module.exports = {
    obtenerChat
}