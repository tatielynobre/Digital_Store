import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';
import auth from '../middleware/auth.js';

const router = Router();

const publicUser = (user) => ({
  id: user.id,
  firstname: user.firstname,
  surname: user.surname,
  email: user.email,
});

router.get('/:id', async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.status(200).json(publicUser(user));
  } catch (error) {
    return next(error);
  }
});

router.post('/token', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });
    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'development-secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' },
    );
    return res.status(200).json({ token });
  } catch (error) {
    return next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { firstname, surname, email, password, confirmPassword } = req.body;
    if (!firstname || !surname || !email || !password || confirmPassword !== password) {
      return res.status(400).json({ error: 'Invalid user data' });
    }
    const exists = await User.findOne({ where: { email } });
    if (exists) return res.status(400).json({ error: 'Email already registered' });
    const user = await User.create({
      firstname,
      surname,
      email,
      password: await bcrypt.hash(password, 10),
    });
    return res.status(201).json(publicUser(user));
  } catch (error) {
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'Invalid user data' });
    }
    return next(error);
  }
});

router.put('/:id', auth, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const { firstname, surname, email } = req.body;
    if (!firstname || !surname || !email) return res.status(400).json({ error: 'Invalid user data' });
    await user.update({ firstname, surname, email });
    return res.status(204).send();
  } catch (error) {
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'Invalid user data' });
    }
    return next(error);
  }
});

router.delete('/:id', auth, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    await user.destroy();
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
});

export default router;
