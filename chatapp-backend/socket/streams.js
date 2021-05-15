module.exports = function(io, User, _) {
    const userData = new User();
    io.on('connection', socket => {
        socket.on('refresh', (data) => {    /*ontimme post eka load wenna */
           io.emit('refreshPage', {}); // console.log(data);
        });

        socket.on('online', data => {
            //console.log(data);
            socket.join(data.room);
            userData.EnterRoom(socket.id, data.user, data.room);
            const list = userData.GetList(data.room);
            io.emit('usersOnline', _.uniq(list));
        });
        socket.on('disconnect', () => {
            const user = userData.RemoveUser(socket.id);
           // console.log(user); lession 226
           if(user) {
               const userArray = userData.GetList(user.room);
               const arr =_.uniq(userArray);
               // console.log(arr);
               _.remove(arr, n => n === user.name);
               io.emit('usersOnline', arr);
           }
        })
        
    });
}    