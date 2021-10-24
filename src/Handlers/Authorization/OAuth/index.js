const serverless = require("serverless-http");
const express = require("express");
const bodyParser = require("body-parser");

const passport = require("passport");

const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const LinkedInStrategy = require("@sokratis/passport-linkedin-oauth2").Strategy;

const _ = require("lodash");

const {
  authProviders,
  getSignInWithErrorMessage
} = require("/opt/nodejs/Constants/authProviders");

const mapPassportFieldsToUser = require("/opt/Helpers/mapPassportFieldsToUser");

const UserManager = require("/opt/UserManager");
const AuthManager = require("/opt/AuthManager");

const app = express();

// apply middleware
app.use(bodyParser.json());

passport.serializeUser((user, done) => {
  done(null, data.user.username);
});

passport.deserializeUser(async (username, done) => {
  const user = await UserManager.getFullUser(
    { username },
    { forceCongnito: true }
  );

  done(null, user);
});

const redirectBase = process.env.AWS_SAM_LOCAL
  ? ""
  : `https://spotjobsapp.com/api`;

const callback = async (accessToken, refreshToken, profile, done) => {
  try {
    console.log(profile);
    const userFields = mapPassportFieldsToUser(profile);

    if (!userFields.email) {
      done(null, false, {
        status: 400,
        message: "We can`t get email from your account.",
        code: "cant_get_email",
        profile
      });

      return;
    }

    const username = `${profile.provider}_${profile.id}`;
    const password = `Pas1${username}`;

    const identifier = {
      username
    };

    const newUserData = {
      username,
      password,
      user: userFields
    };

    const [user] = await UserManager.findOrCreate(identifier, newUserData, {
      forceCongnito: true,
      populate: true
    });

    const tokens = await AuthManager.signIn(username, password);

    done(null, { user, tokens });
  } catch (error) {
    if (Object.keys(authProviders).indexOf(error.message) > -1) {
      done(null, false, {
        status: 400,
        code: "wrongAuthProvider" + _.capitalize(error.message),
        message: getSignInWithErrorMessage(error.message)
      });

      return;
    }

    if (error.message === "UserExistsException") {
      done(null, false, {
        message: "User already exists",
        code: "UserExistsException"
      });

      return;
    }

    if (error.code === "UserWasDeleted") {
      done(null, false, {
        message: error.message,
        code: error.code
      });

      return;
    }
    console.error("oauth error", error);

    done(null, false, {
      status: 500,
      message: "Internal Server Error",
      code: "internal"
    });
  }
};

const getCallbackReqHandler = (redirectBase, req, res, next) => (
  err,
  signInData,
  info
) => {
  console.log("oauth callback");

  if (err) {
    console.log("oauth callback  err", err);
    return next(err);
  }

  let state = {};

  const { state: stateB64 } = req.query;

  if (stateB64) {
    try {
      const stateStr = Buffer.from(stateB64, "base64").toString();
      state = JSON.parse(stateStr);

      console.log("query state", state);

      const { redirect_uri } = state;

      console.log(typeof redirect_uri);

      if (typeof redirect_uri !== "string") {
        state.redirect_uri = null;
      }
    } catch (err) {
      console.error(err);
    }
  }

  console.log({ state });

  let redirectURL = state.redirect_uri || redirectBase;
  let responseKey = "user";
  let response = signInData;

  if (!signInData) {
    responseKey = "error_message";
    response = info;
  } else {
    if (!!state.only_tokens) {
      response = _.pick(signInData, "tokens");
    }
  }

  const redirectURLWithParams = `${redirectURL}?${responseKey}=${JSON.stringify(
    response
  )}`;

  console.log(redirectURLWithParams.length);
  console.log(redirectURLWithParams);

  res.redirect(redirectURLWithParams);
};

const authenticateReqHandler = (authType, authParams = {}, req, res, next) => {
  const stateObj = req.query || {};

  console.log("req.query", req.query);

  const state = Buffer.from(JSON.stringify(stateObj)).toString("base64");

  passport.authenticate(authType, _.assign(authParams, { state }))(
    req,
    res,
    next
  );
};

///////
// GOOGLE
///////

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.PROVIDER_GOOGLE_ID,
      clientSecret: process.env.PROVIDER_GOOGLE_SECRET,
      callbackURL: `${redirectBase}/auth/oauth/google/callback`,
      proxy: true
    },
    callback
  )
);

app.get("/api/auth/oauth/google/callback", (req, res, next) => {
  passport.authenticate(
    "google",
    getCallbackReqHandler(
      process.env.GOOGLE_AUTH_CLIENT_REDIRRECT,
      req,
      res,
      next
    )
  )(req, res, next);
});

app.get("/api/auth/oauth/google/authenticate", (req, res, next) => {
  authenticateReqHandler(
    "google",
    {
      scope: ["profile", "email"]
    },
    req,
    res,
    next
  );
});

///////
// Facebook
///////

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.PROVIDER_FACEBOOK_ID,
      clientSecret: process.env.PROVIDER_FACEBOOK_SECRET,
      callbackURL: `${redirectBase}/auth/oauth/facebook/callback`,
      profileFields: ["id", "displayName", "photos", "email"]
    },
    callback
  )
);

app.get("/api/auth/oauth/facebook/callback", (req, res, next) => {
  passport.authenticate(
    "facebook",
    getCallbackReqHandler(
      process.env.FACEBOOK_AUTH_CLIENT_REDIRRECT,
      req,
      res,
      next
    )
  )(req, res, next);
});

app.get("/api/auth/oauth/facebook/authenticate", (req, res, next) => {
  authenticateReqHandler(
    "facebook",
    {
      scope: ["email"]
    },
    req,
    res,
    next
  );
});

///////
// Linkedin
///////

passport.use(
  new LinkedInStrategy(
    {
      clientID: process.env.PROVIDER_LINKEDIN_CLIENT_ID,
      clientSecret: process.env.PROVIDER_LINKEDIN_CLIENT_SECRET,
      callbackURL: `${redirectBase}/auth/oauth/linkedin/callback`,
      scope: ["r_emailaddress", "r_liteprofile"]
    },
    callback
  )
);

app.get("/api/auth/oauth/linkedin/authenticate", (req, res, next) => {
  authenticateReqHandler("linkedin", {}, req, res, next);
});

app.get("/api/auth/oauth/linkedin/callback", (req, res, next) => {
  passport.authenticate(
    "linkedin",
    getCallbackReqHandler(
      process.env.LINKEDIN_AUTH_CLIENT_REDIRRECT,
      req,
      res,
      next
    )
  )(req, res, next);
});

module.exports.handler = serverless(app);
