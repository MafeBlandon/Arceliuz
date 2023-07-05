const { phone } = require('phone');//se hace uso de la librería phone guardada en "phone"

function formatearPhone(dataPhone) {//vamos a formatear el telefono 
	let objPhone

	/* formatea el número de teléfono utilizando la función "phone" 
	con la opción de país establecida en 'CO' (Colombia). 
	Si el número de teléfono es válido según el formato colombiano,
	 devuelve el número de teléfono formateado.*/
	objPhone = phone(dataPhone, { country: 'CO' })
	if (objPhone.isValid) return objPhone.phoneNumber

		/*agrega el prefijo internacional '+' en caso de que el primero no tenga exito
	 al número de teléfono y vuelve a intentar formatearlo con 
	 la opción de país establecida en 'CO'. Si el número de teléfono es válido según el formato colombiano, 
	 devuelve el número de teléfono formateado.
 */
	objPhone = phone(`+${dataPhone}`, { country: 'CO' })
	if (objPhone.isValid) return objPhone.phoneNumber

	/*intenta formatear el número de teléfono sin especificar un país en tal caso que los dos anteriores no sean el caso */
	objPhone = phone(dataPhone)
	if (objPhone.isValid) return objPhone.phoneNumber

	return dataPhone// teléfono sin cambios
}

module.exports = {
	formatearPhone,
}