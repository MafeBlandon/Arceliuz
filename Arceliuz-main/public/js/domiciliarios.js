let HOST_API = urlApi()

const token = gestionarToken()
const ROLE = gestionarRole()

uservalid(['admin', 'domiciliario'])
//iniciamos el mapa
let map

//inicimos la peticion para buscar los peidos 
establecerPeticionesYMostrarTargetas()

async function establecerPeticionesYMostrarTargetas() {
	try {
		const pedidosFind = await findAsignados()
		pedidos = await pedidosFind
		console.log("🚀 ~ file: domiciliarios.js:17 ~ establecerPeticionesYMostrarTargetas ~ pedidos:", pedidos)

		await mostarTargetasYMakes(pedidos, ROLE)//el ROLE lo sacamos cuando nos autentificamos

	} catch (error) {
		console.error(error);
	}
}

async function actualisarDatos() {
	//deberiamos de hacer una espera cuando se oprime un borton , mostrar su resultado , luego mostar una carga de actulisacion , 
	// o podriamos optimisar los procesos
	//hacer carga de artulisadocn
	await establecerPeticionesYMostrarTargetas()
}

