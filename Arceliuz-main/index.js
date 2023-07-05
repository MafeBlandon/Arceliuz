const express = require('express');
const app = express();
const server = require('http').Server(app);
const path = require('path');//decirle al servidor que identifique en que parte del proyecto está el archivo que se está llamando 
/**
 * //libreria para identificar el logueo
 * ( para cuando ud ponga su usuario y contraseña le de 
 * un toquen para poder usar ese token para identificarse y poder hacer peticiones )
 */

const bodyParser = require("body-parser")//Extraer la data de las peticiones 
const config = require('./config.js')///variables de configuracion  (el archivo que administra las variables de entorno )
const cors = require("cors")//para evitar errores 
const router = require("./network/routes.js")
const cookieParser = require('cookie-parser');//son los datos de informacion que tiene el navegador


//error middelware coje todos los midelweres de errores que se tienen 
const {
	logErrors,// el error en la terminal 
	errorHandler,//devuelve el error tipo body
	errorBoomHandler,// error personalizado 
} = require("./network/middleware/error.js");

/**
 * el objeto del express = controlador del servidor 
	cuando copiamos el app.use le indicamos que use un paquete 
 */
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser());


// Permitir crox origin en toda la aplicacion
/*Esta función  la usamos para la  solución de 
un problema que arrojó las cors , esta nos permite controlar el acceso de las http.*/

app.use(function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
	res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
	res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
	next();

})
router(app)


app.use(logErrors)
app.use(errorBoomHandler)
app.use(errorHandler)


app.use(express.static("public"))

require('./network/utils/auth/index')
var contadorQr = 0
//para redireccionar a las paginas 

app.get("/", (req, res) => {
	const query = req.query
	if (query.utm_source == 'qr') {
		console.log(`🦓🦓🦓🦓🦓se escaneo el QR contador = ${contadorQr}🦓🦓🦓🦓🦓`)
		contadorQr = contadorQr + 1
	}
	res.sendFile(path.join(__dirname, './public/html/formularioPedidos.html'))

})

app.get("/homeUsuario", (req, res) => {
	res.sendFile(path.join(__dirname, './public/html/homeUsuario.html'))

})

app.get("/home", (req, res) => {
	res.sendFile(path.join(__dirname, './public/html/home.html'))

})

app.get("/site.webmanifest", (req, res) => {
	res.sendFile(path.join(__dirname, './public/otros/site.webmanifest'))

})

app.get("/favicon.ico", (req, res) => {
	res.sendFile(path.join(__dirname, './public/otros/favicon.ico'))

})

app.get("/recepcion", (req, res) => {
	res.sendFile(path.join(__dirname, './public/html/recepcion.html'))

})

app.get("/domiciliarios", (req, res) => {
	res.sendFile(path.join(__dirname, './public/html/domiciliarios.html'))

})

app.get("/cocina", (req, res) => {
	res.sendFile(path.join(__dirname, './public/html/cocina.html'))

})

app.get("/login", (req, res) => {
	res.sendFile(path.join(__dirname, './public/html/login.html'))
})

app.get("/pedido/:id", (req, res) => {
	res.sendFile(path.join(__dirname, './public/html/pedido.html'))
})

app.get("/404", (req, res) => {
	res.sendFile(path.join(__dirname, './public/html/login.html'))
})

app.get("/401", (req, res) => {
	res.sendFile(path.join(__dirname, './public/html/unauthorized.html'))
})

app.use(function (req, res, next) {
	res.status(404);
	res.sendFile(path.join(__dirname, './public/html/404.html'))
});

//iniciamos el servidor
server.listen(config.PORT, () => {
	console.log(`Example app listening on http://localhost:${config.PORT}`)
})
