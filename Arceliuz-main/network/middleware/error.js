//const response = require("../../network/response")

function logErrors(err, req, res, next) {
	console.error(err)
	next(err)
}

function errorBoomHandler(err, req, res, next) {
	if (err.isBoom) {
		const { output } = err
		res.status(output.statusCode).json(output.payload)
		return
		//response.error(req, res, output.payload, output.statusCode, err)
	}
	next(err)
}

function errorHandler(err, req, res, next) {
	res.status(500).json({
		body: null,
		message: err.message || err,
		stack: err.stack,
	})
}

module.exports = {
	logErrors,
	errorHandler,
	errorBoomHandler,
}
