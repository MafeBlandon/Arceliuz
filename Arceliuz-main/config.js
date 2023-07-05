const dotenv = require('dotenv')

const path = require('path');

/**
 * se utiliza para cargar las variables de entorno de un archivo .env en una aplicación Node.js.
 *  La ruta del archivo .env se resuelve utilizando 
 * path.resolve() y se compone concatenando el valor de process.env.NODE_ENV con la extensión .env.
 */

dotenv.config({
	path: path.resolve(process.env.NODE_ENV + '.env')
})
/**
 *  indica el entorno en el que se está ejecutando la aplicación, como "development" 
 * (desarrollo), "production" (producción) o "test" (pruebas)
 */
console.log(`Corriendo Arceliuz en ${process.env.NODE_ENV}`)


module.exports = {
	NODE_ENV: process.env.NODE_ENV || 'development',
	HOST: process.env.HOST || '127.0.0.1',
	PORT: process.env.PORT || 8087,
	KEYMAPS: process.env.KEYMAPS,
	JWTSECRET: process.env.JWTSECRET,
	URLDATABASE:  process.env.URLDATABASE,
}