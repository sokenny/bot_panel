import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.headers['x-password'] !== process.env.NEXT_PUBLIC_PASSWORD) {
        res.status(401).json({ status: 'error' });
        return;
    }

    if (req.method === 'GET') {
       // get stdout from process.env.BOT_ENDPOINT + '/blackbox/stdout'
       const stdout = await fetch(process.env.BOT_ENDPOINT + '/blackbox/stdout', {
              method: 'GET',
                headers: {  
                    'Content-Type': 'application/json',
                    'X-Password': process.env.NEXT_PUBLIC_PASSWORD || '',
                },
            }).then((res) => res.json());
        console.log("stdout: ", stdout);
         // get stderr from process.env.BOT_ENDPOINT + '/blackbox/stderr'
         
    }

}

export {};