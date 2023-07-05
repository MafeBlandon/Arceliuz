const Joi = require("joi")
const { ROLES } = require('../../network/utils/estadosCollectionsNames.js')
const roles = Object.values(ROLES)

const postUser = Joi.object({
	user: Joi.string().min(3).required(),
	password: Joi.string().min(3).required(),
	role: Joi.array().items(...roles),
	name: Joi.string().min(3).required(),
	phone: Joi.string().min(9).required(),
	email: Joi.string().email(),
})

const getFilter = Joi.object({
	key: Joi.string().required(),
	options: Joi.any().allow('==', '<', '>').required(), //no funciona como quiro, hay que aceptar un string con solo unas cuantas obciones
	value: Joi.any()
})

const pathCliente = Joi.object({
	password: Joi.string().min(3).required(),
})

const login = Joi.object({
	user: Joi.string().min(3).required(),
	password: Joi.string().min(3).required(),
	role: Joi.string().valid('admin', 'cliente', 'domiciliario', 'recepcion', 'plancha'),
})

module.exports = {
	postUser,
	getFilter,
	pathCliente,
	login,
}
