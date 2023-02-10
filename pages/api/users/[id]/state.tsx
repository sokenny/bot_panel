import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.headers['x-password'] !== process.env.NEXT_PUBLIC_PASSWORD) {
        res.status(401).json({ status: 'error' });
        return;
    }

    if (req.method === 'GET') {
        const id = req.query.id;
        const state = await fetch("http://localhost:9999/users/1/state", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }).then((res) => res.json());
        res.status(200).json(state);
    }

}

export {};