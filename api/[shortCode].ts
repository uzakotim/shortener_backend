import { ConvexHttpClient } from "convex/browser";
import type { VercelRequest, VercelResponse } from '@vercel/node'
const client = new ConvexHttpClient(process.env.CONVEX_URL!);


export async function GET(req: VercelRequest, res: VercelResponse) {
  // Extract shortCode from the URL path
  // @ts-ignore
  const rawUrl = new URL(req.url, `http://${req.headers.host}`);
  const shortCode = rawUrl.pathname.slice(1); // Remove leading '/'
  if (typeof shortCode !== "string" || shortCode.trim().length === 0) {
    return res.status(400).json({ error: "Missing shortCode" });
  }

  // @ts-ignore
  const url = await client.query("urls.getByShortCode", { shortCode });
  if (!url) {
    return res.status(404).send("Not found");
  }

  res.writeHead(302, { Location: url.originalUrl });
  res.end();
  return res;
}