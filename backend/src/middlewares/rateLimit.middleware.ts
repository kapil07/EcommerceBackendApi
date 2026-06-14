import { rateLimit } from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import redis from "../lib/redis.js";

export const globalLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 15 min
  max: 15, // 100 req in 15 min

  message: {
    success: false,
    message: "Too many requests. Please try again later",
  },

  standardHeaders: true,
  legacyHeaders: false,

  store: new RedisStore({
    sendCommand: (...args: string[]) => redis.call(...args),
    prefix: "global:"
  }),
});

export const authLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 5,

  message: {
    success: false,
    message: "Too many authentication attempts",
  },
  standardHeaders: true,
  legacyHeaders: false,

  store: new RedisStore({
    sendCommand: (...args: string[]) => redis.call(...args),
    prefix: "auth:"
  }),
});

export const userLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
//   max: 200,

  max: async(req) => {

    if(req.user?.role === "ADMIN"){
        return 6
    }
    else if(req.user?.role === "SELLER"){
        return 5
    }
    return 4

  },

  message: {
    success: false,
    message: "UserLimiter Message: Too many attempts",
  },
  standardHeaders: true,
  legacyHeaders: false,

  keyGenerator: (req) => {
    return req.user?.id as string || req.ip as string
  },

  store: new RedisStore({
    sendCommand: (...args: string[]) => redis.call(...args),
    prefix: "user:"
  }),
});

export const productLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,

  message: {
    success: false,
    message: "ProductLimiterMessage:Too many requests, Please try again later",
  },
  standardHeaders: true,
  legacyHeaders: false,

  store: new RedisStore({
    sendCommand: (...args: string[]) => redis.call(...args),
    prefix:"product:"
  }),
});
