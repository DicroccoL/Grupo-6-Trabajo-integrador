const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');

exports.crearAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;


    const salt = await bcrypt.genSalt(10);
    const passwordCifrada = await bcrypt.hash(password, salt);

    const nuevoAdmin = await Usuario.create({
      username,
      password: passwordCifrada
    });

    res.status(201).json({
      status: "success",
      message: "Administrador creado",
      id: nuevoAdmin.id
    });

  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};