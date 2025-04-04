const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET || 'Maria2003';

function generarToken(payload) {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
}

function verificarToken(token) {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (err) {
    return null;
  }
}

module.exports = { generarToken, verificarToken };
