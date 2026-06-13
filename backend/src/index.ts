import { app } from "./app.js"
import { NODE_ENV, PORT } from "./config/env.config.js";
import redis from "./lib/redis.js";

app.listen(PORT, async() => {
    console.log(`Server is running on port ${PORT} in ${NODE_ENV} mode`);
})