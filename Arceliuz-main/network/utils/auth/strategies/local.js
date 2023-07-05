const boom = require("@hapi/boom")
const { Strategy } = require("passport-local")
const { userUserGet } = require("../../../../components/users/controller")
const bcrypt = require("bcrypt")//libreria para desencriptar la contrasena

const localStrategy = new Strategy({
	usernameField: 'username',
	passwordField: 'password',
	passReqToCallback: true,///passReqToCallback: si se establece en true, el primer argumento que recibe la función de verificación es la solicitud (req) y no solo el username, password y done. Esto es útil si necesitas acceder a datos de la solicitud dentro de la función de verificación.
}, async (req, username, password, done) => {
	try {
		let userFind = await userUserGet(username)
		userFind = userFind[0].data
		if (!userFind) done(boom.unauthorized(), false)

		const ho = userFind.role.find(e => e == req.body.role)
		if (!ho) done(boom.unauthorized(), false)

		const isMath = await bcrypt.compare(password, userFind.password)
		if (!isMath) {
			done(boom.unauthorized(), false)
		}
		//hay que devolvel en el role el role que esta activo 
		userFind.role = req.body.role
		delete userFind.password
		done(null, userFind)
	} catch (error) {
		done(error, false)
	}
})

module.exports = localStrategy
