var passport = require('passport')
var GoogleStrategy = require('passport-google-oauth20').Strategy

const emails = ['diegonicita@gmail.com']

passport.use("examenes",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:8126/auth/callback',
      scope: ['email', 'profile'],
      passReqToCallback: true,
    },
    function (request, accessToken, refreshToken, profile, done) {

        const response = emails.includes(profile.emails[0].value)

        if (response) {
            return done(null, profile)
        }
        else {
            emails.push(profile.emails[0].value)
            return done(null, profile)
        }

    //   User.findOrCreate({ googleId: profile.id }, function (err, user) {
    //     return done(err, user)
    //   })

    },
  ),
)