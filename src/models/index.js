import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

export const User = sequelize.define(
  'User',
  {
    firstname: { type: DataTypes.STRING, allowNull: false },
    surname: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
    password: { type: DataTypes.STRING, allowNull: false },
  },
  { tableName: 'users', underscored: true, timestamps: true },
);

export const Category = sequelize.define(
  'Category',
  {
    name: { type: DataTypes.STRING, allowNull: false },
    slug: { type: DataTypes.STRING, allowNull: false, unique: true },
    use_in_menu: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  },
  { tableName: 'categories', underscored: true, timestamps: true },
);

export const Product = sequelize.define(
  'Product',
  {
    enabled: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    name: { type: DataTypes.STRING, allowNull: false },
    slug: { type: DataTypes.STRING, allowNull: false, unique: true },
    use_in_menu: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    stock: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    description: { type: DataTypes.STRING, allowNull: true },
    price: { type: DataTypes.FLOAT, allowNull: false },
    price_with_discount: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
  },
  { tableName: 'products', underscored: true, timestamps: true },
);

export const ProductImage = sequelize.define(
  'ProductImage',
  {
    enabled: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    path: { type: DataTypes.STRING, allowNull: false },
  },
  { tableName: 'product_images', underscored: false, timestamps: false },
);

export const ProductOption = sequelize.define(
  'ProductOption',
  {
    title: { type: DataTypes.STRING, allowNull: false },
    shape: { type: DataTypes.ENUM('square', 'circle'), allowNull: false, defaultValue: 'square' },
    radius: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    type: { type: DataTypes.ENUM('text', 'color'), allowNull: false, defaultValue: 'text' },
    values: { type: DataTypes.STRING, allowNull: false },
  },
  { tableName: 'product_options', underscored: false, timestamps: false },
);

Product.hasMany(ProductImage, { foreignKey: 'product_id', as: 'images', onDelete: 'CASCADE' });
ProductImage.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });
Product.hasMany(ProductOption, { foreignKey: 'product_id', as: 'options', onDelete: 'CASCADE' });
ProductOption.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });
Product.belongsToMany(Category, { through: 'product_categories', foreignKey: 'product_id', otherKey: 'category_id', as: 'categories' });
Category.belongsToMany(Product, { through: 'product_categories', foreignKey: 'category_id', otherKey: 'product_id', as: 'products' });

export { sequelize };
