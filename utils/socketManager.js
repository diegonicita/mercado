class SocketManager {
  constructor(io) {
    this.io = io
    this.users = []
    this.initializeSocketEvents()
  }

  initializeSocketEvents() {
    this.io.on('connection', (socket) => {
      console.log('User Connected: ' + socket.id)

      socket.on('join_room', (data) => {
        this.handleJoinRoom(socket, data)
      })

      socket.on('send_message', (data) => {
        this.handleSendMessage(socket, data)
      })

      socket.on('disconnect', () => {
        this.handleDisconnect(socket)
      })
    })
  }

  handleJoinRoom(socket, data) {
    socket.join(data.room)
    console.log(
      `User ${data.author} with Id ${socket.id} have joined room: ${data.room}`,
    )

    this.users = this.users.filter((u) => u.id !== socket.id)
    this.users.push({ user: data.author, id: socket.id, room: data.room })

    socket.to(data.room).emit('have_joined_room', data)
    this.io.in(data.room).emit('update_users_list', this.users)
    console.log(this.users)
  }

  handleSendMessage(socket, data) {
    // Verificar si el usuario ha ingresado a alguna sala
    if (!this.isUserInRoom(socket.id)) {
      // Si no ha ingresado a ninguna sala, unirlo a la sala 100
      const defaultRoom = 100
      socket.join(defaultRoom)
      console.log(`User ${socket.id} joined default room: ${defaultRoom}`)

      // Actualizar la lista de usuarios y enviar mensaje a la sala
      this.users.push({ user: data.author, id: socket.id, room: defaultRoom })
      this.io.in(defaultRoom).emit('update_users_list', this.users)
    }

    // Enviar el mensaje a la sala correspondiente
    socket.to(data.room).emit('receive_message', data)
  }

  isUserInRoom(userId) {
    // Verificar si el usuario está en alguna sala
    return this.users.some((user) => user.id === userId && user.room)
  }

  handleDisconnect(socket) {
    const disconnectedUser = this.users.find((user) => user.id === socket.id)
    this.users = this.users.filter((user) => user.id !== socket.id)
    console.log('User Disconnected ' + socket.id)
    console.log(this.users)
    if (disconnectedUser && disconnectedUser.room) {
      this.io.in(disconnectedUser.room).emit('update_users_list', this.users)
    }
  }
}

module.exports = SocketManager
