var passport = require('passport')
var GoogleStrategy = require('passport-google-oauth20').Strategy

const emails = ['diegonicita@gmail.com']

passport.use("mercado",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.FRONTEND_URL_MERCADO + '/auth-mercado/callback',
      scope: ['email', 'profile'],
      passReqToCallback: true,
    },
    function (accessToken, refreshToken, profile, cb) {

        const response = emails.includes(profile.emails[0].value)

        if (response) {
            return cb(null, profile)
        }
        else {
            emails.push(profile.emails[0].value)
            return cb(null, profile)
        }   

    },
  ),
)