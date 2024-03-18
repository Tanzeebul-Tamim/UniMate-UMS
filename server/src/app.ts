/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import cors from 'cors';
import express, { Application, NextFunction, Request, Response } from 'express';
import config from './app/config';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
import router from './app/routes';

const app: Application = express();

//* parsers
app.use(express.json());
app.use(cors());

//* application routes
app.use('/api/v1', router);

const test = (req: Request, res: Response) => {
  res.send(`PH University server is listening on ${config.port}`);
};

app.get('/', test);

//* Global Error Handler
app.use(globalErrorHandler);

//* Not Found Route
app.use(notFound);

export default app;
