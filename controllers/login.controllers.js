const sql = require('mssql');
const poolPromise = require('../config/db');
const { validatePassword, hashPassword } = require('../utils/hash');

const crearUsuario = async (req, res) => {
  try {
    const { username, password } = req.body;
    const { salt, hash } = hashPassword(password);

    const pool = await poolPromise;
    await pool.request()
      .input('username', sql.VarChar, username)
      .input('hash', sql.VarChar, hash)
      .input('salt', sql.VarChar, salt)
      .query('INSERT INTO Users (username, passwordHash, salt) VALUES (@username, @hash, @salt)');

    res.status(201).json({ message: 'Usuario creado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear usuario', detalle: error.message });
  }
};

const loginUsuario = async (req, res) => {
  try {
    const { username, password } = req.body;
    const pool = await poolPromise;

    const result = await pool.request()
      .input('username', sql.VarChar, username)
      .query('SELECT * FROM Users WHERE username = @username');

    const user = result.recordset[0];

    if (!user) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    const isValid = validatePassword(password, user.salt, user.passwordHash);

    if (!isValid) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    res.status(200).json({ message: 'Login exitoso' });
  } catch (error) {
    res.status(500).json({ error: 'Error en login', detalle: error.message });
  }
};

module.exports = {
  crearUsuario,
  loginUsuario
};

const { generarToken } = require('../utils/jwt'); 

const token = generarToken({ username: user.username, id: user.id });
res.status(200).json({ message: 'Login exitoso', token });

