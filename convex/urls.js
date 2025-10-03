import { mutation, query } from "./_generated/server";

export const insert = mutation(async ({ db }, { shortCode, originalUrl, createdAt }) => {
  await db.insert("urls", { shortCode, originalUrl, createdAt });
});

export const getByShortCode = query(async ({ db }, { shortCode }) => {
  return await db
    .table("urls")
    .filter(q => q.eq(q.field("shortCode"), shortCode))
    .first();
});



