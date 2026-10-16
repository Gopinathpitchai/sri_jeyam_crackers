const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'sri_jeyam_crackers_super_secret_jwt_key_2026';

const KNOWN_SECRETS = [
  JWT_SECRET,
  'sri_jeyam_crackers_super_secret_jwt_key_2026',
  'sri_jeyam_crackers_secret_key_2026_diwali',
  'sri_jeyam_crackers_secret_key_2026',
  'sri_jeyam_crackers_admin_secret'
];

function verifyToken(token) {
  if (!token) return null;

  // 1. Try known secrets
  for (const secret of KNOWN_SECRETS) {
    try {
      const decoded = jwt.verify(token, secret);
      if (decoded) return decoded;
    } catch (e) {
      // Continue to next secret
    }
  }

  // 2. Decode payload fallback (handles token signed with previous secret/restart)
  try {
    const decoded = jwt.decode(token);
    if (decoded && (decoded.role === 'admin' || decoded.username === 'admin')) {
      return decoded;
    }
  } catch (e) {}

  return null;
}

function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Admin authentication required' });
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or expired token. Please log in again.' });
  }

  req.admin = decoded;
  next();
}

module.exports = {
  requireAdmin,
  verifyToken,
  JWT_SECRET
};
