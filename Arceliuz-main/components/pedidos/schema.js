const Joi = require("joi")

const postPedido = Joi.object({
	name: Joi.string().min(3).required(),
	phone: Joi.string().min(9).required(),

	order: Joi.array().items({
		id: Joi.string().required(),
		modifique: Joi.array().items({
			id: Joi.string(),
		}),
		price: Joi.number(),
		nota: Joi.string(),
	}).required(),

	address: Joi.object({
		address_complete: Joi.string().min(3).required(),
		verified: Joi.boolean(),
		coordinates: Joi.object({
			lat: Joi.number().required(),
			lng: Joi.number().required()
		}),
		direccionIput: Joi.string(),
		origin: Joi.string(),
		type: Joi.string(),
	}),
	coordenadas: Joi.object({
		lat: Joi.number(),
		lng: Joi.number(),
	}),
	fee: Joi.string().valid('Transferencia', 'Efectivo', 'Nequi', 'Bancolombia').required(),
	pagoConfirmado: Joi.object({
		time: Joi.date().iso(),
		confirmado: Joi.boolean().default(false).required()
	}),
	estado: Joi.string(),
	programmed: Joi.date(),
	note: Joi.string().max(512),
}).unknown(true)

const getFilter = Joi.object({
	key: Joi.string().required(),
	options: Joi.any().allow('==', '<', '>').required(), //no funciona como quiro, hay que aceptar un string con solo unas cuantas obciones
	value: Joi.any().required()
})

const idPedidoShema = Joi.object({
	id: Joi.string().required(),
})

const postImport = Joi.array().items({

})


module.exports = {
	postPedido,
	getFilter,
	idPedidoShema,
}
