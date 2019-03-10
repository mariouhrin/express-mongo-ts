import express, { Response, NextFunction } from 'express';
import morgan from 'morgan';
import { MongoClient } from 'mongodb';

import { Routes } from './routes';
import { config } from './config';
import { IExtendedExpressApp } from './types/interfaces/app-express.interface';
import { IExtendedRequest } from './types/interfaces/request.interface';
import logger from './config/logger';

const app: IExtendedExpressApp = express();
const port: number = Number(process.env.PORT) || 3000;

// add morgan logger to express
app.use(morgan('dev'));

// add all routes to express
app.use('/api', Routes);

// global error handling
app.use((err: Error, req: IExtendedRequest, res: Response, next: NextFunction) => {
  if (err.message.includes('Not found')) {
    return res.status(404).send(err.message);
  }
  res.send('Something goes wrong');
});

// run mongodb and express server
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
