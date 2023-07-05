const express = require("express")
const response = require("../../network/response.js")
const controller = require("./controller.js")
const router = express.Router()
const validatorHandler = require("../../network/middleware/validators/validators.js")
const { postDomiciliario, getFilter, pathDomiciliario } = require("./schema.js")
const passport = require("passport")
const checkRole = require("../../network/middleware/auth.js")

router.get("/",
	passport.authenticate(['cookie', 'jwt'], { session: false }),
	checkRole(['admin', 'recepcion']),
	async (req, res, next) => {
		try {
			const domiciliarios = await controller.domiciliariosGet()
			const rta = domiciliarios.map(e => e.data)
			response.success(req, res, rta, 200)
		} catch (error) {
			next(error)
		}
	})

///no esta funcional
router.get("/id",
	passport.authenticate(['cookie', 'jwt'], { session: false }),
	checkRole(['admin', 'recepcion']),
	async (req, res, next) => {
		try {
			const { idDomiciliario } = req.query
			const domiciliario = await controller.domiciliarioGetId(idDomiciliario)

			response.success(req, res, domiciliario, 200)
		} catch (error) {
			next(error)
		}
	})

router.get("/home",
	passport.authenticate(['cookie', 'jwt'], { session: false }),
	checkRole(['domiciliario']), async (req, res, next) => {
		try {
			const id = req.user.sub
			const domiciliario = await controller.domiciliarioGetId(id)

			response.success(req, res, domiciliario, 200)
		} catch (error) {
			next(error)
		}
	})


router.get("/pedidosAsignados",
	passport.authenticate(['cookie', 'jwt'], { session: false }),
	checkRole(['admin', 'recepcion', 'domiciliario', 'domiciliario']),
	async (req, res, next) => {
		try {
			const id = req.user.sub
			console.log("🚀 ~ file: network.js:58 ~ id:", id)
			const pedidosAsignados = await controller.pedidosAsignados(id)

			response.success(req, res, pedidosAsignados, 200)
		} catch (error) {
			next(error)
		}
	})

router.get("/filter/:filter",
	validatorHandler(getFilter, "body"),
	async (req, res, next) => {
		try {
			const filter = {
				...req.body
			}

			const domiciliarios = await controller.domiciliariosFilter(filter)

			response.success(req, res, domiciliarios, 200)
		} catch (error) {
			next(error)
		}
	})

router.post("/asignacion",
	async (req, res, next) => {
		try {
			const fullData = {
				idPedido: req.query.idPedido,
				idDomiciliario: req.query.idDomiciliario
			}
			console.log("🚀 ~ file: network.js:101 ~ router.post ~ fullData:", fullData)
			const asignacion = await controller.asignacion(fullData.idPedido, fullData.idDomiciliario)

			response.success(req, res, asignacion, 200)
		} catch (error) {
			next(error)
		}
	})

router.post("/reasignacion",
	async (req, res, next) => {
		try {
			const fullData = {
				idPedido: req.query.idPedido,
				idDomiciliario: req.query.idDomiciliario
			}
			console.log("🚀 ~ file: network.js:101 ~ router.post ~ fullData:", fullData)
			const asignacion = await controller.reasignacion(fullData.idPedido, fullData.idDomiciliario)

			response.success(req, res, asignacion, 200)
		} catch (error) {
			next(error)
		}
	})

router.delete("/asignacion",
	async (req, res, next) => {
		try {
			const idPedido = req.body.id_pedido

			const asignacion = await controller.eliminarAignacion(idPedido)

			response.success(req, res, asignacion, 200)
		} catch (error) {
			next(error)
		}
	})

router.get("/history",
	async (req, res, next) => {
		try {
			const { idDomiciliario } = req.query

			const asignacion = await controller.historyPedidos(idDomiciliario)

			response.success(req, res, asignacion, 200)
		} catch (error) {
			next(error)
		}
	})


router.get("/pagarDomicilios",
	async (req, res, next) => {
		try {
			const { idDomiciliario } = req.query
			console.log("🚀 ~ file: network.js:125 ~ router.get ~ idDomiciliario:", idDomiciliario)

			const asignacion = await controller.pagarDomicilios(idDomiciliario)

			response.success(req, res, asignacion, 200)
		} catch (error) {
			next(error)
		}
	})

module.exports = router
