let HOST_API = urlApi()
//gesitiomas la url del llamado a la api y el token 
const token = gestionarToken()
// const ROLE = gestionarRole()

//inicimos la variable del map para despues
let mapDiv = document.getElementById("map")
const objInput = {
	name: 'name',
	adress: 'address',
}

let direccion

var objDireccion = {
	direccion: null,
	verified: false
	//{
	//     "direccion": "Ac. 100, Bogotá, Colombia",
	//     "direccionIput": "Avenida Calle 100, Bogotá, Colombia",
	//     "coordinates": {
	//         "lat": 4.687812099999999,
	//         "lng": -74.0584368
	//     },
	//     "verified": true,
	//     "type": "placesAutocomplete"
	// }
}

let pruductosLista = []
let diereccionLista = []
let adiciones//agregamos las adiciones de resulviendo una promesa
findAdiciones().then(rta => adiciones = rta)

const buttonEnviarPedido = document.getElementById(`submitButton`)
buttonEnviarPedido.addEventListener(`click`, accionButtonEnviarPedido)
buttonEnviarPedido.addEventListener(`keydow`, accionButtonEnviarPedido)

function mapaCargado() {
	console.log("mapaCargado:", `mapa cargado`)

	intercarlarMapa()//escondemos los mapas al iniciar

	const autocompleteInput = document.getElementById(objInput.adress)

	const datosAutocomplete = (place, error = false) => {
		//var map = document.getElementById(elementId)
		if (error) {
			objDireccion = {
				direccion: autocompleteInput.value,
				verified: false
			}
			return console.log(error)
		}
		//apagamos el otro mapa
		intercarlarMapa(true)
		//organicamos el centro
		center = {
			lat: place.geometry.location.lat(),
			lng: place.geometry.location.lng()
		}
		//guardamos la direccion del automcompletado
		direccion = place.formatted_address
		//guardamos todo el objeto de la direccion con corrdenadas
		objDireccion = {
			direccion: place.formatted_address,
			direccionIput: autocompleteInput.value,
			coordinates: center,
			verified: true,
			type: 'placesAutocomplete'
		}
		// marker
		cacularDistanciYPrecio(objDireccion)

		mostrarEnMapa(center, mapDiv)
	}

	//creamos la funcionalidad del input atocompletes
	const autocomplete = initAutocomplete(autocompleteInput)
	//cada ves que pasa el evento de seleccion dierrecon 'place_changed' se ejecutara esto 
	autocomplete.addListener('place_changed', () => {
		onPlaceChanged(autocomplete, datosAutocomplete)
	})

	autocompleteInput.addEventListener('change', () => {
		//escondemos el mapa de autocompletado y aperesemeo el de move
		intercarlarMapa(false)
		cambiarMapaAGuiado(autocompleteInput)
	})

}

function interuptorMapa(elementId, estado = true) {
	var elemento = document.getElementById(elementId)

	if (estado) {
		elemento.style.removeProperty("display");
		elemento.style.display = "block";
		elemento.style = 'height: 200px;'//le  ponemos una altura para que siempre se rederise

	} else {
		elemento.style.removeProperty("display");
		elemento.style.display = "none";
	}
}

function interuptorBoton(estado) {
	var elemento = document.getElementById(`buttonMapSet`)

	if (estado) {
		elemento.style.removeProperty("display");
		elemento.style.display = "block";

	} else {
		elemento.style.removeProperty("display");
		elemento.style.display = "none";
	}
}

function intercarlarMapa(estado) {
	if (estado == true) {
		interuptorMapa('map')
		interuptorMapa('map2', false)
		interuptorBoton(false)
	} else if (estado == false) {
		interuptorMapa('map', false)
		interuptorMapa('map2')
		interuptorBoton(true)

	} else if (estado == undefined) {
		interuptorMapa('map', false)
		interuptorMapa('map2', false)
		interuptorBoton(false)

	}
}

async function cambiarMapaAGuiado(input) {//cambiamos del automcomplete por el mapa guiado
	var button = document.getElementById(`buttonMapSet`)
	let mapDiv = document.getElementById("map2")

	initMapMove(mapDiv, button, async (corrdenadas, cambio = null) => {
		if (cambio) {
			interuptorBoton(true)
			direccion = null
			//guardamos todo el objeto de la direccion con corrdenadas
			objDireccion = {
				direccion: null,
				direccionIput: input.value,
				coordinates: null,
				verified: false,
				type: 'Manualmente'
			}
			return
		}
		//escondemos el boton
		interuptorBoton(false)
		//llamamos al coso coordenadas a dierccion
		const dierccionTranformada = await deCoodenadasAdireccion(corrdenadas)
		direccion = dierccionTranformada
		//guardamos todo el objeto de la direccion con corrdenadas
		objDireccion = {
			direccion: dierccionTranformada,
			direccionIput: input.value,
			coordinates: corrdenadas,
			verified: false,
			type: 'Manualmente'
		}
		cacularDistanciYPrecio(objDireccion)
		console.log(corrdenadas)
	})
	console.log(`terminai`);

}

async function cacularDistanciYPrecio(objDireccion) {
	console.log("🚀🚀🚀🚀🚀🚀", objDireccion)

	const dataDomicilio = await calcularDomicilio(objDireccion.coordinates)

	let prece = Math.round((dataDomicilio.distance.value) / 1000) * 1000

	if (prece < 3000) {
		prece = 3000
	} else if (prece < 5500) {
		prece = 5000
	}

	console.log("🚀 ~ file: forAdmin.js:176 ~ cacularDistanciYPrecio ~ dataDomi:", diereccionLista)
	console.log("🚀 ~ file: forAdmin.js:194 ~ cacularDistanciYPrecio ~ objDireccion:", dataDomicilio)

	const durationParse = parseInt(dataDomicilio.duration.value / 60 + 15) + ' minutos aprox'

	diereccionLista = [
		{ type: `Domicilio`, price: prece, duration: durationParse }
	]

	activarRenderisado()

}
async function buscarCliente() {
	const inputPhone = document.getElementById('phoneNumber')
	const filtro = {
		"filter": [
			{
				"key": "phone",
				"type": "phone",
				"value": `+57${inputPhone.value}`,
				"options": "=="
			}
		]
	}

	const rta = await findFilterClients(filtro)
	console.log("🚀 ~ file: forAdmin.js:15 ~ buscarCliente ~ rta:", rta)
	const dataCliente = rta[0].data

	renderisarCliente(dataCliente)
	autoCompletarFormulario(dataCliente)

}

async function renderisarCliente(data) {
	const divRta = document.getElementById('divSeguandaMitad')

	const div = `
		<div class="card-body border m-4">
			<h2>Datos del Cliente</h2>
			<div class="row">
				<div class="col-md-6">
					<p><strong>ID:</strong>${data.id}</p>
					<p><strong>Dirección:</strong>${data.address.address_complete}</p>
					<p><strong>Teléfono:</strong>${data.phone}</p>
				</div>
				<div class="col-md-6">
					<p><strong>Nombre:</strong>${data.name}</p>
					<p><strong>Fecha de Creación:</strong>${extraerHora(data.dateCreate)}</p>
					<p><strong>Direccion verified:</strong>${data.address.verified}</p>
				</div>
			</div>
		</div>

		<div class="card-body border m-4">
			<div id="mapCliente" style="display: none"></div>
		</div>

		<div class="card-body border m-4">
			<h2>Ultimo pedido</h2>
			<div id="ulitimoPedido" ></div>
		</div>

		<div class="card-body border m-4">
			<h2>Historial</h2>
			<div id="historial" ></div>
		</div>


	`
	//anadimos las etiquetas en al dom
	divRta.innerHTML = div

	//mostramos en el findUlimoPedidomapa su hogar
	let mapDiv = document.getElementById("map")
	let mapCliente = document.getElementById("mapCliente")
	mostrarEnMapa(data.address.coordinates, mapDiv)
	mostrarEnMapa(data.address.coordinates, mapCliente)
	intercarlarMapa(true)


	//hacemos una consulta a sus pedidos y el historial
	let ulitimoPedido = await findUlimoPedido(data.id)
	ulitimoPedido = ulitimoPedido.data
	console.log("🚀 ~ file: forAdmin.js:130 ~ renderisarCliente ~ ulitimoPedido:", ulitimoPedido)

	const divUltimoPedido = `
	<div class="card">
	  <div class="card-body">
	    <h5 class="card-title">Detalles del Pedido</h5>
	    <p class="card-text">Fecha y Hora:${extraerHora(ulitimoPedido.date)}</p>
	    <p class="card-text">Dirección:${ulitimoPedido.address.address_complete}</p>
	    <p class="card-text">Pedido: ${ulitimoPedido.order}</p>
	    <p class="card-text">Origen: ${ulitimoPedido?.origen}</p>
	    <a href="${HOST_API}pedidos/id/?id=${ulitimoPedido.id}" target="_blank" class="btn btn-primary">Ver más</a>
	  </div>
	</div>

	`
	let ulitimoPedidoDiv = document.getElementById("ulitimoPedido")
	ulitimoPedidoDiv.innerHTML = divUltimoPedido

}


function extraerHora(date) {
	const tiempoUnix = date
	const tiempoJavaScript = new Date(tiempoUnix._seconds * 1000 + tiempoUnix._nanoseconds / 1000000)
	// Convertir el tiempo JavaScript a la hora de Colombia
	//const horaColombia = new Date(tiempoJavaScript.getTime() - (5 * 3600000)) // UTC - 5 horas
	const horaColombia = tiempoJavaScript // UTC - 5 horas


	// Obtener las horas y minutos
	const horas = horaColombia.getHours()
	const minutos = horaColombia.getMinutes()

	// Convertir a formato de 12 horas y obtener AM o PM
	const amPm = horas >= 12 ? 'PM' : 'AM'
	const horas12 = horas % 12 || 12 // convertir 0 a 12


	// Formatear la hora en un string bonito
	const horaBonita = `${horas12}:${minutos.toString().padStart(2, '0')} ${amPm}`
	return horaBonita
}

function autoCompletarFormulario(data) {
	const inputName = document.getElementById(objInput.name)
	const inputAdress = document.getElementById(objInput.adress)

	inputName.value = data.name
	console.log("🚀 ~ file: forAdmin.js:186 ~ autoCompletarFormulario ~ data.adress:", data.address.address_complete)

	inputAdress.value = data.address.address_complete

	objDireccion = data.address
	direccion = data.address.address_complete

	cacularDistanciYPrecio(objDireccion)

}

//funciones para seleccion de pruductos

function agregarPedido(producto, agregar = true) {
	console.log("🚀 ~ file: forAdmin.js:300 ~ producto, agregar:", producto, agregar, [`Hamburguesa`, `Combo`].includes(producto))
	if (![`Hamburguesa`, `Combo`].includes(producto)) return
	//mandamos agergar el produco en la variable de proctolista
	pruductosLista = añidirPedido(producto, agregar, pruductosLista)
	console.log("🚀 ~ file: forAdmin.js:304 ~ pruductosLista:", pruductosLista)
	//analisamos el reusltado para rederiara el fronten 
	const cantidades = mirarCantidadPedido(pruductosLista)
	renderisarCantidad(cantidades)
	//mostramos el resumen
	//creamos la funcion que captara los cambios de la especificaciones
	// const funcionCambio = (idSelect, idDiv, adiciones) => {
	// 	const select = document.getElementById(idSelect)
	// 	console.log("🚀 ~ file: forAdmin.js:315 ~ funcionChange ~ select:", select)
	// 	const div = document.getElementById(idDiv)
	// 	console.log("🚀 ~ file: forAdmin.js:317 ~ funcionChange ~ div:", div)
	// }
	activarRenderisado()
}

function activarRenderisado() {
	renderisarResumenPedido(pruductosLista, diereccionLista, adiciones, funcionChange)
}

//cuando selecionamos una opcion en el select se anade al dicion 
function funcionChange(idSelect, idDiv) {
	const adicionesObj = [...adiciones]
	console.log("🚀 ~ file: forAdmin.js:361 ~ funcionChange ~ adicionesObj:", adicionesObj)
	const select = document.getElementById(idSelect)
	const adicionId = select.value
	//el name de select es el orden del objto 
	const indexPedido = select.name
	//miramo qeu adicion coincide con el index que recibiopo del valor del select
	const adicionIndex = adicionesObj.findIndex(ele => ele.id == adicionId)
	//lo recortamo para seleccionarlo 
	const adicion = adicionesObj.splice(adicionIndex, 1)[0]//no se por que se pone el [0]
	console.log("🚀 ~ file: forAdmin.js:333 ~ funcionChange ~ adicion:", adicion)
	//si no esxite la propiedad de modifieu la creamno 
	if (!pruductosLista[indexPedido].modifique) pruductosLista[indexPedido].modifique = []
	//anaimos la adicion 
	pruductosLista[indexPedido].modifique.push(adicion)
	//renderisaom el resumen con la nueva adicion 
	activarRenderisado()

	// renderisarResumenPedido(pruductosLista, adiciones, funcionChange)
}

function renderisarResumenPedido(array, arrayDomicilio, especificaciones, funcionChange) {
	console.log("🚀 ~ file: forAdmin.js:323 ~ funcionChange:", funcionChange)
	const tbodyId = document.getElementById(`tbodyId`)
	let rta = ``

	//cremos la logica de selcion de especificaciones
	//creamos las opcion del select
	let opcionsDiv
	especificaciones.forEach(element => {
		const rta = `<option value="${element.id}">${element.name}</option>`
		opcionsDiv += rta
	});
	opcionsDiv = `<option selected disabled >Adiciones</option>${opcionsDiv}</select>`


	array.forEach((element, i) => {
		const select = `<select name="${i}" class="form-select-sm" id="select${i}" onchange="funcionChange('select${i}', 'especificaciones${i}')">${opcionsDiv}</select>`

		const producto = element.type
		const modificacion = element?.modifique

		let precio = element.price
		const ordenDelProducto = i
		let adiciones = ``
		if (modificacion) {
			console.log("🚀 ~ file: forAdmin.js:362 ~ array.forEach ~ modificacion:", modificacion)
			modificacion.forEach(element => {
				precio += element.price
			});
			adiciones = organisarModificaciones(modificacion, ordenDelProducto)
		}
		const tr = `
		<tr class="">
			<td class=" "><small>${producto}</small></td>
			<td>
				<h6 class="my-0">${select}<div id="especificaciones${i}">${adiciones}</div></h6>
			</td>
			<td><span class="text-success money">${precio}</span></td>
		</tr>		
		`
		rta += tr
	});

	//renderisamos el domicilio
	arrayDomicilio.forEach(element => {
		const trDomicilio = `
		<tr class="">
			<td class=" "><small>${element.type}</small></td>
			<td>
				<h6 class="my-0">${element.duration}</h6>
			</td>
			<td><span class="text-success money">${element.price}</span></td>
		</tr>	
	`
		rta += trDomicilio
	})


	tbodyId.innerHTML = rta
}

function organisarModificaciones(arrayAdiciones, ordenDelProducto) {
	console.log("🚀 ~ file: forAdmin.js:381 ~ organisarModificaciones ~ arrayAdiciones:", arrayAdiciones)
	let rta = ``
	arrayAdiciones.forEach((element, ordenDeLaAdicion) => {
		const bad =
			`<span id="divSpanBadge${ordenDelProducto}-${ordenDeLaAdicion}" class="badge etiqueta" onclick="removerAdicionProducto('${ordenDelProducto}', '${ordenDeLaAdicion}')" style="background-color: ${element.colorPrimary}"><div>${element.name}</div></span>`
		rta += bad
	});

	return rta
}


function removerAdicionProducto(ordenProducto, ordenAdi) {
	//neseicita del objto pruductosLista
	console.log("🚀 ~ file: formularioPedidos.js:480 ~ removerAdicionProducto ~ idAdi:", ordenAdi)
	console.log("🚀 pre splice", pruductosLista[ordenProducto].modifique)
	//le quitamos al adicino al objeto 
	pruductosLista[ordenProducto].modifique.splice(ordenAdi, 1);
	console.log("🚀 pos splice", pruductosLista[ordenProducto].modifique)
	activarRenderisado()
}


function crearBad(ordenDeLaAdicion, especificacion) {
	console.log("🚀 ~ file: formularioPedidos.js:463 ~ crearBad ~ ordenDeLaAdicion:", ordenDeLaAdicion)
	const hol = ordenDeLaAdicion.split('-')
	const lengthProduco = hol[0]
	const lengthAdicion = hol[1]


	return `<span id="divSpanBadge${ordenDeLaAdicion}" class="badge etiqueta" onclick="removerAdicionProducto('${lengthProduco}', '${lengthAdicion}')" style="background-color: ${especificacion.colorPrimary}"><div>${especificacion.name}</div></span>`
}

function renderisarCantidad(cantidades) {
	console.log("🚀 ~ file: forAdmin.js:312 ~ renderisarCantidad ~ cantidades:", cantidades)
	const spanHamburguesa = document.getElementById(`cantidadHamburguesa`)
	const spanCombo = document.getElementById(`cantidadCombo`)

	spanHamburguesa.innerHTML = cantidades.Hamburguesa || 0
	spanCombo.innerHTML = cantidades.Combo || 0

}

function mirarCantidadPedido(array) {
	console.log("🚀 ~ file: forAdmin.js:322 ~ array:", array)
	if (array == undefined || array.lengh < 1) return []
	const grouped = array.reduce((acc, current) => {
		// Verificar si el elemento ya existe en el objeto "acc"
		if (acc[current.type]) {
			// Si existe, sumar el valor correspondiente
			acc[current.type] += 1
		} else {
			// Si no existe, crear la propiedad y asignar el valor inicial
			acc[current.type] = 1
		}
		return acc;
	}, {});

	return grouped
}

function añidirPedido(producto, agregar = true, productos = []) {//los precios se ponen en su minima exprecion: el peso $
	console.log('[añidirPedido]')
	console.log(productos);

	switch (producto) {
		case 'Hamburguesa':
			if (agregar) {
				productos.push({ type: producto, price: 16000, id: '2' })
			} else {
				const holi = productos.findIndex(e => e.type == 'Hamburguesa')
				if (holi == - 1) return
				productos.splice(holi, 1);
			}
			break;
		case 'Combo':
			if (agregar) {

				productos.push({ type: producto, price: 19500, id: '1' })
			} else {
				const holi = productos.findIndex(e => e.type == 'Combo')
				if (holi == - 1) return
				productos.splice(holi, 1);
			}
			break;
	}
	return productos

	// establerValoresDeFormulario()
	// inyectarPedidoAInput()
	// mostrarCantidad()
	// renderisarResumenPedido()
}

async function findAdiciones() {
	try {
		var HOST_CALIENTES = `${HOST_API}productos/filter?key=type&options===&value=Adicion`
		let url = HOST_CALIENTES

		var requestOptions = {
			method: 'GET',
		};
		const res = await fetch(url, requestOptions)
		const adiciones = await res.json()
		const rta = adiciones.body.map(e => e.data)
		return rta

	} catch (error) {
		console.log(error)
		throw error
	}
}

function accionButtonEnviarPedido() {
	console.log(`accionButtonEnviarPedido`);
	const inputName = document.getElementById(`name`)
	const inputPhone = document.getElementById(`phoneNumber`)
	const inputAddress = document.getElementById(`address`)
	const inputPiso = document.getElementById(`piso`)
	const inputComment = document.getElementById(`comment`)
	const inputFormaPago = document.getElementById(`formaPago`)

	//verificaomo que el formualairo esta completo
	const verified = () => {
		if (inputName.value == undefined || inputName.value == '') return `input mane `
		if (inputPhone.value == undefined || inputPhone.value == '') return `input phone `
		if (inputAddress.value == undefined || inputAddress.value == '') return `input adres `

		if (pruductosLista.length <= 0) return `sin prudiocn rt`
		if (diereccionLista.length <= 0) return `sin direcicon `

		return true
	}
	console.log("🚀 ~ file: forAdmin.js:574 ~ verified ~ !inputName.value:", !inputName.value)

	const v = verified()
	if (v != true) {
		//retoramo una funion de error
		console.log(`no tiene los campos sufinetes`, v)
		alert(`no tiene los campos sufinetes ${v}`)
	}

	const orden = organisarOrden(pruductosLista)
	organisarDireccion(objDireccion)

	const pedido = {
		name: inputName.value,
		phone: inputPhone.value,
		order: orden,
		address: objDireccion,
		fee: inputFormaPago.value,

	}

	if (inputComment.value) pedido.note = inputComment.value


	//organisamos los datos en un objeto
	// {
	// 	"name": "{{$randomFullName}}",
	// 		"phone": "3053410804",
	// 			"order": [
	// 				{
	// 					"id": "1"
	// 				}
	// 			],
	// 				"address": {
	// 		"address_complete": "calle 101 b  # 74 b {{$randomAlphaNumeric}}",
	// 			"verified": false,
	// 				"coordinates": {
	// 			"lat": 6.2999347,
	// 				"lng": -75.5764272
	// 		}
	// 	},

	// 	"fee": "Transferencia",
	// 		"note": "{{$randomWords}}"
	// }

	console.log(pedido);
	enviarPedido(pedido)
}

function organisarOrden(lista) {
	const rta = lista.map(e => {
		const producto = { id: e.id, price: e.price }
		if (e.modifique) {
			producto.modifique = e.modifique.map(e => {
				return { id: e.id }
			})
		}
		return producto
	})
	console.log("🚀 ~ file: forAdmin.js:634 ~ organisarOrden ~ rta:", rta)

	return rta
}

function organisarDireccion(params) {
	// address: Joi.object({
	// 	address_complete: Joi.string().min(3).required(),
	// 	verified: Joi.boolean(),
	// 	coordinates: Joi.object({
	// 		lat: Joi.number().required(),
	// 		lng: Joi.number().required()
	// 	}),
	// 	origin: Joi.string(),
	// }),

	params.address_complete = params.direccion
	delete params.direccion
	return params
}

async function enviarPedido(pedido) {

	var pedidosPostApi = 'https://domiburguer.com/api/pedidos'
	if (this.origin.includes('127.0.0.1') || this.origin.includes('localhost')) pedidosPostApi = `http://localhost:8087/api/pedidos`


	const options = {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(pedido)
	};

	const response = await fetch(pedidosPostApi, options)
	const data = await response.json()
	if (response.status == 200) {
		console.log(`response`, data);

		localStorage.setItem("pedidoDomiburguer", JSON.stringify(data));
		console.log(`todo meleo `);
		// window.location.href = "/html/gracias.html"

	} else {
		alert('hubo un problema')
	}

}