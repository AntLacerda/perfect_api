import express, { Request, Response } from 'express';
import cors from 'cors';
import limiter from '../middlewares/rateLimit';
import { errorHandler } from '@src/middlewares/errorHandler';

import { UserRouter } from '@src/routers/User';

const app = express();

app.use(express.json());
app.use(cors());
app.use(limiter);

const basePathUrlApiV1 = '/api/v1';

app.get(`${basePathUrlApiV1}/hello-world`, (req: Request, res: Response) => {
    res.status(200).json({
        message: 'Hello World!'
    })
    return;
});

app.use(`${basePathUrlApiV1}/users`, UserRouter);

app.use(errorHandler);

export default app;