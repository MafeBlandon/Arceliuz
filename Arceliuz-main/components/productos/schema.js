const Joi = require("joi")

const postProducto = Joi.object({
	type: Joi.string().allow('Producto', 'Adicion').required(),
	name: Joi.string().min(3).required(),
	description: Joi.string().min(9),
	id: Joi.string(),
	price: Joi.number().required(),
	imagen: Joi.string().uri(),
	colorPrimary: Joi.string().regex(/^#([A-Fa-f0-9]{6})$/),
	colorSecondary: Joi.string().regex(/^#([A-Fa-f0-9]{6})$/)
})

const getFilter = Joi.object({
	key: Joi.string().required(),
	options: Joi.any().allow('==', '<', '>').required(), //no funciona como quiro, hay que aceptar un string con solo unas cuantas obciones
	value: Joi.any().required()
})

const pathCodigo = Joi.object({
	name: Joi.string().min(3),
	description: Joi.string().min(9),
	price: Joi.number(),
	imagen: Joi.string(),
	id: Joi.string().required(),
}).unknown(true);

module.exports = {
	postProducto,
	getFilter,
	pathCodigo,
}
