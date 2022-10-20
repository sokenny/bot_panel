import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const password = req.body.password;
        if (password === process.env.NEXT_PUBLIC_PASSWORD) {
            res.status(200).json({ status: 'success' });
        } else {
            res.status(401).json({ status: 'error' });
        }
    }
}

export {};