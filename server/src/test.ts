import path from "path";
import * as dotenv from "dotenv";
dotenv.config({ path: path.join(__dirname, "../../.env") });
import "./config/db";
import { User } from "./model/user";
async function summa() {
  // const result = await new User({
  //   name: "hars",
  //   platform: "ggg",
  //   platformId: "1234",
  //   username: "sdffString",
  //   email: "String@fmf.c",
  //   accessToken: "s",
  //   refreshToken: "sString",
  //   localRefreshToken: [],
  //   pic: "string",
  // }).save();
  const result = await User.findByIdAndUpdate("611eac7ec666f134244f7c05", {
    $push: { localRefreshToken: "beggarsarenotchoose" },
  });
  console.log(result);
}
summa();
