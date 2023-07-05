const Joi = require("joi")

const getFacturado = Joi.object({
	idPedido: Joi.string().required(),
	idDomiciliario: Joi.string().required(),
})


module.exports = {
	getFacturado,
}
