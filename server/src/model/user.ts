import { Schema, model } from "mongoose";

const userSchema = new Schema({
  name: String,
  platform: String,
  platformId: String,
  username: String,
  email: String,
  accessToken: String,
  refreshToken: String,
  localRefreshTokens: [String],
  pic: String,
});

const User = model("User", userSchema);

export { User };
