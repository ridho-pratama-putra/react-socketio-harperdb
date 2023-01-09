REACT, SOCKETIO, HARPERDB
act as frontend realtime chat

- React-router-dom will allow us to set up routes to our different React components – essentially creating different pages.
- socket.io, that allows us to "emit" events to the server. Once received by the server, we can use the server version of socket.io to do stuff like sending messages to users in the same room as the sender, or join a user to a socket room.