import passport from "passport";
import passportGithub from "passport-github2";
import passportGoogle from "passport-google-oauth20";
import { User } from "../model/user";

let {
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
} = process.env;

passport.serializeUser(function (user: any, done) {
  done(null, user._id);
});

passport.deserializeUser(function (id, done) {
  User.findById(
    id,
    function (err: any, user: boolean | Express.User | null | undefined) {
      done(err, user);
    }
  );
});

const GitHubStrategy = passportGithub.Strategy;
const GoogleStrategy = passportGoogle.Strategy;

passport.use(
  new GitHubStrategy(
    {
      clientID: GITHUB_CLIENT_ID || "",
      clientSecret: GITHUB_CLIENT_SECRET || "",
      callbackURL: "http://localhost:4000/api/auth/github/callback",
    },
    async function (
      accessToken: string,
      refreshToken: string,
      profile: any,
      done: any
    ) {
      // console.log(profile);
      const { name, id, email, avatar_url, login } = profile._json;
      const user = await User.findOne({ platformId: id, platform: "github" });
      if (!email) {
        return done("no email");
      }
      if (user) {
        user.pic = avatar_url;
        user.accessToken = accessToken;
        user.name = name || "";
        user.username = login;
        const result = await user.save();
        return done(null, result);
      }
      const result = await new User({
        name: name || "",
        username: login,
        platformId: id,
        platform: "github",
        email: email,
        accessToken,
        refreshToken,
        localRefreshToken: "",
        pic: avatar_url,
      }).save();
      return done(null, result);
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID || "",
      clientSecret: GOOGLE_CLIENT_SECRET || "",
      callbackURL: "http://localhost:4000/api/auth/google/callback",
    },
    async function (
      accessToken: string,
      refreshToken: string,
      profile: any,
      done: any
    ) {
      // console.log(profile);
      const { name, sub, email, picture } = profile._json;
      const user = await User.findOne({ platformId: sub, platform: "google" });
      if (user) {
        user.pic = picture;
        user.accessToken = accessToken;
        user.name = name;
        const result = await user.save();
        return done(null, result);
      }
      const result = await new User({
        name: name,
        platformId: sub,
        platform: "google",
        email: email,
        accessToken,
        refreshToken,
        localRefreshTokens: [],
        pic: picture,
      }).save();
      return done(null, result);
    }
  )
);
