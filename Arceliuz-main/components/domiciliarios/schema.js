const Joi = require("joi")

const postDomiciliario = Joi.object({
	name: Joi.string().min(3).required(),
	phone: Joi.string().min(9).required(),
	email: Joi.string().email(),
})

const getFilter = Joi.object({
	key: Joi.string().required(), 
	options: Joi.any().allow('==', '<', '>').required(), //no funciona como quiro, hay que aceptar un string con solo unas cuantas obciones
	value: Joi.any()
})

const pathDomiciliario = Joi.object({
	name: Joi.string().min(3),
	phone: Joi.string().min(9).required(),
	email: Joi.string().email(),
})


module.exports = {
	postDomiciliario,
	getFilter,
	pathDomiciliario,
}
