const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy

passport.use(
  'mercado',
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.FRONTEND_URL_MERCADO}/auth-mercado/callback`,
      scope: ['email', 'profile'],
      passReqToCallback: true,
    },
    (response, _accessToken, _refreshToken, profile, cb) => {
      if (response) {
        return cb(null, profile)
      }
      return cb(null, profile)
    },
  ),
)

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((user, done) => {
  done(null, user)
})
