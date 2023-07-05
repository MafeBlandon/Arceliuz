const express = require("express")
const response = require("../../network/response.js")
const controller = require("./controller.js")
const router = express.Router()
const validatorHandler = require("../../network/middleware/validators/validators.js")
const passport = require("passport")
const checkRole = require("../../network/middleware/auth.js")
const { getFacturado } = require("./schema.js")

const { COLLECTIONS, ESTADOS } = require('../../network/utils/estadosCollectionsNames.js')

const calientes = 'Calientes'
const preparando = 'Preparando'
const espera = 'Espera'
const despachados = 'Despachados'
const entregados = 'Entregados'
const facturados = 'Facturados'
const clientes = 'Clientes'
const pedidos = 'Pedidos'
const estados = 'Estados'
const eliminados = 'Eliminados'

router.post("/preparar", async (req, res, next) => {
	try {
		const idPedido = req.query.idPedido
		//user que lo asigno 

		const depacho = await controller.trasladarEstado(idPedido, calientes, preparando)

		response.success(req, res, depacho, 200)
	} catch (error) {
		next(error)
	}
})

router.post("/espera", async (req, res, next) => {
	try {
		const idPedido = req.query.idPedido
		//user que lo asigno 

		const depacho = await controller.trasladarEstado(idPedido, preparando, espera)

		response.success(req, res, depacho, 200)
	} catch (error) {
		next(error)
	}
})

router.post("/entregado", async (req, res, next) => {
	try {
		const idPedido = req.query.idPedido
		const depacho = await controller.estadoEntregado(idPedido)
		response.success(req, res, depacho, 200)
	} catch (error) {
		next(error)
	}
})

router.post("/despachar", async (req, res, next) => {
	try {
		const idPedido = req.query.idPedido

		const depacho = await controller.trasladarEstado(idPedido, ESTADOS.Espera, ESTADOS.Despachados)

		response.success(req, res, depacho, 200)
	} catch (error) {
		next(error)
	}
})

router.post("/facturado",
	validatorHandler(getFacturado, "query"),
	//passport.authenticate(['cookie', 'jwt'], { session: false }),
	//checkRole(['admin']),
	async (req, res, next) => {
		try {
			const idPedido = req.query.idPedido
			const idDomiciliario = req.query.idDomiciliario

			const facturado = await controller.estadoFacturado(idPedido, idDomiciliario)

			response.success(req, res, facturado, 200)
		} catch (error) {
			next(error)
		}
	})

router.get("/calientes", async (req, res, next) => {
	try {
		const rta = await controller.estadosGet(calientes)

		response.success(req, res, rta, 200)
	} catch (error) {
		next(error)
	}
})

router.get("/entregados", async (req, res, next) => {
	try {
		const rta = await controller.estadosGet(entregados)

		response.success(req, res, rta, 200)
	} catch (error) {
		next(error)
	}
})

router.get("/", async (req, res, next) => {
	try {
		const { estado } = req.query
		const rta = await controller.estadosGet(estado)
		response.success(req, res, rta, 200)
	} catch (error) {
		next(error)
	}
})

router.get("/role", async (req, res, next) => {
	try {
		const { role } = req.query
		const rta = await controller.findPedidosRole(role)
		response.success(req, res, rta, 200)
	} catch (error) {
		next(error)
	}
})


router.post("/filter", async (req, res, next) => {
	try {
		const { filter } = req.body
		const rta = await controller.estadosFilter(filter)
		response.success(req, res, rta, 200)
	} catch (error) {
		next(error)
	}
})


router.get("/recepcion", async (req, res, next) => {
	try {
		const rta = await controller.findRecepcion()
		response.success(req, res, rta, 200)
	} catch (error) {
		next(error)
	}
})


router.delete("/eliminados", async (req, res, next) => {
	try {
		const idPedido = req.query.idPedido

		const depacho = await controller.elminarPedido(idPedido, eliminados)

		response.success(req, res, depacho, 200)
	} catch (error) {
		next(error)
	}
})

module.exports = router
