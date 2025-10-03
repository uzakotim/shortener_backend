import { ConvexHttpClient } from "convex/browser";
const client = new ConvexHttpClient(process.env.CONVEX_URL!);
import { api } from "../convex/_generated/api";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  // Extract shortCode from the URL path
  const rawUrl = new URL(req.url, `http://${req.headers.get("host")}`);
  const shortCode = rawUrl.pathname.slice(1); // Remove leading '/'
  if (typeof shortCode !== "string" || shortCode.trim().length === 0) {
    return NextResponse.json({ error: "Missing short code" }, { status: 400 });
  }

  const url = await client.query(api.urls.GetByShortCode, { shortCode: shortCode });
  if (!url) {
    return NextResponse.json({ error: "Short code not found" }, { status: 404 });
  }

  return NextResponse.redirect(url.originalUrl);
}