import type { NextApiRequest, NextApiResponse } from 'next'
import mongooseConnect from '../../utils/db/connect';
import Config from '../../models/Config';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await mongooseConnect();

    if (req.headers['x-password'] !== process.env.NEXT_PUBLIC_PASSWORD) {
        res.status(401).json({ status: 'error' });
        return;
    }

    if (req.method === 'GET') {
        const config = await Config.findOne({}, { _id: 0, __v: 0 });
        res.status(200).json(config);
    }

    if (req.method === 'POST') {
        // TODO register the update of the config in config history
        const botConfig = await Config.findOne();
        Object.keys(req.body).forEach(key => {
            botConfig[key] = req.body[key];
        });
        await botConfig.save().then(() => {
            res.status(200).json({ status: 'success' });
        }).catch(() => {
            res.status(500).json({ status: 'error' });
        });
    }
}

export {};