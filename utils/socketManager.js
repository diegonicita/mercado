const socketManager = (io) => {
  let users = []

  io.on('connection', (socket) => {
    console.log('User Connected: ' + socket.id)

    socket.on('join_room', (data) => {
      socket.join(data.room)
      console.log(
        'User ' +
          data.author +
          ' with Id ' +
          socket.id +
          'have joined room: ' +
          data.room,
      )
      result = users.filter((u) => u.id !== socket.id)
      users = [...result, { user: data.author, id: socket.id, room: data.room }]
      socket.to(data.room).emit('have_joined_room', data)
      io.in(data.room).emit('update_users_list', users)
      console.log(users)
    })

    socket.on('send_message', (data) => {
      console.log(data)
      socket.to(data.room).emit('receive_message', data)
    })

    socket.on('disconnect', () => {
      const found = users.find((element) => element.id === socket.id)
      users = users.filter(function (item) {
        return item.id !== socket.id
      })
      console.log('User Disconnected ' + socket.id) // + "from Room " + found && found.room);
      console.log(users)
      if (found && found.room)
        io.in(found.room).emit('update_users_list', users)
    })
  })
}

module.exports = socketManager
