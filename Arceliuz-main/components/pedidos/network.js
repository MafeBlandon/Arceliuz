const express = require("express")
const response = require("../../network/response.js")
const controller = require("./controller.js")
const router = express.Router()
const passport = require("passport")
const multer = require('multer');
const upload = multer();

const checkRole = require("../../network/middleware/auth.js")
const validatorHandler = require("../../network/middleware/validators/validators.js")
const { getFilter, postPedido, idPedidoShema } = require("./schema.js")
const { importsPedidos } = require("../../network/utils/imports/importaciones.js")

router.post("/",
	validatorHandler(postPedido, "body"),
	async (req, res, next) => {
		try {
			console.log(`🎊🎊🎊Nuevo pedido 🎊🎊🎊`, JSON.stringify(req.body, null, 2));
			const fullData = {
				...req.body
			}
			const pedido = await controller.pedidoPost(fullData)

			response.success(req, res, pedido, 200)
		} catch (error) {
			next(error)
		}
	})

router.get("/",
	passport.authenticate(['cookie', 'jwt'], { session: false }),
	checkRole(['admin']),
	async (req, res, next) => {
		try {
			console.log(`🍁 Haciendo llamado de todo los pedidos`, JSON.stringify(req.body, null, 2));
			const pedidos = await controller.pedidosGet()

			response.success(req, res, pedidos, 200)
		} catch (error) {
			next(error)
		}
	})

router.post("/confirmarPago",
	validatorHandler(idPedidoShema, "query"),
	passport.authenticate(['cookie', 'jwt'], { session: false }),
	checkRole(['admin', 'recepcion']),
	async (req, res, next) => {
		try {
			const { id } = req.query
			console.log("🚀 ~ file: network.js:45 ~ id:", id)
			const pagoConfirmado = await controller.confirmarPagoTranferencia(id)
			response.success(req, res, pagoConfirmado, 200)
		} catch (error) {
			next(error)
		}
	})

router.get("/id/",
	validatorHandler(idPedidoShema, "query"),//validamos que la informacion este formateada en la estrucctuar correcta
	passport.authenticate(['cookie', 'jwt'], { session: false }),//podemos usar cualquiera de las estrategias 
	checkRole(['admin', 'recepcion']),//solo permite el paso a los usuarios con estos roles
	async (req, res, next) => {
		try {
			const { id } = req.query
			console.log("🚀 ~ file: network.js:59 ~ id:", id)
			const pedido = await controller.pedidoGet(id)

			response.success(req, res, pedido, 200)
		} catch (error) {
			next(error)
		}
	})

router.get("/filter",
	validatorHandler(getFilter, "query"),
	passport.authenticate(['cookie', 'jwt'], { session: false }),
	async (req, res, next) => {
		try {
			const filter = {
				...req.query
			}
			console.log(`Haciendo un find con un filtro :`, filter)
			const pedidos = await controller.pedidoFilter(filter)

			response.success(req, res, pedidos, 200)
		} catch (error) {
			next(error)
		}
	})

router.get("/historialDia",//podriamo poner un para metro de la fecha que queremmo buscar
	passport.authenticate(['cookie', 'jwt'], { session: false }),
	async (req, res, next) => {
		try {
			// Obtener la hora actual en la zona horaria local
			const horaLocal = new Date();
			// Convertir la hora local a la zona horaria UTC
			const horaUTC = new Date(horaLocal.getTime() - (horaLocal.getTimezoneOffset() * 60000));
			// Obtener la hora actual en Colombia
			const horaColombia = new Date(horaUTC.getTime() - (5 * 3600000)); // UTC - 5 horas
			// Obtener la hora de inicio de búsqueda (3 am en Colombia)
			const horaInicioBusqueda = new Date(horaColombia.getFullYear(), horaColombia.getMonth(), horaColombia.getDate(), 3, 0, 0);
			// Realizar la búsqueda de los pedidos que se realizaron después de la hora de inicio
			// La lógica de búsqueda depende de cómo esté almacenada la información de los pedidos
			// En este ejemplo, se supone que hay un array llamado "pedidos" que contiene objetos con una propiedad "fecha" que contiene la fecha y hora del pedido

			let startDate = horaInicioBusqueda

			const filter = {
				key: "date",
				options: ">=",
				value: startDate
			}
			console.log(`Haciendo un find con todos los  pedidos de hoy con :`, filter)

			const pedidos = await controller.pedidoFilter(filter)

			response.success(req, res, pedidos, 200)
		} catch (error) {
			next(error)
		}
	})


router.post("/import",
	// passport.authenticate(['cookie', 'jwt'], { session: false }),
	// checkRole(['admin']),
	upload.single(),
	async (req, res, next) => {
		try {
			console.log(`importacion de datos masivos`, JSON.stringify(req.body, null, 2));
			const dataFormat = req.body 
			const archivo = req.file;
			const data = archivo.buffer.toString('utf8')
			const fullData = JSON.parse(data) 
			// Accede a la información del archivo según tus necesidades
			console.log(archivo.originalname);
			console.log(archivo.mimetype);
			console.log(archivo.size);

			const importacion = await importsPedidos(fullData)

			response.success(req, res, importacion, 200)
		} catch (error) {
			next(error)
		}
	})


router.patch("/cambiarFee",
	passport.authenticate(['cookie', 'jwt'], { session: false }),
	checkRole(['admin', 'recepcion']),
	async (req, res, next) => {
		try {

			console.log(`CAMBIANDO EL METODO DE PAGO `);
			const { id, fee } = req.query

			const cambio = await controller.cambioDeFee(id, fee)

			response.success(req, res, cambio, 200)
		} catch (error) {
			next(error)
		}
	})


module.exports = router
