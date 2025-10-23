import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import {db} from "../Libs/db.js";

console.log("res is :", process.env.GOOGLE_CLIENT_ID)

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/v1/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await db.user.findOne({ googleId: profile.id });

        if (!user) {
          // Create new user
          user = await db.user.create({
            googleId: profile.id,
            email: profile.emails[0].value,
            name: profile.displayName,
            avatar: profile.photos[0].value,
          });
        }
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.user.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});
