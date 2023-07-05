const boom = require("@hapi/boom")
/**
 * validatorHandler es un middleware en Express.js que se utiliza para validar 
 * los datos de una propiedad específica en la solicitud utilizando un esquema de validación.
 *  Esta función acepta dos argumentos: schema y property.
 */

function validatorHandler(schema, property) {
	return (req, res, next) => {
		const data = req[property]
		const { error } = schema.validate(data, { abortEarly: false })
		if (error) {
			next(boom.badRequest(error))
		}
		next()
	}
}

module.exports = validatorHandler
