import { ConvexHttpClient } from "convex/browser";

const client = new ConvexHttpClient(process.env.CONVEX_URL);

// helper to generate random short codes
function generateShortCode(length = 6) {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from({ length })
    .map(() => chars[Math.floor(Math.random() * chars.length)])
    .join("");
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { originalUrl } = req.body;
  if (!originalUrl) {
    return res.status(400).json({ error: "Missing originalUrl" });
  }

  const shortCode = generateShortCode();

  await client.mutation("urls.insert", {
    shortCode,
    originalUrl,
    createdAt: Date.now(),
  });

  res.status(200).json({ shortUrl: `${process.env.BASE_URL}/${shortCode}` });
}