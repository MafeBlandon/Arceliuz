const express = require("express")
const response = require("../../network/response.js")
const passport = require("passport")
const jwt = require("jsonwebtoken")
const { JWTSECRET } = require("../../config.js")
const router = express.Router()

router.post("/",
	passport.authenticate("local", { session: false }),
	async (req, res, next) => {
		try {
			const user = req.user
			const payload = {
				sub: user.id,
				role: user.role
			}

			const token = jwt.sign(payload, JWTSECRET)
			res.set('Authorization', `Bearer ${token}`);

			response.success(req, res, {user: req.user, token}, 200)
		} catch (error) {
			next(error)
		}
	})

module.exports = router
