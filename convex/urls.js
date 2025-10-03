import { mutation, query } from "./_generated/server";

export const insert = mutation(async ({ db }, { shortCode, originalUrl, createdAt }) => {
  const existing = await db
    .table("urls")
    .filter(q => q.eq(q.field("shortCode"), shortCode))
    .first();

  if (existing) {
    throw new Error(`shortCode "${shortCode}" already exists`);
  }
  await db.insert("urls", { shortCode, originalUrl, createdAt });
});

export const getByShortCode = query(async ({ db }, { shortCode }) => {
  return await db
    .table("urls")
    .filter(q => q.eq(q.field("shortCode"), shortCode))
    .first();
});



