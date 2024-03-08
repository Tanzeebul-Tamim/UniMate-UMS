import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import config from './app/config';

const app: Application = express();

//parsers
app.use(express.json());
app.use(cors());

app.get('/', (req: Request, res: Response) => {
  res.send(`PH University server is listening on ${config.port}`);
});

export default app;
