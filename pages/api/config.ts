import type { NextApiRequest, NextApiResponse } from 'next'
import mongooseConnect from '../../utils/db/connect';
import Config from '../../models/Config';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await mongooseConnect();
    if (req.method === 'GET') {
        const botConfig = await Config.findOne();
        res.status(200).json(botConfig);
    }
    if (req.method === 'POST') {
        const botConfig = await Config.findOne();
        Object.keys(req.body).forEach(key => {
            botConfig[key] = req.body[key];
        });
        await botConfig.save();
        res.status(200).json(botConfig);
    }
}

export {};