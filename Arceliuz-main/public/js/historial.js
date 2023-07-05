let domiciliarios
let pedidos

inicio()

async function inicio() {

	//hacemos la consulta de todo los pedidos de hoy
	pedidos = await findPedidosHoy()
	//hacemo un for para crear todos las filas  de los pedidos
	domiciliarios = await findDomiciliarios()
	renderiarListaPedidos(pedidos, domiciliarios)

}

function renderiarListaPedidos(pedidos, domiciliarios) {
	let tbodyPedidos = document.getElementById('tbodyPedidos')
	let tbody = ``

	tbody = crearFila(pedidos, domiciliarios, tbody)
	tbodyPedidos.innerHTML = tbody

	crearDatosDeHistorial(pedidos)
}

async function buscarPorFiltro() {
	let dateInicio = document.getElementById('dateInicio')
	//let dateCierre = document.getElementById('dateCierre')

	const fechaInicioCon = convertirFecha(dateInicio.value)

	const primerFiltro = {
		"key": "date",
		"type": "Date",
		"value": fechaInicioCon,
		"options": ">="
	}
	const filtro = {
		filter: [
			primerFiltro
		]
	}

	pedidos = await findFilter(filtro)
	console.log("🚀 ~ file: historial.js:45 ~ buscarPorFiltro ~ pedidos:", pedidos)
	//hacemo un for para crear todos las filas  de los pedidos
	domiciliarios = await findDomiciliarios()
	renderiarListaPedidos(pedidos, domiciliarios)

}

function convertirFecha(fechaInput) {
	// Obtener el valor del input de fecha

	// Crear un objeto de fecha a partir del valor del input
	var fecha = new Date(fechaInput);

	// Obtener la fecha en formato UTC
	var fechaUTC = fecha.toISOString();

	// Mostrar la fecha en formato UTC
	console.log(fechaUTC);
	return fechaUTC
}


function crearDatosDeHistorial(pedidos) {
	let bTotalDeVentas = document.getElementById('bTotalDeVentas')
	let bNumeroDeVentas = document.getElementById('bNumeroDeVentas')
	let bTotalDeTrasferencias = document.getElementById('bTotalDeTrasferencias')
	let bTotalDeEfectivo = document.getElementById('bTotalDeEfectivo')

	let totalDeVentas = 0,
		numeroDeVentas,
		totalDeTrasferencias = 0,
		totalDeEfectivo = 0

	pedidos.forEach(element => {
		console.log(`elelment `, element);
		element = element.data

		//conatamos el valor de las ventas
		//si el pedido esta en eliminanos no se contarar en el total de dle valor de venta
		// deberia de retornar si el estado es elmininadso para aurar tantoa codiogo 
		if (element.estado == 'Eliminados') {
			return
		}

		totalDeVentas += element.priceTotal.priceTotal

		///miramso si es de de efectivo o tranferencia 

		if (element?.pagoConfirmado?.confirmado) {
			if (element.fee == 'Efectivo') {
				totalDeEfectivo += element.priceTotal.priceTotal
			} else if (element.fee == 'Transferencia') {
				totalDeTrasferencias += element.priceTotal.priceTotal
			}
		}


		//si es de tranferecia miramos si estas confiramado le pago y los  separamos

	});

	numeroDeVentas = pedidos.length

	bTotalDeVentas.innerHTML = totalDeVentas
	bNumeroDeVentas.innerHTML = numeroDeVentas
	bTotalDeTrasferencias.innerHTML = totalDeTrasferencias
	bTotalDeEfectivo.innerHTML = totalDeEfectivo

}

function crearFila(pedidos, domiciliarios) {
	console.log("🚀 ~ file: historial.js:72 ~ crearFila ~ domiciliarios:", domiciliarios)
	let tbody = ''
	pedidos.forEach(element => {
		console.log("🚀 ~ file: historial.js:51 ~ crearFila ~ element:", element)
		element = element.data
		const badge = crearBadgeProductos(element.order)
		const idRecortado = element.id.slice(0, 5)

		var domiciliario, domiciliarioAsignado
		if (element?.domiciliario_asignado) {
			domiciliario = element?.domiciliario_asignado?.ref?._path.segments[element?.domiciliario_asignado?.ref?._path?.segments?.length - 1]
			console.log("🚀 ~ file: historial.js:82 ~ crearFila ~ domiciliario:", domiciliario)
			domiciliarioAsignado = domiciliarios.find(el => el.id == domiciliario)
			if (!domiciliarioAsignado) {
				domiciliarioAsignado = {
					"id": "0CKM4kjOBTMccI1UOo6J",
					"password": "$2b$10$NuxA9rQj/8E7lx5hLtxo0u3AQjChSS/yqgK8jz/c518s19oxTAFfK",
					"role": [
						"recepcion",
						"cocinero",
						"domiciliario",
						"admin"
					],
					"phone": "3054489598",
					"name": "domiciliario no encontrado",
					"dataUpdate": [],
					"dateCreate": {
						"_seconds": 1684616306,
						"_nanoseconds": 342000000
					},
					"user": "Pedro Pablo",
					"email": "pmonrtes@gima.com",
					"domiciliario": {
						"historyPedidos": [],
						"active": false,
						"dataUpdate": [],
						"pedidos_asignados": [
							{
								"ref": {
									"_firestore": {
										"projectId": "domiburguer"
									},
									"_path": {
										"segments": [
											"Pedidos",
											"ijcKMnx2s6JqOb4fT9GR"
										]
									},
									"_converter": {}
								},
								"dateCreate": {
									"_seconds": 1685585835,
									"_nanoseconds": 464000000
								}
							}
						],
						"dateCreate": {
							"_seconds": 1684616306,
							"_nanoseconds": 634000000
						}
					}
				}
			}
			console.log("🚀 ~ file: historial.js:83 ~ crearFila ~ domiciliarioAsignado:", domiciliarioAsignado)
		} else {
			domiciliarioAsignado = { name: 'sin asignar' }
		}
		console.log("🚀 ~ file: historial.js:23 ~ inicio ~ domiciliarioAsignado:", domiciliarioAsignado)

		const tonoColorEstado = escogerColorEstado(element.estado)
		const yaPagoBage = element?.pagoConfirmado?.confirmado == true
			? '<div class="badge bg-success">Si</div>' : '<div class="badge bg-danger">No</div>'

		// Crear un objeto de tiempo JavaScript a partir del tiempo Unix
		const horaBonita = extraerHora(element.date)

		tbody += `
			<tr >
				<th scope="row">${element.numeroDeOrdenDelDia}</th>
				<th scope="row">${horaBonita}</th>
				<td><div class="badge ${tonoColorEstado}">${element.estado}</div></td>
				<td>${element.name}</td>
				<td>${badge.div}</td>
				<td>${domiciliarioAsignado?.name || 'sin asignar'}</td>
				<td>${element.priceTotal.COP}</td>
				<td>${element.fee}</td>
				<td>${yaPagoBage}</td>
				<td><a href="${HOST_API}pedidos/id/?id=${element.id}">${idRecortado}</a></td>
			</tr>
		`
	})
	return tbody
}

function extraerHora(date) {
  const tiempoUnix = date;
  const tiempoJavaScript = new Date(tiempoUnix._seconds * 1000 + tiempoUnix._nanoseconds / 1000000);

  // Convertir el tiempo JavaScript a la hora de Colombia
  const horaColombia = tiempoJavaScript; // UTC - 5 horas

  // Obtener las horas y minutos
  const horas = horaColombia.getHours();
  const minutos = horaColombia.getMinutes();

  // Convertir a formato de 12 horas y obtener AM o PM
  const amPm = horas >= 12 ? 'PM' : 'AM';
  const horas12 = horas % 12 || 12; // convertir 0 a 12

  // Obtener el día, mes y año
  const dia = tiempoJavaScript.getDate();
  const mes = tiempoJavaScript.getMonth() + 1; // Los meses en JavaScript son base 0
  const anio = tiempoJavaScript.getFullYear();

  // Formatear la fecha y hora en un string bonito
  const fechaHoraBonita = `${mes.toString().padStart(2, '0')}/${dia.toString().padStart(2, '0')}/${anio} ${horas12}:${minutos.toString().padStart(2, '0')} ${amPm}`;
  
  return fechaHoraBonita;
}



//se puede separar lo usan muchas paginas
function crearBadgeProductos(order) {
	const productos = reumirProductos(order)

	const colorBadge = {
		gris: "bg-secondary",
		verde: "bg-success",
		amarillo: "bg-warning",
		azulClaro: "bg-info",
		rojo: "bg-danger",
		grisClaro: "bg-light",
		grisOscuro: "bg-dark",
		azulOscuro: "bg-primary",

	}

	const listColorProducts = {
		'Combo': "bg-warning",
		'Hamburguesa': "bg-info",
		'Domicilio': "bg-light",
	}

	let div = ''
	for (const key in productos) {
		const element = productos[key];
		div += `<span class="badge ${listColorProducts[element.name] || listColorProducts['Domicilio']} rounded-pill">${element.cantidad} ${element.name}</span>`

	}

	let ul = '<ul class="list-group list-group-flush">'
	order.forEach(element => {
		ul += `<li class="list-group-item">${element.name} </li>`
	});
	ul += `</ul>`

	return { div, ul }

}


function reumirProductos(order) {
	console.log("🚀 ~ file: historial.js:199 ~ reumirProductos ~ order:", order)
	const productos = order.reduce((acc, curr) => {
		if (!acc[curr.id]) {
			acc[curr.id] = {
				...curr,
				cantidad: 1
			};
		} else {
			acc[curr.id].cantidad++;
		}
		return acc;
	}, {});

	// const productoLista = productos.map(elementes => elementes.name)
	return productos
}


async function findDomiciliarios() {
	var HOST_FINDDOMICILIARIOS = `${HOST_API}domiciliarios`
	let url = HOST_FINDDOMICILIARIOS

	const options = {
		method: 'GET',
		headers: {
			Authorization: token
		},
	}
	const res = await fetch(url, options)
	const handle = await handleResponse(res)
	const domiciliarios = await res.json()
	return domiciliarios.body
}

function escogerColorEstado(estado) {
	var color = ''
	const colorBadge = {
		gris: "bg-secondary",
		verde: "bg-success",
		amarillo: "bg-warning",
		azulClaro: "bg-info",
		rojo: "bg-danger",
		grisClaro: "bg-light",
		grisOscuro: "bg-dark",
		azulOscuro: "bg-primary",

	}
	switch (estado) {
		case 'Caliente':
			color = colorBadge.amarillo
			break;
		case 'Facturados':
			color = colorBadge.verde
			break;
		case 'Despachados':
			color = colorBadge.azulClaro
			break;
		case 'Entregados':
			color = colorBadge.grisClaro
			break;
		default:
			break;
	}
	return color
}