import { app } from "./app.js"
import { NODE_ENV, PORT } from "./config/env.config.js";

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} in ${NODE_ENV} mode`);
})