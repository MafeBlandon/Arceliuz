const passport = require('passport');

const localStrategy = require("./strategies/local");
const jwtStrategy = require('./strategies/jwt');
const cookie = require('./strategies/cookie');

passport.use(localStrategy);
passport.use(jwtStrategy);
passport.use('cookie', cookie);

