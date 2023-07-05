function success(req, res, message, status, type) {
	res.status(status || 200).json({
		body: message,
	})
}
//funcion de error 
//req el objeto de solicitud HTTP.
//res: el objeto de respuesta HTTP
//errorMessage: un mensaje de error que describe el error ocurrido.
/**
 * status: un código de estado HTTP para la respuesta de error. Por defecto, es 500 si no se proporciona
 */
//details: detalles adicionales del error que se pueden mostrar en el mensaje de error.

function error(req, res, errorMessage, status, details) {
	//La función registra el mensaje de error detallado en la consola utilizando console.error()
	console.error(`[ details error ] ${details}`)
	/**
	 * Utiliza el método res.status() para establecer el código de estado HTTP de la respuesta. 
	 * Si no se proporciona un código de estado, se utiliza el valor predeterminado 500 y le
	 * Envía una respuesta JSON al cliente utilizando res.json(),
	 *  que contiene las siguientes propiedades:
	 */
	res.status(status || 500).json({
		body: null,//se establece en null para indicar que no hay cuerpo en la respuesta.
		error: errorMessage,//el mensaje de error proporcionado.
		message: details,//los detalles del error.
	})
}

module.exports = {
	success,
	error,
}
