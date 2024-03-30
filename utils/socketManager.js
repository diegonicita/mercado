class SocketManager {
  constructor(io) {
    this.io = io
    this.users = []
    this.messageHistory = {} // Objeto para almacenar historial de mensajes por sala
    this.MAX_HISTORY_LENGTH = 10 // Máximo número de mensajes en el historial
    this.initializeSocketEvents()
  }

  initializeSocketEvents() {
    this.io.on('connection', (socket) => {
      console.log(`User Connected: ${socket.id}`)

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
    if (!data.room || !data.author) {
      console.error('Invalid data for joining room:', data)
      return
    }

    // Check if the user is already in the room (considering all connections)
    const existingUser = this.users.find(
      (user) => user.id === socket.id && user.room === data.room,
    )

    if (existingUser) {
      // Close the duplicate connection
      console.log(
        `Closing duplicate connection for user ${data.author} in room ${data.room}`,
      )
      //socket.disconnect()
      this.io.sockets.sockets[existingUser.id].disconnect()
      return
    }

    socket.join(data.room)
    console.log(
      `User ${data.author} with Id ${socket.id} have joined room: ${data.room}`,
    )

    // Envía el historial de mensajes al usuario que se une
    if (this.messageHistory[data.room]) {
      socket.emit('message_history', this.messageHistory[data.room])
    }

    this.updateUserList(socket.id, data.author, data.room)
    socket.to(data.room).emit('have_joined_room', data)
    this.io.in(data.room).emit('update_users_list', this.users)
  }

  handleSendMessage(socket, data) {
    if (!this.isUserInRoom(socket.id)) {
      this.handleJoinRoom(socket, { room: 100, author: data.author })
    }
    if (data.message === '') {
      return
    }

    const message = {
      author: data.author,
      nickname: data.nickname,
      message: data.message,
    }

    // Agrega el mensaje al historial de mensajes de la sala
    if (!this.messageHistory[data.room]) {
      this.messageHistory[data.room] = []
    }

    this.messageHistory[data.room].push(message)
    // Limita el historial de mensajes al número máximo de mensajes
    if (this.messageHistory[data.room].length > this.MAX_HISTORY_LENGTH) {
      this.messageHistory[data.room].shift()
    }

    socket.to(data.room).emit('receive_message', data)
  }

  isUserInRoom(userId) {
    return this.users.some((user) => user.id === userId && user.room)
  }

  handleDisconnect(socket) {
    const disconnectedUser = this.users.find((user) => user.id === socket.id)
    this.users = this.users.filter((user) => user.id !== socket.id)
    console.log(`User Disconnected ${socket.id}`)
    console.log(this.users)
    if (disconnectedUser?.room) {
      this.io.in(disconnectedUser.room).emit('update_users_list', this.users)
    }
  }

  updateUserList(userId, userName, room) {
    this.users = this.users.filter((u) => u.id !== userId)
    this.users.push({ user: userName, id: userId, room: room })
  }
}

module.exports = SocketManager
