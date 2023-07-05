const controllerEstados = require("../components/estados/controller")
/**
 * 
 * módulo que exporta una función para
 *  manejar la lógica de conexión y eventos en un servidor de sockets
 *  utilizando la biblioteca socket.io.} io 
 */


module.exports =  (io) => {//La función exportada toma un objeto io como argumento, que representa el servidor de sockets.
    /**
     * Cuando se establece una conexión con un nuevo socket, 
     * se ejecuta la función de callback proporcionada a io.on("connection", callback)
     */
    io.on("connection", async (socket) => {
         // console.log(socket.handshake.url);
        //se imprime el ID del socket en la consola.
        // console.log(socket.handshake.url);
        console.log("nuevo socket connectado:", socket.id);
        /**
         * Se emite un evento 'server:renderPedidos' al socket, 
         * enviando los pedidos calientes obtenidos a través de controllerEstados.calientesGet().
         */

        socket.emit("server:renderPedidos", await controllerEstados.calientesGet());
         /**
         * Se establece un listener en el evento 'client:newMessage' para recibir y procesar 
         * nuevos mensajes enviados desde el cliente. En este caso, se imprime el mensaje en la consola.
         */

        socket.on("client:newMessage", (message) => {
            console.log(message)

        });
          /**
         * Se establece un listener en el evento 'disconnect' para manejar cuando un 
         * socket se desconecta. En este caso, se imprime el ID del socket desconectado en la consola.
         */


        socket.on("disconnect", () => {
            console.log(socket.id, "disconnected");
        });
    });
};