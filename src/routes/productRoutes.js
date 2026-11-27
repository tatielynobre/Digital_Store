import { Router } from 'express';
import { Op } from 'sequelize';
import {
  Category,
  Product,
  ProductImage,
  ProductOption,
  sequelize,
} from '../models/index.js';
import auth from '../middleware/auth.js';

const router = Router();

function parseImagePath(image) {
  if (image.content && /^https?:\/\//i.test(image.content)) return image.content;
  if (image.content && image.content.startsWith('data:image/')) {
    return image.content;
  }
  if (image.content) return `data:${image.type || 'image/png'};base64,${image.content}`;
  return null;
}

function toProductResponse(product) {
  const plain = product.toJSON();
  const categoryIds = plain.categories ? plain.categories.map((category) => category.id) : [];
  return {
    id: plain.id,
    enabled: Boolean(plain.enabled),
    name: plain.name,
    slug: plain.slug,
    use_in_menu: Boolean(plain.use_in_menu),
    stock: plain.stock,
    description: plain.description,
    price: plain.price,
    price_with_discount: plain.price_with_discount,
    category_ids: categoryIds,
    images: (plain.images || []).map((image) => ({
      id: image.id,
      enabled: Boolean(image.enabled),
      content: image.path,
    })),
    options: (plain.options || []).map((option) => ({
      id: option.id,
      title: option.title,
      shape: option.shape,
      radius: option.radius,
      type: option.type,
      values: option.values ? option.values.split(',').map((value) => value.trim()) : [],
    })),
  };
}

async function findProduct(id) {
  return Product.findByPk(id, {
    include: [
      { model: Category, as: 'categories', attributes: ['id'], through: { attributes: [] } },
      { model: ProductImage, as: 'images' },
      { model: ProductOption, as: 'options' },
    ],
  });
}

router.get('/search', async (req, res, next) => {
  try {
    const limit = req.query.limit === undefined ? 12 : Number(req.query.limit);
    const page = req.query.page === undefined ? 1 : Number(req.query.page);
    if (!Number.isInteger(limit) || limit === 0 || !Number.isInteger(page) || page < 1) {
      return res.status(400).json({ error: 'Invalid pagination parameters' });
    }

    const where = {};
    if (req.query.match) {
      where[Op.or] = [
        { name: { [Op.like]: `%${req.query.match}%` } },
        { description: { [Op.like]: `%${req.query.match}%` } },
      ];
    }
    if (req.query['price-range']) {
      const match = /^(\d+(?:\.\d+)*)-(\d+(?:\.\d+)*)$/.exec(req.query['price-range']);
      if (!match) return res.status(400).json({ error: 'Invalid price-range' });
      where.price = { [Op.between]: [Number(match[1]), Number(match[2])] };
    }

    const include = [
      { model: Category, as: 'categories', attributes: ['id'], through: { attributes: [] } },
      { model: ProductImage, as: 'images' },
      { model: ProductOption, as: 'options' },
    ];
    if (req.query.category_ids) {
      const ids = req.query.category_ids.split(',').map((id) => Number(id));
      if (ids.some((id) => !Number.isInteger(id) || id < 1)) {
        return res.status(400).json({ error: 'Invalid category_ids' });
      }
      include[0].where = { id: { [Op.in]: ids } };
    }

    const query = {
      where,
      include,
      distinct: true,
      order: [['id', 'ASC']],
    };
    if (limit !== -1) {
      query.limit = limit;
      query.offset = (page - 1) * limit;
    }
    if (req.query.fields) {
      const allowed = new Set([
        'id', 'enabled', 'name', 'slug', 'use_in_menu', 'stock', 'description',
        'price', 'price_with_discount',
      ]);
      const fields = req.query.fields.split(',').map((field) => field.trim()).filter((field) => allowed.has(field));
      query.attributes = fields.length ? ['id', ...fields.filter((field) => field !== 'id')] : ['id'];
    }

    const { rows, count } = await Product.findAndCountAll(query);
    return res.status(200).json({
      data: rows.map(toProductResponse),
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
    const product = await findProduct(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    return res.status(200).json(toProductResponse(product));
  } catch (error) {
    return next(error);
  }
});

router.post('/', auth, async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const {
      enabled = false,
      name,
      slug,
      use_in_menu = false,
      stock = 0,
      description,
      price,
      price_with_discount = 0,
      category_ids = [],
      images = [],
      options = [],
    } = req.body;
    if (!name || !slug || price === undefined || !Array.isArray(category_ids)) {
      await transaction.rollback();
      return res.status(400).json({ error: 'Invalid product data' });
    }
    const product = await Product.create({
      enabled, name, slug, use_in_menu, stock, description, price, price_with_discount,
    }, { transaction });

    if (category_ids.length) {
      const categories = await Category.findAll({ where: { id: { [Op.in]: category_ids } }, transaction });
      if (categories.length !== category_ids.length) {
        await transaction.rollback();
        return res.status(400).json({ error: 'One or more categories do not exist' });
      }
      await product.setCategories(categories, { transaction });
    }
    for (const image of images) {
      const path = parseImagePath(image);
      if (!path) {
        await transaction.rollback();
        return res.status(400).json({ error: 'Invalid product image' });
      }
      await ProductImage.create({ product_id: product.id, enabled: image.enabled ?? true, path }, { transaction });
    }
    for (const option of options) {
      const values = Array.isArray(option.values) ? option.values : option.value;
      if (!option.title || !Array.isArray(values) || !values.length) {
        await transaction.rollback();
        return res.status(400).json({ error: 'Invalid product option' });
      }
      await ProductOption.create({
        product_id: product.id,
        title: option.title,
        shape: option.shape || 'square',
        radius: typeof option.radius === 'string' ? Number.parseInt(option.radius, 10) || 0 : (option.radius || 0),
        type: option.type || 'text',
        values: values.join(','),
      }, { transaction });
    }
    await transaction.commit();
    const created = await findProduct(product.id);
    return res.status(201).json(toProductResponse(created));
  } catch (error) {
    await transaction.rollback();
    if (error.name?.startsWith('Sequelize')) return res.status(400).json({ error: 'Invalid product data' });
    return next(error);
  }
});

router.put('/:id', auth, async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const product = await Product.findByPk(req.params.id, { transaction });
    if (!product) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Product not found' });
    }
    const body = req.body;
    if (!body.name || !body.slug || body.price === undefined) {
      await transaction.rollback();
      return res.status(400).json({ error: 'Invalid product data' });
    }
    await product.update({
      enabled: body.enabled ?? product.enabled,
      name: body.name,
      slug: body.slug,
      use_in_menu: body.use_in_menu ?? product.use_in_menu,
      stock: body.stock ?? product.stock,
      description: body.description,
      price: body.price,
      price_with_discount: body.price_with_discount ?? 0,
    }, { transaction });

    if (Array.isArray(body.category_ids)) {
      const categories = await Category.findAll({ where: { id: { [Op.in]: body.category_ids } }, transaction });
      if (categories.length !== body.category_ids.length) {
        await transaction.rollback();
        return res.status(400).json({ error: 'One or more categories do not exist' });
      }
      await product.setCategories(categories, { transaction });
    }
    if (Array.isArray(body.images)) {
      for (const image of body.images) {
        if (image.deleted && image.id) {
          await ProductImage.destroy({ where: { id: image.id, product_id: product.id }, transaction });
        } else if (image.id) {
          const existing = await ProductImage.findOne({ where: { id: image.id, product_id: product.id }, transaction });
          if (existing) await existing.update({ path: parseImagePath(image) || existing.path, enabled: image.enabled ?? existing.enabled }, { transaction });
        } else {
          const path = parseImagePath(image);
          if (path) await ProductImage.create({ product_id: product.id, enabled: image.enabled ?? true, path }, { transaction });
        }
      }
    }
    if (Array.isArray(body.options)) {
      for (const option of body.options) {
        if (option.deleted && option.id) {
          await ProductOption.destroy({ where: { id: option.id, product_id: product.id }, transaction });
        } else if (option.id) {
          const existing = await ProductOption.findOne({ where: { id: option.id, product_id: product.id }, transaction });
          if (existing) {
            const values = Array.isArray(option.values) ? option.values : option.value;
            await existing.update({
              title: option.title ?? existing.title,
              shape: option.shape ?? existing.shape,
              radius: option.radius === undefined ? existing.radius : (typeof option.radius === 'string' ? Number.parseInt(option.radius, 10) || 0 : option.radius),
              type: option.type ?? existing.type,
              values: values ? values.join(',') : existing.values,
            }, { transaction });
          }
        } else {
          const values = Array.isArray(option.values) ? option.values : option.value;
          if (option.title && values?.length) {
            await ProductOption.create({
              product_id: product.id,
              title: option.title,
              shape: option.shape || 'square',
              radius: typeof option.radius === 'string' ? Number.parseInt(option.radius, 10) || 0 : (option.radius || 0),
              type: option.type || 'text',
              values: values.join(','),
            }, { transaction });
          }
        }
      }
    }
    await transaction.commit();
    return res.status(204).send();
  } catch (error) {
    await transaction.rollback();
    if (error.name?.startsWith('Sequelize')) return res.status(400).json({ error: 'Invalid product data' });
    return next(error);
  }
});

router.delete('/:id', auth, async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    await product.destroy();
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
});

export default router;
