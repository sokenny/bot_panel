import type { NextApiRequest, NextApiResponse } from 'next'
import mongooseConnect from '../../../utils/db/connect';
import User from '../../../models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await mongooseConnect();

    if (req.headers['x-password'] !== process.env.NEXT_PUBLIC_PASSWORD) {
        res.status(401).json({ status: 'error' });
        return;
    }

    if (req.method === 'GET') {
        const users = await User.find();
        res.status(200).json(users);
    }

}

export {};