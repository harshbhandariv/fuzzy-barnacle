import { connect } from "mongoose";
const uri: string = process.env.MONGO_URI || "";
connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("Connected to MongoDB");
});
