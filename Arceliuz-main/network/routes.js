const express = require("express")
const pedidos = require('./../components/pedidos/network.js')
const clientes = require('./../components/clientes/network.js')
const estados = require('./../components/estados/network.js')
const domiciliarios = require('./../components/domiciliarios/network.js')
const productos = require('./../components/productos/network.js')
const user = require('./../components/users/network.js')
const login = require('./../components/login/network.js')
const parametrosYconfiguracion = require('./../components/parametrosYconfiguracion/network.js')

const router = (server) => {
	const router = express.Router()
	server.use('/api', router)
	router.use("/pedidos", pedidos)
	router.use("/clientes", clientes)
	router.use("/estados", estados)
	router.use("/domiciliarios", domiciliarios)
	router.use("/productos", productos)
	router.use("/user", user)
	router.use("/login", login)
	router.use("/paramatros", parametrosYconfiguracion)

}

module.exports = router
