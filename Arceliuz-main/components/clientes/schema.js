const Joi = require("joi")

const postCliente = Joi.object({
	name: Joi.string().min(3).required(),
	phone: Joi.string().min(9).required(),
	address: Joi.string().min(3),
	email: Joi.string().email(),
	notes: Joi.string().max(256)
})

const getFilter = Joi.object({
	key: Joi.string().required(), 
	options: Joi.any().allow('==', '<', '>').required(), //no funciona como quiro, hay que aceptar un string con solo unas cuantas obciones
	value: Joi.any()
})

const pathCliente = Joi.object({
	name: Joi.string().min(3),
	phone: Joi.string().min(9).required(),
	address: Joi.string().min(3),
	email: Joi.string().email(),
	notes: Joi.string().max(256)
})


module.exports = {
	postCliente,
	getFilter,
	pathCliente,
}
