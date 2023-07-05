const controllerPedidos = require("../../../components/pedidos/controller");
const config = require("../../../config");
const { calcularDateUtc } = require("../calcularDate");
const { calcularCordenadas } = require("../calcularDomicilio");
const { ESTADOS, FORMA_DE_PAGO } = require("../estadosCollectionsNames");
const { formatearPhone } = require("../formatearPhone");
// {
//bienbenidos   a la funcion de importes de pedidos

//miramos si en al array de los pedido cumpler con el foramto , eliminamos los nulls 
//ponemos los pedidos en un  array con pedidos que tengan el mismo numero , 
//[[peididoAclinteA, pedidoBclinteA], [peididoAclinteb, pedidoBclinteB ]]
//lso pidodos de cada cliete los crearesmo de forma sincrona , y creamos todo los clentes de manera asincrona 

//por cada pedido haremos

//crear o modificar un clientete 
////formatemaos el telefono

//crear pedido 
//+tener la fecha de creacion 
//+tenre los producto con las especificaciones
//+la direccione con el punto geologioco 
//+comentarios
//total que se cobro 
//+domiciliario asignado
//hora de entrega
//origen de la importacion 
// }
async function importsPedidos(dataPedidos, blockSize = 50) {
	try {
		console.log("La cantidad de pedidos es de", dataPedidos.length);

		const results = [];

		for (let i = 0; i < dataPedidos.length; i += blockSize) {
			const block = dataPedidos.slice(i, i + blockSize);
			const blockResults = await Promise.all(block.map(async (pedido) => {
				try {
					const repetido = await buscarRepetido(pedido?.numero_guia);
					if (repetido.length >= 1) {
						return { inportado: false, motive: `Ya hay un pedido con el mismo número de guía de Tridy`, numero_guia: pedido?.numero_guia };
					}

					const dataPedido = await organisarData(pedido);
					const cliente = await importarCliente(dataPedido);
					dataPedido.clientId = cliente.id;

					const pedidoAddc = await controllerPedidos.pedidoAdd(dataPedido, cliente.id);

					return { id: pedidoAddc.id, error: false };
				} catch (error) {
					console.log('Error:', error);
					return { id: null, error: true, numero_guia: pedido?.numero_guia || null };
				}
			}));

			results.push(...blockResults);
		}

		return results;
	} catch (error) {
		throw error;
	}
}

async function processPedidosInBlocks(dataPedidos, blockSize) {
	let start = 0;
	let end = Math.min(blockSize, dataPedidos.length);
	const results = [];

	while (start < dataPedidos.length) {
		const block = dataPedidos.slice(start, end);
		const blockResults = await importsPedidos(block);
		results.push(...blockResults);

		start = end;
		end = Math.min(start + blockSize, dataPedidos.length);
	}

	return results;
}


async function buscarRepetido(numero_guia) {
	if (!numero_guia) throw `No titene numeron de guia , por lo tanto no tiene numero de seguimienot , comunicate con soporte`
	const filter = { key: "numero_guia", options: "==", value: numero_guia }
	console.log("🚀 ~ file: importaciones.js:83 ~ numero_guia:", numero_guia)

	const find = await controllerPedidos.pedidoFilter(filter)
	return find
}

async function organisarData(pedido) {

	const corrdenadas = await calcularCordenadasImport(pedido.direccion_destinatario)
	const order = calcularOrderDeString(pedido.detalle_pedido)
	const domiciliarioRef = cacularDomiciliario(pedido.mensajero)
	const date = calcularDateUtc(pedido.fecha_pedido)
	const phoneFort = formatearPhone(pedido.telefono_destinatario);
	const estado = calcularEstado(pedido.estado)
	const forma_de_pago = formaDePago(pedido.forma_de_pago)

	const data = {
		name: pedido.nombre_destinatario,
		phone: phoneFort,
		"order": order,
		"address": {
			"address_complete": pedido.direccion_destinatario,
			"verified": false,
			"coordinates": corrdenadas,

		},
		"fee": forma_de_pago,
		estado: estado,
		origen: pedido.origen,
		origenImport: 'triidy',
		numero_guia: pedido.numero_guia,
		type: 'Import',
		domiciliario_asignado: domiciliarioRef,
		date: date,
		pagoConfirmado: {
			confirmado: true,
			time: null
		},
		duracionEstimada: null,
		priceTotal: {
			COP: `$${pedido.valor_recaudo}`,
			priceTotal: parseInt(pedido.valor_recaudo)
		},
		dataImport: JSON.stringify(pedido)
	}

	return data
}

async function importarCliente(pedido) {
	try {
		//creamos un objeto de clliete con { name: data.name, address: data.address, phone: data.phone }
		const dataClient = {
			name: pedido.name,
			address: pedido.address,
			phone: pedido.phone,
			origuen: `import`
		};
		const createCliete = await controllerPedidos.establecerCliente(dataClient);
		return createCliete
	} catch (error) {
		throw error
	}
}

async function creacionesDePedidosImportados(pedido) {


	const products = await establecerProductos(data.order)
	//calculamos cuanto cuesta el domicilio 
	const costoDomicilio = await establcerDomicilio(data.address.coordinates)

	data.order = products
	data.order.push(costoDomicilio)

	const priceTotal = calcularCost(data.order)

}

function calcularOrderDeString(order) {
	const pedidoObjeto = convertirPedido(order);
	// console.log(pedidoObjeto);
	return pedidoObjeto
}

function convertirPedido(pedidoText) {
	const productos = [];
	const pedidoStr = eliminarParentesis(pedidoText)//le quitamos los () y su interior
	const pedidoList = pedidoStr.split(","); // Dividir el pedido en elementos individuales

	for (let i = 0; i < pedidoList.length; i++) {
		const elemento = pedidoList[i].trim(); // Eliminar espacios en blanco al inicio y al final
		const productoSplit = elemento.split(" ");

		const cantidad = parseInt(productoSplit[0])
		const nombre = productoSplit[1]
		const nombreCompleto = (productoSplit.slice(1, productoSplit.length)).join(' ')

		for (let i = 0; i < cantidad; i++) {
			let producto
			switch (nombre) {
				case `Combo`:
					producto = {
						price: 19500,
						name: nombreCompleto,
						id: "1"
					}
					break;
				case `Hamburguesa`:
					producto = {
						price: 16000,
						name: nombreCompleto,
						id: "2"
					}
					break;
				case `Domicilio`:
					const pricD = productoSplit[2].replace('.', '')
					producto = {
						price: parseInt(pricD),
						name: `${nombre}${pricD}`,
						id: `D${pricD}`
					}

					break;
				case `Gaseosa`:
					if (productoSplit[2] == "litro") {
						producto = {
							// price: 16000,
							name: nombreCompleto,
							id: "9"
						}
					} else if (productoSplit[2] == "personal") {
						producto = {
							// price: 16000,
							name: nombreCompleto,
							id: "10"
						}
					} else {
						producto = {
							// price: 16000,
							name: nombreCompleto,
							id: `f${nombreCompleto}`
						}
					}
					break;
				case `Porcion`:
					producto = {
						// price: 16000,
						name: nombreCompleto,
						id: "7"
					}
					break;
				case `Adición`:
					if (productoSplit[3] == "ajo") {
						producto = {
							// price: 16000,
							name: nombreCompleto,
							id: "3"
						}
					} else if (productoSplit[3] == "carne") {
						producto = {
							// price: 16000,
							name: nombreCompleto,
							id: "4"
						}
					} else {
						producto = {
							// price: 16000,
							name: nombreCompleto,
							id: `f${nombreCompleto}`
						}
					}
					break;
				case `Porcion`:
					producto = {
						// price: 16000,
						name: nombreCompleto,
						id: "7"
					}
					break;
				default:

					producto = {
						// price: parseInt(5),
						name: `${nombreCompleto}`,
						id: `f${nombreCompleto}`
					}
					break;
			}

			productos.push(producto);
		}

	}
	// console.log("🚀 ~ file: importaciones.js:229 ~ productos:", productos)

	return productos;
}

function eliminarParentesis(texto) {
	return texto.replace(/\([^)]*\)/g, '');
}


function cacularDomiciliario(domiciliario) {
	//deberiamos de hacer un swiche para asignra un domiciliario por cada uno 
	return {
		name: domiciliario
	}
}

function calcularEstado(estado) {
	//establecemos los estados nuestro 
	let rtaEstado

	switch (estado) {
		case `Despachado`:
			rtaEstado = ESTADOS.Facturados

			break;
		case `Anulado`:
			rtaEstado = ESTADOS.Eliminados

			break;

		default:
			rtaEstado = ESTADOS.Indefinido

			break;
	}

	return rtaEstado

}

function formaDePago(value) {
	let fee
	switch (value) {
		case `Contraentrega`:
			fee = FORMA_DE_PAGO.Efectivo

			break;
		case `Pago Anticipado`:
			fee = FORMA_DE_PAGO.Transferencia
			break

		default:
			fee = `Undefine`
			break;
	}
	return fee
}

async function calcularCordenadasImport(direccion) {
	let rta
	//si es en dessarrollo paso una  coordenadas defauld
	if (config.NODE_ENV == `development`) {
		rta = {
			"lat": 6.3017454,
			"lng": -75.5765721
		}
	} else if (config.NODE_ENV == `production`) {
		rta = calcularCordenadas(direccion)
	}
	return rta
}

module.exports = {
	importsPedidos,
	importarCliente,
}