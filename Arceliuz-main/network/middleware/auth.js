const boom = require("@hapi/boom")
/**
 * checkRole es un middleware en Express.js que se utiliza para verificar
 *  si el usuario tiene uno de los roles especificados antes de permitir 
 * el acceso a la siguiente ruta o middleware. Esta función acepta un array de roles como argumento.
 */

function checkRole(roles) {
	return (req, res, next) => {
		const user = req.user
		if (!roles.some(e => user.role.includes(e))) {
			next(boom.unauthorized())
		}
		next()
	}
}

module.exports = checkRole
