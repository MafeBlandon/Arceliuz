const express = require("express")
const response = require("../../network/response.js")
const controller = require("./controller.js")
const router = express.Router()
const validatorHandler = require("../../network/middleware/validators/validators.js")


router.post("/:id", async (req, res, next) => {
	try {
		const { id } = req.params
		const data = req.body
		const rta = await controller.docAdd(id, data)
		response.success(req, res, rta, 200)
	} catch (error) {
		next(error)
	}
})

router.get("/:id", async (req, res, next) => {
	try {
		const { id } = req.params
		const rta = await controller.docGet(id)
		response.success(req, res, rta, 200)
	} catch (error) {
		next(error)
	}
})

router.patch("/:id", async (req, res, next) => {
	try {
		const { id } = req.params
		const data = req.body
		const rta = await controller.docUpdate(id, data)
		response.success(req, res, rta, 200)
	} catch (error) {
		next(error)
	}
})

module.exports = router