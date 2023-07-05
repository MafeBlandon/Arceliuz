const express = require("express")
const response = require("../../network/response.js")
const controller = require("./controller.js")
const router = express.Router()
const validatorHandler = require("../../network/middleware/validators/validators.js")
const { postCliente, getFilter, pathCliente } = require("./schema.js")

router.post("/", validatorHandler(postCliente, "body"), async (req, res, next) => {
	try {
		const fullData = {
			...req.body
		}
		const cliente = await controller.clientePost(fullData)

		response.success(req, res, cliente, 200)
	} catch (error) {
		next(error)

	}
})

router.get("/", async (req, res, next) => {
	try {
		const clientes = await controller.clientesGet()

		response.success(req, res, clientes, 200)
	} catch (error) {
		next(error)
	}
})

router.get("/id", async (req, res, next) => {
	try {
		const { id } = req.body
		const cliente = await controller.clienteGet(id)

		response.success(req, res, cliente, 200)
	} catch (error) {
		next(error)
	}
})

router.get("/ulitimoPedido",
	async (req, res, next) => {
		try {
			const { id } = req.query
			console.log("🚀 ~ file: network.js:47 ~ id:", id)
			const cliente = await controller.ultimoPedidoGet(id)

			response.success(req, res, cliente, 200)
		} catch (error) {
			next(error)
		}
	})

router.post("/filter",
	async (req, res, next) => {
		try {
			const { filter } = req.body
			const rta = await controller.estadosFilter(filter)

			response.success(req, res, rta, 200)
		} catch (error) {
			next(error)
		}
	})

router.patch("/", validatorHandler(pathCliente, "body"), async (req, res, next) => {
	try {
		const fullData = {
			...req.body
		}
		const cliente = await controller.clienteUpdate(fullData)

		response.success(req, res, cliente, 200)
	} catch (error) {
		next(error)
	}
})





module.exports = router
