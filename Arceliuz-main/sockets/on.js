const controllerEstados = require("../components/estados/controller")

//devuelve una lista de pedidos calientes. 
async function renderPedidosCalientes(socket) {//controllerEstados.calientesGet() para obtener los pedidos calientes.
    const pedidosCalientes = await controllerEstados.calientesGet()//devuelve los resultados en la variable pedidosCalientes.
    console.log('socket, ', pedidosCalientes.length)//Imprime la longitud de pedidosCalientes en la consola

    socket.emit('server:renderPedidos', pedidosCalientes)//Emite los pedidos calientes al socket utilizando 
    console.log('dsta enviados')//Imprime el mensaje "datos enviados" en la consola.

}

function addMessage(socket) {
    
    socket.on('client:newMessage', (message)=>{
        console.log(message)
    })
}



module.exports = {
    renderPedidosCalientes,
    addMessage,
}

