const { initializeApp, applicationDefault, cert } = require('firebase-admin/app')
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore')
var admin = require("firebase-admin");

const serviceAccount = require("./../serviceAccountKey.json");
const { URLDATABASE } = require('../config');

const urlDataBase = URLDATABASE
console.log("🚀 ~ file: database.js:9 ~ urlDataBase:", urlDataBase)
/**
 * se utiliza la función initializeApp() del módulo firebase-admin para inicializar la aplicación
 *  Firebase. Los argumentos que se pasan a initializeApp() 
 * son un objeto de configuración que contiene las credenciales de servicio 
 * y la URL de la base de datos.
 */


initializeApp({
    credential:  admin.credential.cert(serviceAccount),
    databaseURL: urlDataBase
});

const db = getFirestore()

        
module.exports = db