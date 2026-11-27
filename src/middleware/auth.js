import jwt from 'jsonwebtoken';

export default function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(400).json({ error: 'Authorization header is required' });
  }

  try {
    req.user = jwt.verify(header.slice(7), process.env.JWT_SECRET || 'development-secret');
    return next();
  } catch {
    return res.status(400).json({ error: 'Invalid or expired token' });
  }
}
