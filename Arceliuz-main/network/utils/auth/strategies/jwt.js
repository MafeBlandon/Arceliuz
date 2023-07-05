const boom = require("@hapi/boom")
const { Strategy, ExtractJwt } = require("passport-jwt")
const { finduserUser } = require("../../../../components/users/controller")
const bcrypt = require("bcrypt")
const { JWTSECRET } = require("../../../../config")

const options = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: JWTSECRET,
}
const jwtStrategy = new Strategy(options,  (payload, done) => {
	try {
		return done(null, payload)
	} catch (error) {
		done(error, false)
	}
})

module.exports = jwtStrategy
