import rateLimit from "express-rate-limit";

export const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,             // 10 req/min/IP
  message: { error: "Too many requests, slow down!" }
});
