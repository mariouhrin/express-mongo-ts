import express from 'express';
import errorHandler from 'errorhandler';
import { MongoClient } from 'mongodb';

import { Routes } from './routes';
import { config } from './config';
import { IExtendedExpressApp } from './types/interfaces/app-express.interface';
import logger from './config/logger';

const app: IExtendedExpressApp = express();
const port: number = Number(process.env.PORT) || 3000;

app.use('/api', Routes);

app.use(errorHandler());

async function initServerAndDB() {
  try {
    const { mongoDbName, mongoUrl } = config;
    const connection: MongoClient = await MongoClient.connect(mongoUrl, {
      useNewUrlParser: true
    });
    const db = connection.db(mongoDbName);
    logger.info(`Connected to Mongodb: ${mongoDbName}`);

    app.locals.db = db;
  } catch (err) {
    logger.error(`Cannot connect to mongodb in hapi mongodb-plugin: ${err}`);
  }

  app.listen(port, () => {
    logger.info(`Listening at http://localhost:${port}`);
  });
}

initServerAndDB();
