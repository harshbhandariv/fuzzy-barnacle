import { app } from "./server";
const PORT = 4000 || process.env.PORT;
app.listen(PORT, () => {
  console.log(`Go to port ${4000}`);
});
