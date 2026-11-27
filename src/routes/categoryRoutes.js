import { Router } from 'express';
import { Op } from 'sequelize';
import { Category } from '../models/index.js';
import auth from '../middleware/auth.js';

const router = Router();

function categoryResponse(category) {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    use_in_menu: Boolean(category.use_in_menu),
  };
}

router.get('/search', async (req, res, next) => {
  try {
    const limit = req.query.limit === undefined ? 12 : Number(req.query.limit);
    const page = req.query.page === undefined ? 1 : Number(req.query.page);
    if (!Number.isInteger(limit) || limit === 0 || (!Number.isInteger(page) || page < 1)) {
      return res.status(400).json({ error: 'Invalid pagination parameters' });
    }

    const where = {};
    if (req.query.use_in_menu !== undefined) {
      const value = String(req.query.use_in_menu).toLowerCase();
      if (!['true', 'false'].includes(value)) return res.status(400).json({ error: 'Invalid use_in_menu value' });
      where.use_in_menu = value === 'true';
    }

    const options = { where, order: [['id', 'ASC']] };
    if (limit !== -1) {
      options.limit = limit;
      options.offset = (page - 1) * limit;
    }
    if (req.query.fields) {
      options.attributes = ['id', ...req.query.fields.split(',').map((field) => field.trim()).filter(Boolean)];
    }
    const { rows, count } = await Category.findAndCountAll(options);
    return res.status(200).json({
      data: rows.map(categoryResponse),
      total: count,
      limit,
      page,
    });
  } catch (error) {
    return next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ error: 'Category not found' });
    return res.status(200).json(categoryResponse(category));
  } catch (error) {
    return next(error);
  }
});

router.post('/', auth, async (req, res, next) => {
  try {
    const { name, slug, use_in_menu = false } = req.body;
    if (!name || !slug) return res.status(400).json({ error: 'Name and slug are required' });
    const category = await Category.create({ name, slug, use_in_menu });
    return res.status(201).json(categoryResponse(category));
  } catch (error) {
    if (error.name?.startsWith('Sequelize')) return res.status(400).json({ error: 'Invalid category data' });
    return next(error);
  }
});

router.put('/:id', auth, async (req, res, next) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ error: 'Category not found' });
    const { name, slug, use_in_menu = false } = req.body;
    if (!name || !slug) return res.status(400).json({ error: 'Name and slug are required' });
    await category.update({ name, slug, use_in_menu });
    return res.status(204).send();
  } catch (error) {
    if (error.name?.startsWith('Sequelize')) return res.status(400).json({ error: 'Invalid category data' });
    return next(error);
  }
});

router.delete('/:id', auth, async (req, res, next) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ error: 'Category not found' });
    await category.destroy();
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
});

export default router;
