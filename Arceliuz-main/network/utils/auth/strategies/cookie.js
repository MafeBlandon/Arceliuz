const boom = require("@hapi/boom")
const { Strategy, ExtractJwt } = require("passport-jwt")
const { finduserUser } = require("../../../../components/users/controller")
const bcrypt = require("bcrypt")
const { JWTSECRET } = require("../../../../config")

//las coockies son paquetes de informcacion que se guarda en el naveador en este caso el TOKEN


// Configurar la extracción del token de la cookie
const cookieExtractor = (req) => {
	let token = null;
	if (req && req.cookies) {
		token = req.cookies.token;
	}
	return token;
};

// Configurar la estrategia JWT
const jwtOptions = {
	jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
	secretOrKey: JWTSECRET
};

const cookiesStrategy = new Strategy(jwtOptions, async (payload, done) => {
	try {

		return done(null, payload)
	} catch (error) {
		done(error, false)
	}
})

module.exports = cookiesStrategy
