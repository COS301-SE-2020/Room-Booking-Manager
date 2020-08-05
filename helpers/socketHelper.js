import express from 'express';
import http from 'http';
import io from 'socket.io';

const socketServer = http.createServer(express);
export const ioServer = io(socketServer);

socketServer.listen(3001);

// Socket event
ioServer.on('connection', socket => {
  socket.on('create_room', subscriptionId => {
    socket.join(subscriptionId);
  });
});
