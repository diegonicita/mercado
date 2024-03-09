var passport = require('passport')
var GoogleStrategy = require('passport-google-oauth20').Strategy

passport.use(
  'mercado',
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.FRONTEND_URL_MERCADO + '/auth-mercado/callback',
      scope: ['email', 'profile'],
      passReqToCallback: true,
    },
    function (response, accessToken, refreshToken, profile, cb) {
      if (response) {
        return cb(null, profile)
      } else {
        return cb(null, profile)
      }
    },
  ),
)
