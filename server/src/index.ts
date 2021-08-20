import path from "path";
import * as dotenv from "dotenv";
dotenv.config({ path: path.join(__dirname, "../../.env") });

import "./config/db";
import { app } from "./server";

const PORT = 4000 || process.env.PORT;
app.listen(PORT, () => {
  console.log(`Go to port ${4000}`);
});
