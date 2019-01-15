var socket = io();

var params = new URLSearchParams(window.location.search);
if (!params.has('name') || !params.has('room')) {
    window.location = 'index.html';
    throw new Error('Name and room are necessary')
}
var user = {
    name: params.get('name'),
    room: params.get('room')
}

socket.on('connect', function() {
    console.log('Conectado al servidor');
    socket.emit('joinChat', user, function(res) {
        console.log('Users online:', res);
    })
});

// escuchar
socket.on('disconnect', function() {

    console.log('Perdimos conexión con el servidor');

});


// Enviar información
// socket.emit('createMessage', {
//     usuario: 'Fernando',
//     mensaje: 'Hola Mundo'
// }, function(resp) {
//     console.log('respuesta server: ', resp);
// });

// Escuchar información
socket.on('createMessage', function(mensaje) {

    console.log('Server:', mensaje);

});

//users changes
socket.on('peopleList', function(users) {

    console.log(users);

});

//private messages
socket.on('privateMessage', function(message) {
    console.log('Private Message:', message);
})