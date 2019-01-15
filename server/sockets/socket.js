const { io } = require('../server');
const { Users } = require('../classes/users');
const users = new Users();
const { createMessage } = require('../utils/utils');

io.on('connection', (client) => {

    client.on('joinChat', (data, callback) => {

        if (!data.name || !data.room) {
            return callback({
                error: true,
                message: 'Name/Room is necessary'
            })
        }

        client.join(data.room);

        users.postPerson(client.id, data.name, data.room);

        client.broadcast.to(data.room).emit('peopleList', users.getPeopleByRoom(data.room));
        client.broadcast.to(data.room).emit('createMessage', createMessage('Admin', `${data.name} join`));
        callback(users.getPeopleByRoom(data.room));

    });

    client.on('createMessage', (data, callback) => {

        let person = users.getPerson(client.id);

        let message = createMessage(person.name, data.message);
        client.broadcast.to(person.room).emit('createMessage', message);
        callback(message);
    });

    client.on('disconnect', () => {
        let deletePerson = users.deletePerson(client.id)

        client.broadcast.to(deletePerson.room).emit('createMessage', createMessage('Admin', `${deletePerson.name} left`));
        client.broadcast.to(deletePerson.room).emit('peopleList', users.getPeopleByRoom(deletePerson.room));


    });

    //private messages
    client.on('privateMessage', (data) => {

        let person = users.getPerson(client.id);

        client.broadcast.to(data.to).emit('privateMessage', createMessage(person.name, data.message));
    });

});