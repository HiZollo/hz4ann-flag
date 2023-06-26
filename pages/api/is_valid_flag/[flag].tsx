import type { NextApiRequest, NextApiResponse } from 'next'

import Flags from '@/utils/flagUtils';

const flags = Object.values(Flags)
  .sort()
  .map(flag => {
    const matches = flag.match(/hz4ann_flag_{(.+)}/)
    return matches![1]
  })

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const auth = req.headers.authorization as string

    if (!auth) {
      res.status(401).json({ error: 'unauthorized' })
      return
    }

    if (auth !== process.env.FLAG_SECRET) {
      res.status(401).json({ error: 'unauthorized' })
      return
    }

    const flag = req.query.flag as string

    if (!flag) {
      res.status(400).json({ error: 'bad request' })
      return 
    }

    const id = flags.findIndex(f => f === flag)

    res.status(200).json({ result: id })

    return
  }

  res.status(405).json({ error: "method not allowed" })
}
