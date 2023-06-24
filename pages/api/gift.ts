import CryptoJS from 'crypto-js';
import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

const AES_KEY = "8cb75f9082d0ef2c200d8209bf9e477453767d8678b32f059861e4817ba7003f";

interface PostBodyReceived {
  name?: string
  want?: string
  id?: string
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    if (!process.env.SCAM_HOOK_ID || !process.env.SCAM_HOOK_TOKEN) {
      res.status(500).json({ error: 'internal error' })
      return
    }

    if (!req.body) {
      res.status(400).json({ error: 'bad request' })
      return
    }

    
    try {
      const body = JSON.parse(req.body) as PostBodyReceived

      if (!body.name || !body.want) {
        res.status(400).json({ error: 'bad request' })
        return
      }

      if (!body.id) {
        res.status(401).json({ error: 'unauthorized' })
        return
      }

      const { name, want, id } = body

      const token = decrypt(id)
      
      if (!check_token_pattern(token)) {
        res.status(401).json({ error: 'unauthorized' })
        return
      }

      sendToDiscordWebhook({
        nameOrId: name,
        gift: want,
        id: process.env.SCAM_HOOK_ID,
        token: process.env.SCAM_HOOK_TOKEN
      })
      res.status(201).json({ send: true, gift: want })
      return
    } catch(e) {
      console.log(e)
      res.status(400).json({ error: 'bad request' })
      return
    }
  }
  res.status(405).json({ error: "method not allowed" })
}

interface SendToDiscordWebhookOptions {
  nameOrId: string
  gift: string
  id: string
  token: string
}

function sendToDiscordWebhook({
  nameOrId, gift, id, token
}: SendToDiscordWebhookOptions) {
  return axios({
    method: 'post',
    url: `https://discord.com/api/v10/webhooks/${id}/${token}`,
    data: {
      embeds: [{
        title: '又有人被騙了',
        type: 'rich',
        fields: [{
          name: '用戶名稱或 ID',
          value: nameOrId
        }, {
          name: '可能是用戶的 tag',
          value: `<@${nameOrId}>`
        }, {
          name: '想要的東西',
          value: gift
       }]
      }]
    },
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

function decrypt(data: string) {
  const bytes = CryptoJS.AES.decrypt(data, AES_KEY);
  const text = bytes.toString(CryptoJS.enc.Utf8);
  return text;
}

function check_token_pattern(token: string) {
  const result = token.match(/I_WANT_(\d+?)_PINEAPPLE_PIZZA/);
  if (!result) return false;

  const time = Number(result[1]);
  if (isNaN(time)) return false;

  return Date.now() - time <= 1e3;
}