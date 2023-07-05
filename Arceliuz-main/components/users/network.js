const express = require("express")
const response = require("../../network/response.js")
const controller = require("./controller.js")
const router = express.Router()
const validatorHandler = require("../../network/middleware/validators/validators.js")
const { postUser, getFilter, pathuser } = require("./schema.js")
const passport = require("passport")
const checkRole = require("../../network/middleware/auth.js")

router.post("/", validatorHandler(postUser, "body"), async (req, res, next) => {
	try {
		const fullData = {
			...req.body
		}
		const user = await controller.userPost(fullData)

		response.success(req, res, user, 200)
	} catch (error) {
		next(error)

	}
})

router.get("/",
	passport.authenticate(['cookie', 'jwt'], { session: false }),
	checkRole(['admin']),
	async (req, res, next) => {
		try {
			const users = await controller.usersGet()

			response.success(req, res, users, 200)
		} catch (error) {
			next(error)
		}
	})

router.get("/login", async (req, res, next) => {
	try {
		const fullData = {
			...req.body
		}
		const users = await controller.usersLogin(fullData)

		response.success(req, res, users, 200)
	} catch (error) {
		next(error)
	}
})

router.get("/id", async (req, res, next) => {
	try {
		const { id } = req.body
		const user = await controller.userGet(id)

		response.success(req, res, user, 200)
	} catch (error) {
		next(error)
	}
})

router.get("/user", async (req, res, next) => {
	try {
		const { user } = req.body
		const userData = await controller.userUserGet(user)

		response.success(req, res, userData, 200)
	} catch (error) {
		next(error)
	}
})
//hay que hacer un midelware para restrinagir la entrada del filtro por pasword
router.get("/:filter", validatorHandler(getFilter, "body"), async (req, res, next) => {
	try {
		const filter = {
			...req.body
		}

		const users = await controller.userFilter(filter)

		response.success(req, res, users, 200)
	} catch (error) {
		next(error)
	}
})

router.patch("/", validatorHandler(pathuser, "body"), async (req, res, next) => {
	try {
		const fullData = {
			...req.body
		}
		const user = await controller.userUpdate(fullData)

		response.success(req, res, user, 200)
	} catch (error) {
		next(error)
	}
})

module.exports = router
