const db = require('../../database');
const { getRoomResponse } = require('../../utils');

module.exports = (socket, roomId) => {
  const room = db.get('rooms', roomId);
  if (!room) {
    socket.emit('unexistingRoom');
  } else {
    const { vote: hostVote, ...hostData } = room.host;
    room.host = hostData;
    room.guests = room.guests.map(({ vote: guestVote, ...guestData }) => guestData);
    socket.nsp.to(room.id).emit('votesCleared', getRoomResponse(room));
  }
};