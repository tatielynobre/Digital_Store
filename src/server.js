import dotenv from 'dotenv';
import app from './app.js';
import sequelize from './config/database.js';
import './models/index.js';

dotenv.config();

const port = Number(process.env.PORT || 3000);

async function start() {
  await sequelize.authenticate();
  await sequelize.sync();
  app.listen(port, () => {
    console.log(`Digital Store API listening on http://localhost:${port}`);
  });
}

start().catch((error) => {
  const reason = error.parent?.code || error.original?.code || error.message || error.name;
  console.error('Unable to start the API:', reason);
  if ((process.env.DB_DIALECT || 'mysql') === 'mysql') {
    console.error(
      `Check that MySQL is running at ${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 3306}, ` +
        'and that the database settings in .env are correct. For local development without MySQL, ' +
        'set DB_DIALECT=sqlite and DB_STORAGE=./digital_store.sqlite.',
    );
  }
  process.exit(1);
});
