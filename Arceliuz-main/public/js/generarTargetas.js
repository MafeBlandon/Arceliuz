
async function mostarTargetasYMakes(pedidos, role) {
	//geraramos la targetas y la escribimos en el html
	var objDomiciliario = ''
	if (role == 'recepcion' || role == 'admin') {
		objDomiciliario = await crearCosoDeSelectOptions()
	}

	const pedidosContainer = await generarTarjetasDePedido(pedidos, role, objDomiciliario)
	var pedidoContainer = document.getElementById('pedidosRow');
	pedidoContainer.innerHTML = pedidosContainer;
	//dentro de crearTargetaMap se esta llamando otraves generarTarjetasDePedido , lo poddemos optimisar
	if (role == 'cocina' || role == 'cocinero') return
	crearTargetaMap(pedidos, role, objDomiciliario)
}

function crearTargetaMap(pedidos, role, objDomiciliario) {
	let { domiciliarios, optionSelectDomiciliaros } = objDomiciliario

	let currentInfoWindow = null;// es nesesario para desactivar los marker 

	for (var i = 0; i < pedidos.length; i++) {
		var pedido = pedidos[i]
		const marker = new google.maps.Marker({
			position: {
				lat: pedido.address.coordinates.lat,
				lng: pedido.address.coordinates.lng,
			},
			label: `${pedido.numeroDeOrdenDelDia || '#'}`,
			map: map,
			title: pedido.name + ' - ' + pedido.address.address_complete,
			optimized: false,
		})


		var resumenProductos = crearBadgeProductos(pedido.order)

		var options = crearBloqueDePidido(pedido, optionSelectDomiciliaros, role)
		var contentString = cardTarget(pedido, options, resumenProductos, role, objDomiciliario)

		const infoWindow = new google.maps.InfoWindow({
			content: contentString
		})

		marker.addListener('click', function () {
			if (currentInfoWindow) {
				currentInfoWindow.close()
			}
			currentInfoWindow = infoWindow
			infoWindow.open(marker.getMap(), marker)
		})
	}
}

async function crearCosoDeSelectOptions() {
	try {
		const domiciliarios = await findDomiciliario()
		const optionSelectDomiciliaros = crearOptionDomiciliarios(domiciliarios)

		return { domiciliarios, optionSelectDomiciliaros }
	} catch {
		return { domiciliarios: null, optionSelectDomiciliaros: null }
	}

}


// este es el encarado de hacer las targestas de los pedidos
async function generarTarjetasDePedido(pedidos, role, objDomiciliario) {

	let { optionSelectDomiciliaros, domiciliarios } = objDomiciliario

	var pedidoContainer = ''

	for (var i = 0; i < pedidos.length; i++) {
		var pedido = pedidos[i];

		var resumenProductos = crearBadgeProductos(pedido.order)
		//los optios sol las botones, colores, y etc
		//podriamos generar el botonde los domiciliario desdes la funcion crearBloqueDePidido para 
		var options = crearBloqueDePidido(pedido, optionSelectDomiciliaros, role)
		//cre la targeta como tal recogiendo todas las coass
		var contentString = cardTarget(pedido, options, resumenProductos, role, objDomiciliario)

		var tarjeta = `
		<div class=" col-sm-12"  >
			${contentString}
		</div>
		`
		pedidoContainer += tarjeta;
	}

	return pedidoContainer
}

//retorna el { div, ul } de los producto del pedido
function crearBadgeProductos(order) {
	const productos = resumirProductos(order)

	const colorBadge = {
		gris: "bg-secondary",
		verde: "bg-success",
		amarillo: "tarjeta-color",
		azulClaro: "bg-info",
		rojo: "bg-danger",
		grisClaro: "bg-light",
		grisOscuro: "bg-dark",
		azulOscuro: "bg-primary",

	}

	const listColorProducts = {
		'Combo': "tarjeta-color",
		'Hamburguesa': "bg-info",
		'Domicilio': "bg-light",
	}

	let div = ''
	for (const key in productos) {
		let element = productos[key];

		const colorProducto = element?.colorSecondary || '#ffffff'

		div += `<span style="background-color: ${colorProducto}"
			 class="badge rounded-pill"><big style="background-color:'#000'">${element.cantidad}</big> ${element.name}</span>`

	}


	let ul = '<ul class="list-group list-group-flush">'
	order.forEach(element => {
		//creamos la lista de las especifiacciones
		let divEspecificaciones = ''
		for (const key in element.modifique) {
			const elementModifique = element.modifique[key];
			divEspecificaciones += `<span class="badge  rounded-pill" style="background-color: ${elementModifique.colorSecondary}" > ${elementModifique.name}</span>`
		}
		ul += `<li class="list-group-item d-flex justify-content-between"> <div>${element.name}</div> <div>${divEspecificaciones}</div></li>`
	});
	ul += `</ul>`

	return { div, ul }

}

//resume los pedios 
function resumirProductos(order) {
	const productos = {}

	order.forEach((e, i, array) => {
		//miramos si hay una gaseoa
		if (e?.modifique) {
			e.modifique.forEach(ee => {
				if (ee.id == '9' || ee.id == '10') {

					if (productos[ee.id]) {
						productos[ee.id].cantidad += 1
					} else {
						productos[ee.id] = {
							...ee,
							cantidad: 1
						}
					}
				}

			})
		}

		if (productos[e.id]) {
			productos[e.id].cantidad += 1
		} else {
			productos[e.id] = {
				...e,
				cantidad: 1
			}
		}
	});
	return productos
}


//crea la lista de opciones de domiciliario que le pasmos 
function crearOptionDomiciliarios(domiciliarios) {
	var option = ''
	domiciliarios.forEach(element => {
		option += `
			<option value="${element.id}">${element.name}</option>
		`
	});
	return option
}

function crearBloqueDePidido(pedido, optionSelectDomiciliaros, role) {
	let options = {}

	switch (pedido.estado) {
		case 'Calientes':
		case 'Caliente':
			console.log("string role", role)
			options = {
				colorTarget: 'tarjeta-color',
				buttonActionsPrimary: `
				<div class="letra-popis">
					<button class="card-text-notas-preparar w-100" id="botonDeAccionEstado${pedido.id}" onclick="mostrarAccion('${pedido.id}')">Preparar</button>
					<button id="confirmarAccion${'botonDeAccionEstado'}${pedido.id}" class="card-text-notas-c d-none w-100" onclick="preparar('${pedido.id}');cancelarAccion('${pedido.id}')">Confirmar</button>
					<button id="cancelarAccion${'botonDeAccionEstado'}${pedido.id}" class="card-text-notas-f d-none w-100" onclick="cancelarAccion('${pedido.id}')">Cancelar</button>
				</div>
				`,
			}
			if (role == 'domiciliario') {
				options = {
					colorTarget: 'tarjeta-color',
				}
			}
			break;
		case 'Preparando':
			console.log("string role", role)
			options = {
				colorTarget: 'tarjeta-color',
				buttonActionsPrimary: `
						<div class="letra-popis">
							<button class="card-text-notas-preparar w-100" id="botonDeAccionEstado${pedido.id}" onclick="mostrarAccion('${pedido.id}')">Preparacio lista</button>
							<button id="confirmarAccion${'botonDeAccionEstado'}${pedido.id}" class="card-text-notas-f d-none w-100" onclick="espera('${pedido.id}');cancelarAccion('${pedido.id}')">Confirmar</button>
							<button id="cancelarAccion${'botonDeAccionEstado'}${pedido.id}" class="card-text-notas-c d-none w-100" onclick="cancelarAccion('${pedido.id}')">Cancelar</button>
						</div>
						`,
			}
			if (role == 'domiciliario') {
				options = {
					colorTarget: 'tarjeta-color',
				}
			}
			break;
		case 'Espera':
			options = {
				colorTarget: 'tarjeta-color',
				buttonActionsPrimary: `
					<div class="letra-popis ">
						<button class="card-text-notas-preparar w-100" id="botonDeAccionEstado${pedido.id}" onclick="mostrarAccion('${pedido.id}')">Despachar</button>
						<button id="confirmarAccion${'botonDeAccionEstado'}${pedido.id}" class="card-text-notas-f d-none w-100" onclick="despachar('${pedido.id}');cancelarAccion('${pedido.id}')">Confirmar</button>
						<button id="cancelarAccion${'botonDeAccionEstado'}${pedido.id}" class="card-text-notas-c d-none w-100" onclick="cancelarAccion('${pedido.id}')">Cancelar</button>
					</div>
					`,
			}
			break;
		case 'Despachados':
			options = {
				colorTarget: 'tarjeta-color',
				buttonActionsPrimary: `
					<div class="letra-popis">
						<button class="card-text-notas-preparar w-100" id="botonDeAccionEstado${pedido.id}" onclick="mostrarAccion('${pedido.id}')">Entregado</button>
						<button id="confirmarAccion${'botonDeAccionEstado'}${pedido.id}" class="card-text-notas-f d-none w-100" onclick="entregado('${pedido.id}');cancelarAccion('${pedido.id}')">Confirmar</button>
						<button id="cancelarAccion${'botonDeAccionEstado'}${pedido.id}" class="card-text-notas-c d-none w-100" onclick="cancelarAccion('${pedido.id}')">Cancelar</button>
					</div>
					`,
			}
			break;
		case 'Entregados':

			options = {
				colorTarget: 'bg-danger',
			}
			if (role == 'recepcion' || role == 'admin') {
				options = {
					colorTarget: 'bg-danger',
					buttonActionsPrimary: `
						<div class="letra-popis">
							<button class="card-text-notas-preparar w-100" id="botonDeAccionEstado${pedido.id}" onclick="mostrarAccion('${pedido.id}')">Facturado</button>
							<button id="confirmarAccion${'botonDeAccionEstado'}${pedido.id}" class="card-text-notas-f d-none w-100" onclick="facturado('${pedido.id}');cancelarAccion('${pedido.id}')">Confirmar</button>
							<button id="cancelarAccion${'botonDeAccionEstado'}${pedido.id}" class="card-text-notas-c d-none w-100" onclick="cancelarAccion('${pedido.id}')">Cancelar</button>
						</div>
						`,
				}
			}

			//demos de hacer un credor de opciones por roles pero por haora asi
			break;
	}

	///generamos los botones de mas...
	options.masBotones = `
	<div class="d-flex justify-content align-items-center text-center mt-2">
		<button class="card-text-notas-preparar w-100" id="${'botonDeEliminar'}${pedido.id}" onclick="mostrarAccion('${pedido.id}','${'botonDeEliminar'}' )">Eliminar</button>
		<button id="confirmarAccion${'botonDeEliminar'}${pedido.id}" class="card-text-notas-f d-none w-100" onclick="eliminarPedido('${pedido.id}');cancelarAccion('${pedido.id}','${'botonDeEliminar'}')">Confirmar</button>
		<button id="cancelarAccion${'botonDeEliminar'}${pedido.id}" class="card-text-notas-c d-none w-100" onclick="cancelarAccion('${pedido.id}','${'botonDeEliminar'}')">Cancelar</button>
	</div>
	<div class="d-flex justify-content align-items-center text-center mt-2">
		<button class="card-text-notas-preparar w-100" id="${'botonDeCambioDeFee'}${pedido.id}" onclick="nuevoMostrarAccion('${'botonDeCambioDeFee'}${pedido.id}', 'select${pedido.id}' )">Cambiar metodo de pago</button>
		<select id="select${pedido.id}"  class=" d-none w-100" >
		<option value="Transferencia">Transferencia</option>
		<option value="Efectivo">Efectivo</option>
		</select>
		
		<button id="confirmarAccionselect${pedido.id}" class="card-text-notas-f d-none w-100" onclick="cambioDeFee('${pedido.id}','select${pedido.id}')">Confirmar</button>
	
		<button id="cancelarAccionselect${pedido.id}" class="card-text-notas-c d-none w-100" onclick="nuevoCancelarAccion('${'botonDeCambioDeFee'}${pedido.id}', 'select${pedido.id}' )">Cancelar</button>
	</div>
	<div class="d-flex justify-content align-items-center text-center mt-2">
		<a class="btn card-text-notas-c  w-100"  href="${HOST_API}pedidos/id/?id=${pedido.id}" target="_blank">Más informacin </a>	
	</div>
	`

	if (!optionSelectDomiciliaros) return options// si no se manda el obtto de optionSelectDomiciliaros no lo usamos y retornamos 



	return options
}


function cardTarget(pedido, options, resumenProductos, role, objDomiciliario) {
	let div = ''
	if (pedido.estado == 'Facturados') return ''

	switch (role) {
		case 'recepcion':
		case 'admin':
			div = crearTargetaAdmin(pedido, options, resumenProductos, role, objDomiciliario)
			break;
		case 'domiciliario':
			div = crearTargetaDomiciliario(pedido, options, resumenProductos, role)
			break;
		case 'cocinero':
		case 'cocina':
			div = crearTargetaCocinero(pedido, options, resumenProductos, role)
			break;

		default:
			break;
	}

	return div

}

function crearTargetaAdmin(pedido, options, resumenProductos, role, objDomiciliario) {
	const { optionSelectDomiciliaros, domiciliarios } = objDomiciliario
	if (!pedido.domiciliario_asignado?.ref) {

		options.buttonActionsSecundary = `
		<div class="letra-popis">
	
			<button class="card-text-notas-c  w-100" data-toggle="collapse" data-target="#elementoColapsableAsignarDomiciliario${pedido.id}">Asignar Domiciliario</button>
			</div>
		
			<div id="elementoColapsableAsignarDomiciliario${pedido.id}" class="collapse">
				<div class="card">
					<div class="card-body">
						<div class="form-group">
							<label for="selectDomiciliario${pedido.id}"><h5 class="letra-popis-gris">Selecciona un domiciliario</h5></label>
							<select class="form-control " id="selectDomiciliario${pedido.id}">
							${optionSelectDomiciliaros}
							</select>
						</div>
					</div>
					<button class="card-text-notas-c  w-100 " 
					onclick="asignarDomiciliario('${pedido.id}', 'selectDomiciliario${pedido.id}')">Enviar</button>
				</div>
		</div>
	`
	} else {
		options.buttonActionsSecundary = `
		<div class="letra-popis">
	
			<button class="btn btn-success  w-100" data-toggle="collapse" data-target="#elementoColapsableAsignarDomiciliario${pedido.id}">Reasignar Domiciliario</button>
			</div>
		
			<div id="elementoColapsableAsignarDomiciliario${pedido.id}" class="collapse">
				<div class="card">
					<div class="card-body">
						<div class="form-group">
							<label for="selectDomiciliario${pedido.id}"><h5 class="letra-popis">Selecciona un domiciliario</h5></label>
							<select class="form-control" id="selectDomiciliario${pedido.id}">
							${optionSelectDomiciliaros}
							</select>
						</div>
					</div>
					<button class="btn btn-success " 
					onclick="reasignarDomiciliario('${pedido.id}', 'selectDomiciliario${pedido.id}')">Enviar</button>
				</div>
		</div>
	`

		console.log("🚀 ~ file: generarTargetas.js:277 ~ optionSelectDomiciliaros:", optionSelectDomiciliaros)
		console.log("🚀 ~ file: generarTargetas.js:296 ~ crearTargetaAdmin ~ domiciliarios:", domiciliarios)
		console.log("🔋🔋🔋", pedido.domiciliario_asignado.ref)
		let idDomiciliarioPedido = pedido.domiciliario_asignado?.ref?._path?.segments[1]

		// let indexDomicilioari = domiciliarios.findIndex((e) => e.id == idDomiciliarioPedido)
		// console.log("🚀  pedido.domiciliario_asignado 🚀 ", options.domiciliarioAsignado)
		// options.domiciliarioAsignado = domiciliarios[indexDomicilioari].name
		// console.log("🚀 ~ file: generarTargetas.js:350 ~ crearTargetaAdmin ~ options.domiciliarioAsignado:", options.domiciliarioAsignado)
		//en teortia ya no se usara porque el nombre del domiciliario ya viene en el pedido
	}

	if (pedido?.fee == "Transferencia" && !pedido?.pagoConfirmado?.confirmado) {
		options.targetDeConfirmarPago = `
		<button type="button" class="btn btn-primary" data-toggle="collapse"
			data-target="#collapseConfirmarPago${pedido.id}" aria-expanded="false" aria-controls="collapseConfirmarPago${pedido.id}">
				Confirmar pago
		</button>
		<div class="collapse" id="collapseConfirmarPago${pedido.id}">
			<button type="button" class="btn btn-primary"  onclick="confirmarPago('${pedido.id}')">
				confirmar
			</button>
		</div>
		`
	}


	let styleDivOrder = ''
	//modificaomos la patre del la liasta de los productos si son de espcificacioens
	if (pedido.order.find(e => e.modifique)) styleDivOrder = `background-color: violet;`
	resumenProductos.div = `
	<p  class="letra-popis-gris" style="${styleDivOrder}  font-size: 100%;" type="text" data-toggle="collapse" data-target="#pedidoDetalle${pedido.id}" aria-expanded="false" aria-controls="pedidoDetalle${pedido.id}">
	${resumenProductos.div}
	</p>
	<br>`

	const card = `
	<div class="card ${options.colorTarget} rounded">
		<div class="card-body">
		<div class="d-flex justify-content-between align-items-center">
			<h5 class="btn bg-dark letra-popis-phone" >${pedido.numeroDeOrdenDelDia}</h5>
			<h5 class="letra-popis">${pedido.name}</h5>
			<div class="d-flex justify-content-center align-items-center">
				<a href="tel:${pedido.phone}" class="btn bg-success rounded-circle">
				<i class="fas fa-phone"></i>
				</a>
			</div>


		</div>
		
		<div class="card rounded-pill">
  <div class="card-body p-2">
    <p class="card-text">${pedido.address.address_complete}</p>
  </div>
</div>

<div class="card-body">
  <div class="card-text-container">
    <p class="card-text-hora"><i class="fas fa-clock"></i> ${extraerHora(pedido.date)}</p>
		<p class="card-text-hora"> :</p>
    <p class="card-text-hora"><i class="fas fa-clock"></i> ${extraerHoraDomicilio(pedido.date, pedido.duracionEstimada)}</p>
  </div>
</div>

<div class="d-flex justify-content-between align-items-center mt-0">
  <span class="letra-popis-gris mt-2">Productos</span>
  <p class="card-text-hora mt-1">${resumenProductos.div}</p>
</div>

		<p class="card-text-notas letra-popis-gris mt-2">${pedido.note ? pedido.note : 'No hay notass para mostrar'}</p>
		<div class="collapse" id="pedidoDetalle${pedido.id}">
			${resumenProductos.ul}
		</div>
		
		<div class="d-flex justify-content-between align-items-center mt-2">
  
  <div class="letra-popis-gris-dos card rounded-pill card-text card-body p-2">
	
    <span>${pedido.fee} ${pedido.priceTotal.COP}</span>
    
  </div>
</div>
<div class="letra-popis-gris-dos card rounded-pill card-text card-body p-2">
	
<span class="card-text">Estado: ${pedido.estado}</span>

    
  </div>

	<div class="letra-popis-gris-dos card rounded-pill card-text card-body p-2">
	
	<span class="">Domiciliario: ${pedido?.domiciliario_asignado?.name ? pedido.domiciliario_asignado.name : 'Sin asignar'}</span>
  
	
</div>

	






		<button type="button" class="letra-popis card rounded-pill card-text card-body p-2" data-toggle="collapse"
			data-target="#collapseMasOpciones${pedido.id}" aria-expanded="false" aria-controls="collapseMasOpciones${pedido.id}">
				Más...
		</button>
			${options.targetDeConfirmarPago || ''}
		<div class="collapse" id="collapseMasOpciones${pedido.id}">
			<div class="card card-body">
			${options.masBotones}
			</div>
		</div>
			${options.buttonActionsPrimary || ''}
			${options.buttonActionsSecundary || ''}
		</div>
	</div>
	`
	//deveriamos de poner algo para mostar quien es el domiciliario 

	return card
}
function crearTargetaCocinero(pedido, options, resumenProductos, rolidObjetoAccione) {
	let styleDivOrder = '';
	// Modificamos la parte de la lista de los productos si son de especificaciones
	if (pedido.order.find(e => e.modifique)) styleDivOrder = `background-color: violet;`;
	resumenProductos.div = `
    <p class="rounded-pill" style="${styleDivOrder} width:100%;font-size: 150%;" type="text" data-toggle="collapse" data-target="#pedidoDetalle${pedido.id}" aria-expanded="false" aria-controls="pedidoDetalle${pedido.id}">
      ${resumenProductos.div}
    </p>`;

	const card = `
		
    <div class="col-md-12 ">
		 
      <div class="card ${options.colorTarget} rounded contenedor ">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-center">
            <h5 class="btn bg-dark letra-popis-phone">${pedido.numeroDeOrdenDelDia}</h5>
            <h5 class="letra-popis">${pedido.name}</h5>
            <div class="d-flex justify-content-center align-items-center">
              <a href="tel:${pedido.phone}" class="btn bg-success rounded-circle">
                <i class="fas fa-phone"></i>
              </a>
            </div>
          </div>
          <div class="card rounded-pill">
            <div class="card-body p-2">
              <p class="card-text">${pedido.address.address_complete}</p>
            </div>
          </div>
          <div class="card-body">
            <div class="card-text-container">
              <p class="card-text-hora"><i class="fas fa-clock"></i> ${extraerHora(pedido.date)}</p>
              <p class="card-text-hora">:</p>
              <p class="card-text-hora"><i class="fas fa-clock"></i> ${extraerHoraDomicilio(pedido.date, pedido.duracionEstimada)}</p>
            </div>
          </div>
          <div class="d-flex justify-content-between align-items-center mt-2">
            <span class="letra-popis-gris ">Productos ${resumenProductos.div}</span>
            <p class="card-text-pro "></p>
          </div>
          <p class="card-text-notas letra-popis-gris mt-2">${pedido.note ? pedido.note : 'No hay notas para mostrar'}</p>
          <div class="collapse" id="pedidoDetalle${pedido.id}">
            ${resumenProductos.ul}
          </div>
          <div class="letra-popis-gris-dos card rounded-pill card-text card-body p-2">
            <span class="card-text">Estado: ${pedido.estado}</span>
          </div>
          ${options.targetDeConfirmarPago || ''}
          <div class="collapse" id="collapseMasOpciones${pedido.id}">
            <div class="card card-body">
              ${resumenProductos.ul}
            </div>
          </div>
          ${options.buttonActionsPrimary || ''}
        </div>
      </div>
    </div>
		</div>
  `;

	// Deberíamos poner algo para mostrar quién es el domiciliario

	return card
}
function crearTargetaDomiciliario(pedido, options, resumenProductos, role) {
	let styleDivOrder = ''
	//modificaomos la patre del la liasta de los productos si son de espcificacioens
	if (pedido.order.find(e => e.modifique)) styleDivOrder = `background-color: violet;`
	resumenProductos.div = `
	<p  class="rounded-pill" style="${styleDivOrder}  font-size: 100%;" type="text" data-toggle="collapse" data-target="#pedidoDetalle${pedido.id}" aria-expanded="false" aria-controls="pedidoDetalle${pedido.id}">
	${resumenProductos.div}
	</p>`

	const card = `
	<div class="card ${options.colorTarget} rounded contenedor ">
		<div class="card-body">


		<div class="d-flex justify-content-between align-items-center">
			<h5 class="btn bg-dark letra-popis-phone">${pedido.numeroDeOrdenDelDia}</h5>
			<h5 class="letra-popis">${pedido.name}</h5>
			<div class="d-flex justify-content-center align-items-center">
			<a class="btn btn-outline-secondary mx-2" target="_blank"
			 href="https://www.google.com/maps/dir/?api=1&destination=${pedido.address.coordinates.lat},${pedido.address.coordinates.lng}" >Map</a>
			 <a href="tel:${pedido.phone}" class="btn bg-success rounded-circle">
			 <i class="fas fa-phone"></i>
		   </a>
			</div>

		</div>
		<div class="card rounded-pill">
            <div class="card-body p-2">
              <p class="card-text">${pedido.address.address_complete}</p>
            </div>
          </div>
		  <p class="card-text-notas letra-popis-gris mt-2">${pedido.note ? pedido.note : 'No hay notas para mostrar'}</p>
          <div class="collapse" id="pedidoDetalle${pedido.id}">
            ${resumenProductos.ul}
          </div>
	
	
		  <div class="card-body">
            <div class="card-text-container">
              <p class="card-text-hora"><i class="fas fa-clock"></i> ${extraerHora(pedido.date)}</p>
              <p class="card-text-hora">:</p>
              <p class="card-text-hora"><i class="fas fa-clock"></i> ${extraerHoraDomicilio(pedido.date, pedido.duracionEstimada)}</p>
            </div>
          </div>

		 

		<div class=" d-flex justify-content-between align-items-center mt-2">
			<span class="letra-popis-gris">Productos:</span>
			${resumenProductos.div}	
			<span card-text-pro>${pedido.order.length}</span>
		</div>

		<div class="collapse" id="pedidoDetalle${pedido.id}">
			${resumenProductos.ul}
		</div>

		<div class="d-flex justify-content-between align-items-center mt-2">
  
		<div class="letra-popis-gris-dos card rounded-pill card-text card-body p-2">
		  
		  <span>${pedido.fee} ${pedido.priceTotal.COP}</span>
		  
		</div>
	  </div>

	  <div class="letra-popis-gris-dos card rounded-pill card-text card-body p-2">
            <span class="card-text">Estado: ${pedido.estado}</span>
          </div>

		
		  <button type="button" class="letra-popis card rounded-pill card-text card-body p-2" data-toggle="collapse"
		  data-target="#collapseMasOpciones${pedido.id}" aria-expanded="false" aria-controls="collapseMasOpciones${pedido.id}">
			  Más...
	  </button>
			${options.targetDeConfirmarPago || ''}
		<div class="collapse" id="collapseMasOpciones${pedido.id}">
			<div class="card card-body">
			${resumenProductos.ul}
			</div>
		</div>
			${options.buttonActionsPrimary || ''}
		</div>
	</div>
	`
	//deveriamos de poner algo para mostar quien es el domiciliario 

	return card
}


/*
function crearTargetaCocinero(pedido, options, resumenProductos, rolidObjetoAccione) {
	let styleDivOrder = '';
	// Modificamos la parte de la lista de los productos si son de especificaciones
	if (pedido.order.find(e => e.modifique)) styleDivOrder = `background-color: violet; `;
	resumenProductos.div = `
		< p class="rounded-pill" style = "${styleDivOrder}  font-size: 100%;" type = "text" data - toggle="collapse" data - target="#pedidoDetalle${pedido.id}" aria - expanded="false" aria - controls="pedidoDetalle${pedido.id}" >
			${ resumenProductos.div }
		</ > `;

	const card = `
		< div class="col-md-12" >
			<div class="card ${options.colorTarget} rounded">
				<div class="card-body">
					<div class="d-flex justify-content-between align-items-center">
						<h5 class="btn bg-dark letra-popis-phone">${pedido.numeroDeOrdenDelDia}</h5>
						<h5 class="letra-popis">${pedido.name}</h5>
						<div class="d-flex justify-content-center align-items-center">
							<a href="tel:${pedido.phone}" class="btn bg-success rounded-circle">
								<i class="fas fa-phone"></i>
							</a>
						</div>
					</div>
					<div class="card rounded-pill">
						<div class="card-body p-2">
							<p class="card-text">${pedido.address.address_complete}</p>
						</div>
					</div>
					<div class="card-body">
						<div class="card-text-container">
							<p class="card-text-hora"><i class="fas fa-clock"></i> ${extraerHora(pedido.date)}</p>
							<p class="card-text-hora">:</p>
							<p class="card-text-hora"><i class="fas fa-clock"></i> ${extraerHoraDomicilio(pedido.date, pedido.duracionEstimada)}</p>
						</div>
					</div>
					<div class="d-flex justify-content-between align-items-center mt-0">
						<span class="letra-popis-gris mt-2">Productos</span>
						<p class="card-text-hora">${resumenProductos.div}</p>
					</div>
					<p class="card-text-notas letra-popis-gris mt-2">${pedido.note ? pedido.note : 'No hay notas para mostrar'}</p>
					<div class="collapse" id="pedidoDetalle${pedido.id}">
						${resumenProductos.ul}
					</div>
					<div class="letra-popis-gris-dos card rounded-pill card-text card-body p-2">
						<span class="card-text">Estado: ${pedido.estado}</span>
					</div>
					${options.targetDeConfirmarPago || ''}
					<div class="collapse" id="collapseMasOpciones${pedido.id}">
						<div class="card card-body">
							${resumenProductos.ul}
						</div>
					</div>
					${options.buttonActionsPrimary || ''}
				</div>
			</div>
		</ >
		`;

	// Deberíamos poner algo para mostrar quién es el domic

	return card;
}*/



//retorna la hora que estan en formato tipo {"_seconds": 1683204126,"_nanoseconds": 380000000} y la pasa a legible
function extraerHora(date) {
	console.log("🚀 ~ file: generarTargetas.js:577 ~ extraerHora ~ date:", date)
	const tiempoUnix = date
	const tiempoJavaScript = new Date(tiempoUnix._seconds * 1000 + tiempoUnix._nanoseconds / 1000000)
	// Convertir el tiempo JavaScript a la hora de Colombia
	//const horaColombia = new Date(tiempoJavaScript.getTime() - (5 * 3600000)) // UTC - 5 horas
	const horaColombia = tiempoJavaScript // UTC - 5 horas
	console.log("🚀 ~ file: generarTargetas.js:582 ~ extraerHora ~ horaColombia:", horaColombia)


	// Obtener las horas y minutos
	const horas = horaColombia.getHours()
	const minutos = horaColombia.getMinutes()

	// Convertir a formato de 12 horas y obtener AM o PM
	const amPm = horas >= 12 ? 'PM' : 'AM'
	const horas12 = horas % 12 || 12 // convertir 0 a 12


	// Formatear la hora en un string bonito
	const horaBonita = `${horas12}:${minutos.toString().padStart(2, '0')} ${amPm} `
	return horaBonita
}

//retoran la hoara pronosticada
function extraerHoraDomicilio(date, tiempoEstimado) {

	const tiempoUnix = date
	const tiempoJavaScript = new Date(tiempoUnix._seconds * 1000 + tiempoUnix._nanoseconds / 1000000)
	// Convertir el tiempo JavaScript a la hora de Colombia
	//const horaColombia = new Date(tiempoJavaScript.getTime() - (5 * 3600000)) // UTC - 5 horas
	const horaColombia = tiempoJavaScript// UTC - 5 horas


	// Crear un objeto de duración estimada
	const duracionEstimada = tiempoEstimado

	// Convertir la duración estimada a milisegundos
	const duracionEstimadaMs = duracionEstimada?.value * 60000;

	// Crear un objeto de tiempo JavaScript con la hora actual en Colombia
	const horaActual = horaColombia

	// Crear un nuevo objeto de tiempo JavaScript sumando la hora actual en Colombia y la duración estimada en milisegundos
	const horaEstimada = new Date(horaActual.getTime() + duracionEstimadaMs);

	// Formatear la hora estimada en un formato de 12 horas con AM y PM
	const options = { hour: 'numeric', minute: 'numeric', hour12: true };
	const horaEstimadaFormato12 = horaEstimada.toLocaleString('en-US', options);
	return horaEstimadaFormato12
}


async function asignarDomiciliario(idPedio, select) {
	try {
		//cerramos le colapse
		$(`#elementoColapsableAsignarDomiciliario${idPedio} `).collapse('hide');

		const domiciliarioSelectId = document.getElementById(select).value;//cogemos el valor del select
		const asignar = await mandarAsignacion(domiciliarioSelectId, idPedio)
		//devemos de cambiar la card de del pedidos

		//debemo cerrar el select y hacer una barra de carga
		actualisarDatos()

	} catch (error) {
		throw error
	}
}

async function cambioDeFee(idPedido, select) {
	console.log(idPedido, select);
	const fee = document.getElementById(select).value;//cogemos el valor del select

	const cambio = await cambiarFee(idPedido, fee)
	console.log("🚀 ~ file: generarTargetas.js:660 ~ cambioDeFee ~ cambio:", cambio)
	actualisarDatos()

}

async function reasignarDomiciliario(idPedio, select) {
	try {
		//cerramos le colapse
		$(`#elementoColapsableAsignarDomiciliario${idPedio} `).collapse('hide');

		const domiciliarioSelectId = document.getElementById(select).value;//cogemos el valor del select
		const asignar = await mandarReasignacion(domiciliarioSelectId, idPedio)
		//devemos de cambiar la card de del pedidos

		//debemo cerrar el select y hacer una barra de carga
		actualisarDatos()

	} catch (error) {
		throw error
	}
}

//son las funciones que me muestran los botones 

function mostrarAccion(pedidoId, nameId = 'botonDeAccionEstado') {

	var botonEstado = document.getElementById(nameId + pedidoId);

	var botonconfirmarAccionbotonDeAccionEstado = document.getElementById('confirmarAccion' + nameId + pedidoId);
	var botoncancelarAccion = document.getElementById('cancelarAccion' + nameId + pedidoId);

	botonEstado.classList.add('d-none');
	botonconfirmarAccionbotonDeAccionEstado.classList.remove('d-none');
	botoncancelarAccion.classList.remove('d-none');
}

function nuevoMostrarAccion(idBotonLlamada, idObjetoAccion) {
	var botonLlamada = document.getElementById(idBotonLlamada);
	var objAccion = document.getElementById(idObjetoAccion);
	var botoncancelarAccion = document.getElementById('cancelarAccion' + idObjetoAccion);
	var botonconfirmarAccion = document.getElementById('confirmarAccion' + idObjetoAccion);

	botonLlamada.classList.add('d-none');
	objAccion.classList.remove('d-none');
	botoncancelarAccion.classList.remove('d-none');
	botonconfirmarAccion.classList.remove('d-none');
}

function cancelarAccion(pedidoId, nameId = 'botonDeAccionEstado') {
	var botonEstado = document.getElementById(nameId + pedidoId);
	var botonconfirmarAccionbotonDeAccionEstado = document.getElementById('confirmarAccion' + nameId + pedidoId);
	var botoncancelarAccion = document.getElementById('cancelarAccion' + nameId + pedidoId);

	botonEstado.classList.remove('d-none');
	botonconfirmarAccionbotonDeAccionEstado.classList.add('d-none');
	botoncancelarAccion.classList.add('d-none');
}

function nuevoCancelarAccion(idBotonLlamada, idObjetoAccion) {
	var botonLlamada = document.getElementById(idBotonLlamada);
	var objAccion = document.getElementById(idObjetoAccion);
	var botoncancelarAccion = document.getElementById('cancelarAccion' + idObjetoAccion);
	var botonconfirmarAccion = document.getElementById('confirmarAccion' + idObjetoAccion);

	botonLlamada.classList.remove('d-none');
	objAccion.classList.add('d-none');
	botoncancelarAccion.classList.add('d-none');
	botonconfirmarAccion.classList.add('d-none');
}

