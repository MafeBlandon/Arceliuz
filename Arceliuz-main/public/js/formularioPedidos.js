
var HOST_API = `https://domiburguer.com/api/`
if (this.origin.includes('127.0.0.1') || this.origin.includes('localhost')) HOST_API = `http://localhost:8087/api/`


var adiciones

var objetoFormulario = {}

var pedidoObj = {
	productos: [],
	domicilio: {}
}
var popUpActivo = false//lo usaremos para saber si el popup esta activo para no acionar los bad

const spanCombo = document.getElementById('comboCantida')
const spanHamburguesa = document.getElementById('hamburguesaCantida')

const resumenProductos = document.getElementById('resumenProductos')
const resumenDomicilio = document.getElementById('resumenDomicilio')
const resumenTotal = document.getElementById('resumenTotal')

function establerValoresDeFormulario() {
	console.log('[establerValoresDeFormulario]')

	let nombreInput = document.getElementById('nombre')
	let telefonoInput = document.getElementById('telefono')
	let direccionInput = document.getElementById('autocomplete')
	let pedidoInput = document.getElementById('pedido')
	let tipoDePagoInput = document.getElementById('formaPago')
	let comentariosInput = document.getElementById('comentario')

	objetoFormulario.values = {
		nombre: nombreInput.value,
		telefono: telefonoInput.value,
		direccion: objDireccion,
		pedido: pedidoObj,
		pago: tipoDePagoInput.value,
		comentario: comentariosInput.value,
	}

	// console.log(objetoFormulario, 'formulario')

	// divfloatFun()


	return objetoFormulario
}

const form = document.getElementById('form');
console.log(form)
// Agregar un evento para validar el formulario
form.addEventListener('submit', function (event) {
	console.log('hoa');
	// Verificar si el formulario es válido
	if (!form.checkValidity()) {
		// Prevenir el envío del formulario
		event.preventDefault();
		// Crear una alerta flotante
		const alerta = document.createElement('div');
		alerta.classList.add('alert', 'alert-danger', 'my-3');
		alerta.innerHTML = 'Falta información en el formulario.';
		// Insertar la alerta antes del botón de envío
		form.insertBefore(alerta, form.lastElementChild);
		// Desaparecer la alerta después de 5 segundos
		setTimeout(() => alerta.remove(), 5000);
	}
});


function botonEnviar() {
	popUpActivo = true
	console.log(`[botonEnviar]`);
	const form = document.getElementById('form');
	const aletaForm = document.getElementById('aletaForm')
	console.log(!form.checkValidity(), esvalidoMandarPedido());
	establerValoresDeFormulario()
	if (!form.checkValidity() || !esvalidoMandarPedido().valido) {
		console.log('no es validdo mandar la ', form.reportValidity());
		aletaForm.innerHTML = `<div class=" alert alert-warning"  role="alert" style="display: block;" >Falta información en el formulario. ${esvalidoMandarPedido().mensaje || miraNumeroDeTelefono()}</div>`;
		setTimeout(() => aletaForm.innerHTML = '', 5000);
		console.log(aletaForm);
	} else {
		// Aquí puedes hacer lo que quieras si el formulario es válido
		console.log('Formulario válido');
		$('#pedido-modal').modal('show');//esto  lo saque de cgpt
		const resumenPopUp = document.getElementById('resumenPopUp')
		const totalResumido = document.getElementById('totalResumido')
		console.log(objetoFormulario);
		const variablesDeResumen = `
			<div class="">
			<h2>CLIENTE</h2>
				<ul class="list-group  tipografiaMontserrat-Regular" >
					<li class="list-group-item"><strong>Nombre: </strong>${objetoFormulario.values.nombre}</li>
					<li class="list-group-item"><strong>Teléfono: </strong>${objetoFormulario.values.telefono}</li>
					<li class="list-group-item"><strong>Dirección: </strong>${objetoFormulario.values.direccion.direccionIput}</li>
					<li class="list-group-item"><strong>Forma de pago: </strong>${objetoFormulario.values.pago}</li>
					<li class="list-group-item"><strong>Comentario: </strong>${objetoFormulario.values.comentario}</li>
				</ul>
			</div>
			<hr>
			<h2>PRODUCTOS</h2>
		`
		resumenPopUp.innerHTML = variablesDeResumen + totalResumido.innerHTML
	}

}
async function enviarPedido() {

	console.log('[botonEnviar]')
	establerValoresDeFormulario()

	if (!esvalidoMandarPedido().valido) {
		console.log('[botonEnviar] no es valido mandar el pedido')
		return
	}
	inyectarPedidoAInput()

	console.log(pedidoObj.productos)
	const order = []

	for (const key in pedidoObj.productos) {

		const element = pedidoObj.productos[key];
		const pro = {
			id: element.product_id,
		}
		if (element.modifique) pro.modifique = element?.modifique.map(e => { return { id: e.id } }) || null
		order.push(pro)
	}

	const pedidoAEnviar = {
		phone: objetoFormulario.values.telefono,
		name: objetoFormulario.values.nombre,
		address: {
			address_complete: objDireccion.direccion,
			verified: objDireccion.verificado,
			coordinates: {
				lat: objDireccion.coordenadas?.lat || objDireccion.coordenadas.lat(),
				lng: objDireccion.coordenadas?.lng || objDireccion.coordenadas.lng(),
			}
		},
		order: order,
		fee: objetoFormulario.values.pago,
	}
	console.log("🚀 ~ file: formularioPedidos.js:145 ~ pedidoAEnviar:", pedidoAEnviar)
	if (objetoFormulario.values.comentario) pedidoAEnviar.note = objetoFormulario.values.comentario

	console.log(pedidoObj, pedidoAEnviar)
	const options = {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(pedidoAEnviar)
	};

	var pedidosPostApi = 'https://domiburguer.com/api/pedidos'
	if (this.origin.includes('127.0.0.1') || this.origin.includes('localhost')) pedidosPostApi = `http://localhost:8087/api/pedidos`
	const loader = document.getElementById("loader");
	loader.style.display = "block";

	const response = await fetch(pedidosPostApi, options)
	const data = await response.json()
	if (response.status == 200) {
		console.log(`response`, data);

		localStorage.setItem("pedidoDomiburguer", JSON.stringify(data));

		loader.style.display = "none";

		// window.location.href = "/html/gracias.html"

	} else {
		alert('hubo un problema')
	}

	if (data.urlFactura) {
		window.location.href = data.urlFactura;
	} else {
		var hostGracias = 'https://domiburguer.com/html/gracias.html'
		if (this.origin.includes('http://127.0.0.1')) pedidosPostApi = `http://localhost:5500/public/html/gracias.html`

		window.location.href = hostGracias;
		console.log(data);
	}




	console.log(pedidoAEnviar)
}

function esvalidoMandarPedido() {
	console.log('[esvalidoMandarPedido]');

	const camposRequeridos = ['nombre', 'telefono', 'direccion', 'pago'];
	let camposFaltantes = camposRequeridos.filter(campo => {
		console.log(`campo`, campo, objetoFormulario);

		if (!objetoFormulario?.values) return
		!objetoFormulario?.values[campo]
	});


	if (camposFaltantes.length === 0 && Object.keys(pedidoObj.productos).length > 0) {
		return { valido: true, mensaje: '' };
	} else {
		console.log(camposFaltantes, 'lasfasjf');

		if (camposFaltantes.length == 0) camposFaltantes = camposRequeridos

		const mensaje = `Faltan los siguientes campos: ${camposFaltantes.join(', ')}.`;
		return { valido: false, mensaje: mensaje };
	}
}


function miraNumeroDeTelefono() {
	if (objetoFormulario.values) {
		if (objetoFormulario.values.telefono.length < 9) {
			return 'el numero de telefono debe tener 9  o mas cararctes'
		}
	}
}


function divfloatFun(params) {
	console.log('[divfloatFun]')
	//ponemos el boton en normal
	const form = document.getElementById('form')
	const divFloatButon = document.getElementById('divFloatButon')
	divFloatButon.classList.remove('fixed-bottom')

	//miramos si es valido enviar el peido 
	if (esvalidoMandarPedido()) {
		console.log('[botdivfloatFunonEnviar] es valido ')
		//es valido madar el pedido 
	} else {
		console.log('[botdivfloatFunonEnviar] no es valido ')

	}
}


function añidirPedido(producto, agregar = true) {//los precios se ponen en su minima exprecion: el peso $
	console.log('[añidirPedido]')

	switch (producto) {
		case 'Hamburguesa':
			if (pedidoObj.productos == undefined) pedidoObj.productos = []
			if (agregar) {
				console.log(pedidoObj.productos);
				pedidoObj.productos.push({ type: producto, price: 16000, product_id: '2' })
			} else {
				const holi = pedidoObj.productos.findIndex(e => e.type == 'Hamburguesa')
				if (holi == - 1) return
				pedidoObj.productos.splice(holi, 1);
				if (pedidoObj.productos.length == 0) delete pedidoObj.productos
			}
			spanHamburguesa.innerHTML = pedidoObj?.productos?.filter(e => e.type == 'Hamburguesa').length || "0"
			break;
		case 'Combo':
			if (pedidoObj.productos == undefined) pedidoObj.productos = []
			if (agregar) {
				pedidoObj.productos.push({ type: producto, price: 19500, product_id: '1' })
			} else {
				const holi = pedidoObj.productos.findIndex(e => e.type == 'Combo')
				if (holi == - 1) return
				pedidoObj.productos.splice(holi, 1);
				if (pedidoObj.productos.length == 0) delete pedidoObj.productos
			}
			spanCombo.innerHTML = pedidoObj?.productos?.filter(e => e.type == 'Combo').length || "0"
			break;
	}

	establerValoresDeFormulario()
	inyectarPedidoAInput()
	mostrarCantidad()
	renderisarResumenPedido()
}

function inyectarPedidoAInput() {
	console.log('[inyectarPedidoAInput]')

	let pedidoInput = document.getElementById('pedido')
	pedidoInput.value = JSON.stringify(pedidoObj)
}

function añidirDomilicilio(matrixDistancia) {
	console.log('[añidirDomilicilio]')

	const Domicilio = 'Domicilio'

	if (!pedidoObj?.domicilio) {
		pedidoObj.domicilio = []

	}
	if (!pedidoObj.domicilio[Domicilio]) {
		// console.log('no hay arra en pedidoobjdomicilio')
		pedidoObj.domicilio[Domicilio] = []
	}

	pedidoObj.domicilio[Domicilio] = []
	//lo redondeanmoa a numero mas ssercanoo
	let prece = Math.round((matrixDistancia.distance.value) / 1000) * 1000

	if (prece < 3000) {
		prece = 3000
	} else if (prece < 5500) {
		prece = 5000
	}


	pedidoObj.domicilio[Domicilio].push({ type: Domicilio, price: prece, duration: matrixDistancia.duration })

	establerValoresDeFormulario()
	inyectarPedidoAInput()
	mostrarCantidad()
	renderisarResumenPedido()
}

function mostrarCantidad() {
	console.log('[mostrarCantidad]')

}

async function renderisarResumenPedido() {
	console.log('[renderisarResumenPedido]')

	const ulListaResumen = document.getElementById('ulListaResumen')
	ulListaResumen.innerHTML = ''

	//cogemos los producos y servicios del objeto pedidoObj
	const arrayDivSpan = []
	let precioTotal = 0

	//creamos las opciones 
	if (!adiciones) {
		 const adicionesRta = await findAdiciones()
		 adiciones = adicionesRta
	}
	let opcionsDiv = ``
	for (const i in adiciones) {
		const element = adiciones[i];
		opcionsDiv += `<option value="${element.id}">${element.name}</option>`
	}
	opcionsDiv = `<option selected disabled >Adiciones</option>${opcionsDiv}</select>`


	for (const key in pedidoObj) {
		const element = pedidoObj[key];
		for (const i in element) {

			const producto = element[i];
			let cantidad = 0, nombre = '', precio = 0

			//si es domicilio
			if (producto[0]?.type == 'Domicilio') {
				console.log(producto);
				producto.forEach((ele, i) => {
					cantidad = parseInt(ele.duration.value / 60 + 15) + ' minutos aprox'
					nombre = ele.type
					precio += ele.price
				})
				precioTotal = precioTotal + precio
				arrayDivSpan.push(crearDivSpan(cantidad, nombre, precio))

			} else {
				var baddConADICIONES = ``
				if (producto.modifique) {
					for (const keyba in producto.modifique) {
						const adicion = producto.modifique[keyba];
						baddConADICIONES += `${crearBad(`${i}-${keyba}`, adicion)}`
					}
				}


				console.log(producto, 'haskdff')
				const selectDiv = `
					<div>
						<select class="form-select-sm" style="width: 8rem;" id="opciones${producto.type}Producto${i}" onchange="anadirEspecifiChange('opciones${producto.type}Producto${i}')">
							${opcionsDiv}
						<div id="divSelect${producto.type}${i}">${baddConADICIONES}</div>
					</div>`
				arrayDivSpan.push(crearDivSpan(selectDiv, producto.type, producto.price))



				cantidad += 1
				nombre = producto.type
				precio += producto.price
				// console.log(ele, 'productooooooooooooooo')
				precioTotal = precioTotal + precio
				// arrayDivSpan.push(crearDivSpan(cantidad, nombre, precio))
			}
		}
	}

	// console.log('pedidoObj', pedidoObj, 'pedidoObj', precioTotal)


	const totalResumen = document.getElementById('totaResumen')
	// console.log(precioTotal)
	totalResumen.innerHTML = `${precioTotal}`

	// console.log(arrayDivSpan, pedidoObj)
	let uls = `
	<table class="table table-striped table-responsive">
	<thead>
	<tr class="tipografiaDeTituloPeroPeque">
		<th class="hoal">PRODUCTOS</th>
		<th>MAS...</th>
		<th>PRICIO</th>
	</tr>
	</thead>
	<tbody>
	`
	arrayDivSpan.map(element => uls += element)
	uls += `
	</tbody>
	</table>
	`
	ulListaResumen.innerHTML = uls
	inyectarPedidoAInput()
	divfloatFun()
	ponerDecimal()


	function crearDivSpan(cantidad, nombre, precio) {
		console.log('[crearDivSpan]')

		const li = `
		<tr class="tipografiaExtraBold">
			<td class=" "><small >${nombre}</small></td>
			<td><h6 class="my-0">${cantidad}</h6></td>
			<td><span class="text-success money">${precio}</span></td>
		</tr>
		`
		return li
	}

}


function redibujarElResumen() {

	const ulListaResumen = document.getElementById('ulListaResumen')
	ulListaResumen.innerHTML = ''


}

function anadirEspecifiChange(select) {

	const selectInput = document.getElementById(select)

	const nombreAleatorio = Math.floor(Math.random() * 400)
	const especificacion = adiciones[adiciones.findIndex(e => e.id == selectInput.value)]

	//agregamos la adicion a al producto 
	const lengthProduco = select.split('Producto')[1]

	agregarAdicionProducto(lengthProduco, especificacion)
	renderisarResumenPedido()

}

function crearBad(ordenDeLaAdicion, especificacion) {
	console.log("🚀 ~ file: formularioPedidos.js:463 ~ crearBad ~ ordenDeLaAdicion:", ordenDeLaAdicion)
	const hol = ordenDeLaAdicion.split('-')
	const lengthProduco = hol[0]
	const lengthAdicion = hol[1]


	return `<span id="divSpanBadge${ordenDeLaAdicion}" class="badge etiqueta" onclick="removerAdicionProducto('${lengthProduco}', '${lengthAdicion}')" style="background-color: ${especificacion.colorPrimary}"><div>${especificacion.name}</div></span>`
}

function agregarAdicionProducto(lengthProducto, adicion) {
	if (popUpActivo) return
	if (pedidoObj.productos[lengthProducto]?.modifique == undefined) pedidoObj.productos[lengthProducto].modifique = []
	pedidoObj.productos[lengthProducto].modifique.push(adicion)
	pedidoObj.productos[lengthProducto].price += adicion.price || 0
	console.log(pedidoObj.productos[0]);

}
function removerAdicionProducto(lengthProducto, idAdi) {
	if (popUpActivo) return

	console.log("🚀 ~ file: formularioPedidos.js:480 ~ removerAdicionProducto ~ idAdi:", idAdi)
	console.log("🚀 ~ file: formularioPedidos.js:480 ~ removerAdicionProducto ~ pedidoObj.productos[lengthProducto].modifique:", pedidoObj.productos[lengthProducto].modifique)
	const adicion = pedidoObj.productos[lengthProducto].modifique[idAdi]
	console.log("🚀 ~ file: formularioPedidos.js:468 ~ crearBad ~ adi:", adicion)


	const idex = pedidoObj.productos[lengthProducto].modifique.findIndex(e => e.id == adicion.id)
	console.log("🚀 ~ file: formularioPedidos.js:454 ~ removerAdicionProducto ~ idex:", idex)
	pedidoObj.productos[lengthProducto].price -= adicion.price || 0
	console.log("🚀 ~ file: formularioPedidos.js:459 ~ removerAdicionProducto ~ adicion.price:", adicion.price)
	pedidoObj.productos[lengthProducto].modifique.splice(idex, 1);
	console.log(pedidoObj.productos[0]);
	renderisarResumenPedido()

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
		console.log("🚀 ~ file: formularioPedidos.js:516 ~ findAdiciones ~ adiciones:", adiciones)
		
		const rta = adiciones.body.map(e => e.data)
		return rta

	} catch (error) {
		console.log(error)
		throw error
	}
}

// Obtener todos los elementos con la clase "money"
function ponerDecimal() {
	const elements = document.querySelectorAll(".money")

	// Recorrer todos los elementos
	elements.forEach((element) => {
		// Obtener el contenido actual
		let content = element.textContent
		// Convertir a formato de dinero con puntos
		content = content.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
		// Actualizar el contenido
		element.textContent = content
	})
}

