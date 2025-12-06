A rather simple chat application built with Node.js as I wanted to learn websockets.

Simply run ```node server.js``` to start the websocket server.

Then proceed with ```node client.js``` to start a client connection to the server where it will prompt you to enter a username for yourself and then the username you want to chat with after which you can exchange messages

Its pretty barebones as I really just wanted to learn websockets but I do plan on adding stuff like knowing a user doesnt exist when you enter the receiver username and making it so you have to specify who you are sending messages to before you can send them rather than a one time receiver username input.

#TODO:
- [ ] Check user existence when entering receiver username
- [ ] Revamp flow so require entering username when sending messages
- [ ] Allow sending same messages to multiple users with comma separated usernames
- [ ] Clean up code (?)
