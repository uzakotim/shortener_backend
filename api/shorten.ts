import { ConvexHttpClient } from "convex/browser";
import type { VercelRequest, VercelResponse } from '@vercel/node'

const client = new ConvexHttpClient(process.env.CONVEX_URL!);

// helper to generate random short codes
function generateShortCode(length = 6) {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from({ length })
    .map(() => chars[Math.floor(Math.random() * chars.length)])
    .join("");
}


export async function POST(req : VercelRequest, res : VercelResponse) {

  const { originalUrl } = req.body;

  if (!originalUrl) {
    return res.status(400).json({ error: "Missing originalUrl" });
  }

  const createdAt = Date.now();

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const shortCode = generateShortCode();
    try {
      //@ts-ignore
      await client.mutation("urls.insert", {
        shortCode,
        originalUrl,
        createdAt,
      });
      return res
        .status(200)
        .json({ shortUrl: `${process.env.BASE_URL}/${shortCode}` });
    } catch (error) {
      //@ts-ignore
      if (!/already exists/.test(String(error?.message ?? ""))) {
        throw error;
      }
    }
  }

  return res.status(503).json({ error: "Unable to allocate a short code, try again." });
}