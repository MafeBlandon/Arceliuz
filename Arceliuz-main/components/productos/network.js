const express = require("express")
const response = require("../../network/response.js")
const controller = require("./controller.js")
const router = express.Router()
const validatorHandler = require("../../network/middleware/validators/validators.js")
const { postProducto, getFilter, pathCodigo } = require("./schema.js")

router.post("/", validatorHandler(postProducto, "body"), async (req, res, next) => {
	try {
		const data = req.body
		const newProducto = await controller.productoPost(data)
		response.success(req, res, newProducto, 201)
	} catch (error) {
		next(error)
	}
})


router.get("/", async (req, res, next) => {
	try {
		const productos = await controller.productosGet()

		response.success(req, res, productos, 200)
	} catch (error) {
		next(error)
	}
})

router.get("/id", async (req, res, next) => {
	try {
		const { id } = req.body
		const producto = await controller.productoGet(id)

		response.success(req, res, producto, 200)
	} catch (error) {
		next(error)
	}
})

router.get("/filter", validatorHandler(getFilter, "query"), async (req, res, next) => {
	try {
		const filter = {
			key: req.query.key,
			options: req.query.options,
			value: req.query.value,
		}

		const productos = await controller.productoFilter(filter)

		response.success(req, res, productos, 200)
	} catch (error) {
		next(error)
	}
})

router.patch("/", validatorHandler(pathCodigo, "body"), async (req, res, next) => {
	try {
		const fullData = {
			...req.body
		}
		const producto = await controller.productoUpdate(fullData)

		response.success(req, res, producto, 200)
	} catch (error) {
		next(error)
	}
})

module.exports = router
