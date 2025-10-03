import { ConvexHttpClient } from "convex/browser";

const client = new ConvexHttpClient(process.env.CONVEX_URL);

export default async function handler(req, res) {
  const { shortCode } = req.query;
  console.log("shortCode", shortCode);


  // const url = await client.query("urls.getByShortCode", { shortCode });
  // if (!url) {
    // return res.status(404).send("Not found");
  // }

  // res.writeHead(302, { Location: url.originalUrl });
  res.end();
}