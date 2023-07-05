const socket = io()

function sendMessage() {
    const message = document.getElementById('message').value;
    socket.on('server:renderPedidos', (data)=>{
        console.log('data')
        console.log(data)
    })
    socket.emit('client:newMessage', message)
}

socket.on('server:renderPedidos', (data)=>{
    console.log('data')
    console.log(data)
})