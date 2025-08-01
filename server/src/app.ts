import cors from 'cors';
import express, { Application, Request, Response } from 'express';
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

const test = async (_req: Request, res: Response) => {
  res.send(
    `😈 UniMate University server is listening on port ${config.port} 😈`,
  );
};

app.get('/', test);

//* Global Error Handler
app.use(globalErrorHandler);

//* Not Found Route
app.use(notFound);

export default app;
