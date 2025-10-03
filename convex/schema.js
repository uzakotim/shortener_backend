import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  urls: defineTable({
    shortCode: v.string(),
    originalUrl: v.string(),
    createdAt: v.number(), // store timestamp as a number (e.g. Date.now())
  }),
});
