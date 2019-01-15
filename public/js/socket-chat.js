var socket = io();

var params = new URLSearchParams(window.location.search);

if (!params.has('name') || !params.has('room')) {
    window.location = 'index.html';
    throw new Error('Name and room are necessary');
}

var user = {
    name: params.get('name'),
    room: params.get('room')
};



socket.on('connect', function() {
    console.log('Connected to the server');

    socket.emit('joinChat', user, function(resp) {
        renderUsers(resp);
    });

});

// escuchar
socket.on('disconnect', function() {

    console.log('We lost the server connection');

});


// Enviar información
// socket.emit('crearMensaje', {
//     nombre: 'Fernando',
//     mensaje: 'Hola Mundo'
// }, function(resp) {
//     console.log('respuesta server: ', resp);
// });

// Escuchar información
socket.on('createMessage', function(message) {
    renderMessages(message, false);
    scrollBottom();
});

// Escuchar cambios de usuarios
// cuando un usuario entra o sale del chat
socket.on('peopleList', function(people) {
    renderUsers(people);
});

// Mensajes privados
socket.on('privateMessage', function(message) {

    console.log('Priavte Message:', message);

});