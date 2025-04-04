const { verificarToken } = require('../utils/jwt');

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  const token = authHeader.split(' ')[1];
  const payload = verificarToken(token);
  if (!payload) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }

  req.user = payload; 
  next();
}

module.exports = authMiddleware;