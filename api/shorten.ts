import { ConvexHttpClient } from "convex/browser";
import { NextRequest, NextResponse} from 'next/server'
import { api } from "../convex/_generated/api";

// helper to generate random short codes
function generateShortCode(length = 6) {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from({ length })
    .map(() => chars[Math.floor(Math.random() * chars.length)])
    .join("");
}


export async function POST(req : NextRequest, res : NextResponse) {

  const client = new ConvexHttpClient(process.env.CONVEX_URL!);
  console.log(process.env.CONVEX_URL)

  const { originalUrl } = await req.json();

  if (!originalUrl) {
    return NextResponse.json({ error: "Missing originalUrl" }, { status: 400 });
  }

  const createdAt = Date.now();

  // Check if the originalUrl already exists in the database
  const existingUrl = await client.query(api.urls.GetByOriginalUrl, { originalUrl });
  if (existingUrl) {
    return NextResponse.json({ shortUrl: `${process.env.BASE_URL!}/${existingUrl.shortCode}` }, { status: 200 });
  }

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const shortCode = generateShortCode();
    try {
        await client.mutation(api.urls.Insert, {
          shortCode,
          originalUrl,
          createdAt,
        });
        return NextResponse.json({ shortUrl: `${process.env.BASE_URL!}/${shortCode}` }, { status: 200 });

      } catch (error) {
         return NextResponse.json({ error: "Database error" }, { status: 500 });
      }
  }

   return NextResponse.json({ error: "Unable to allocate a short code, try again." }, { status: 503 });
}