// APIs till now
// /api/auth/github
// /api/auth/github/callback
// /api/auth/google
// /api/auth/google/callback
// /api/auth/refresh_token
// /api/auth/logout - rewrite

//Todo - revoking tokens
import express, { NextFunction, Request, Response } from "express";
import "./config/passport";
import passport from "passport";
import cookieparser from "cookie-parser";
import { sign, verify } from "jsonwebtoken";
import { User } from "./model/user";
const app = express();
app.use(passport.initialize());
app.use(cookieparser());

app.get("/api/auth/github", passport.authenticate("github"));
app.get(
  "/api/auth/google",
  passport.authenticate("google", {
    scope: [
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
    ],
    session: false,
  })
);
app.get(
  "/api/auth/github/callback",
  passport.authenticate("github"),
  setRefreshToken
);
app.get(
  "/api/auth/google/callback",
  passport.authenticate("google"),
  setRefreshToken
);

app.get("/api/auth/refresh_token", async (req, res) => {
  if (!req.cookies.refreshToken)
    return res.status(401).send({ error: "No cookie present" });
  try {
    const { name, sub }: any = verify(
      req.cookies.refreshToken,
      process.env.RefreshToken as string
    );
    const user = await User.findById(sub);
    // console.log(user, "place 1");
    const tokens = [...user.localRefreshTokens];
    const index = tokens.indexOf(req.cookies.refreshToken);
    // console.log(index, "index place 1");
    if (index == -1) return res.send({ error: "Login again" });
    tokens.splice(index, 1);
    user.localRefreshTokens = tokens;
    // console.log(user, "place 2");
    // console.log(user.localRefreshTokens, "haha");
    const accessToken = sign({ name, sub }, process.env.AccessToken as string, {
      expiresIn: "15 minutes",
    });
    const refreshToken = sign(
      { name, sub },
      process.env.RefreshToken as string,
      {
        expiresIn: "14 days",
      }
    );
    user.localRefreshTokens.push(refreshToken);
    const result = await user.save();
    // console.log(user, "place 3");
    if (!result) return res.status(500).send({ error: "Something failed" });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 86400 * 14 * 1000,
    });
    res.send({ accessToken });
  } catch (error) {
    res.send(error);
  }
});

app.get(
  "/api/whoami",
  checkAuthorizationHeader,
  verifyBearerToken,
  getUser,
  (req: any, res) => {
    res.send(req.user);
  }
);

function checkAuthorizationHeader(req: any, res: Response, next: NextFunction) {
  const authorization = req.get("Authorization");
  // console.log(authorization, 1233223);
  if (!authorization) return res.status(401).send({ error: "No token sent" });
  const bearerToken = authorization.substring(7);
  req.bearerToken = bearerToken;
  next();
}

function verifyBearerToken(req: any, res: Response, next: NextFunction) {
  const token = req.bearerToken;
  try {
    const { name, sub }: any = verify(token, process.env.AccessToken as string);
    req.sub = sub;
    next();
  } catch (error) {
    return res.send({ error: "Token authentication failed" });
  }
}

async function getUser(req: any, res: Response, next: NextFunction) {
  const id = req.sub;
  const user = await User.findById(id);
  if (!user) return res.send({ error: "No user exists" });
  req.user = user;
  next();
}

app.get("/api/auth/logout", async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  res.clearCookie("refreshToken");
  if (refreshToken) {
    try {
      const { name, sub }: any = verify(
        req.cookies.refreshToken,
        process.env.RefreshToken as string
      );
      const user = await User.findById(sub);
      if (!user) return res.redirect(process.env.FRONTEND_URI as string);
      const tokens = [...user.localRefreshTokens];
      const index = tokens.indexOf(refreshToken);
      if (index == -1) return res.redirect(process.env.FRONTEND_URI as string);
      tokens.splice(index, 1);
      user.localRefreshTokens = tokens;
      await user.save();
      return res.redirect(process.env.FRONTEND_URI as string);
    } catch (error) {
      return res.redirect(process.env.FRONTEND_URI as string);
    }
  }
  res.redirect(process.env.FRONTEND_URI as string);
});

app.get("/api/auth/logout/force", async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  res.clearCookie("refreshToken");
  if (refreshToken) {
    try {
      const { name, sub }: any = verify(
        req.cookies.refreshToken,
        process.env.RefreshToken as string
      );
      const user = await User.findById(sub);
      if (!user) return res.redirect(process.env.FRONTEND_URI as string);
      user.localRefreshTokens = [];
      await user.save();
      return res.redirect(process.env.FRONTEND_URI as string);
    } catch (error) {
      return res.redirect(process.env.FRONTEND_URI as string);
    }
  }
  res.redirect(process.env.FRONTEND_URI as string);
});

async function setRefreshToken(req: Request, res: Response) {
  const { name, _id } = req.user as any;
  const refreshToken = sign(
    { name: name, sub: _id },
    process.env.RefreshToken || "",
    { expiresIn: "14 days" }
  );
  const result = await User.findByIdAndUpdate(_id, {
    $push: {
      localRefreshTokens: refreshToken,
    },
  });
  // console.log(result);
  if (!result) return res.status(500).send({ error: "Login failed" });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: 86400 * 14 * 1000,
  });
  res.redirect(process.env.FRONTEND_URI as string);
}

export { app };
