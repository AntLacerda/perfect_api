import express, { Request, Response } from 'express';
import cors from 'cors';
import limiter from '@src/middlewares/rateLimit';

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

export default app;