
const { Router } = require('express');
const { check } = require('express-validator');
const { crearUsuario, login, renewToken, obtenerU } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validas-JWT');

const router = Router();

router.post('/new', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').isLength({ min: 6 }),
    validarCampos
], crearUsuario);

//post:
//validar password
router.post('/login',[
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').isLength({min: 6 })
], login)

router.get('/renew', validarJWT, renewToken);
router.get('/obtenerTodosU', obtenerU);
module.exports = router;