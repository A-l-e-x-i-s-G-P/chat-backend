const { response } = require("express");
const bcrypt = require('bcrypt');
const Usuario = require("../models/usuario");
const { generarJWT } = require("../helpers/jwt");

const crearUsuario = async(req, res = response) => {
    const { email, password } = req.body;
    try {
        const existeEmail = await Usuario.findOne({ email });
        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya está registrado'
            });
        }
        const usuario = new Usuario(req.body);
        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        await usuario.save();
        // Generar JWT
        const token = await generarJWT(usuario.id);
        res.json({
            ok: true,
            usuario,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
}

const login = async(req, res = response) => {
    const { email, password } = req.body;

    try {
        const usuarioDB = await Usuario.findOne({ email });
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                msg: 'Email no encontrado'
            });
        }
        const validarPassword = bcrypt.compareSync(password, usuarioDB.password);
        if (!validarPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña no válida'
            });
        }
        const token = await generarJWT(usuarioDB.id);
        return res.json({
            ok: true,
            usuario: usuarioDB,
            msg: 'Login',
            token
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}

const renewToken = async(req, res = response) => {
    const uidUsuario = req.uid;
    const token = await generarJWT(uidUsuario);
    const usuarioEncon = await Usuario.findById(uidUsuario);
    res.json({
        ok: true,
        usuario: usuarioEncon,
        token
    });
}
const obtenerU = async (req, res = response) => {
    const usuarios = await Usuario.find({}, 'nombre email online').sort('-online'); // Incluye el campo online
    res.json({
        ok: true,
        usuarios
    });
};

module.exports = {
    crearUsuario,
    login,
    renewToken,
    obtenerU
}