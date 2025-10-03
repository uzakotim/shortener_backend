import { query, mutation } from "../convex/_generated/server";
import { v } from "convex/values";

export const Insert = mutation({
  args: {
    shortCode: v.string(),
    originalUrl: v.string(),
    createdAt: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("urls", {
      shortCode: args.shortCode,
      originalUrl: args.originalUrl,
      createdAt: args.createdAt,
    });
  },
});

export const GetByShortCode = query({
  args: { shortCode: v.string() },
  handler: async (ctx, args) => {
    const results = await ctx.db
      .query("urls")
      .filter(q => q.eq(q.field("shortCode"), args.shortCode))
      .collect();

    return results[0] ?? null;
  },
});

export const GetByOriginalUrl = query({
  args: { originalUrl: v.string() },
  handler: async (ctx, args) => {
    const results = await ctx.db
      .query("urls")
      .filter(q => q.eq(q.field("originalUrl"), args.originalUrl))
      .collect();

    return results[0] ?? null;
  },
})
