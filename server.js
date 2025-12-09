import { WebSocketServer } from "ws";
import { v4 as uuidv4 } from "uuid";

const wss = new WebSocketServer({ port: 8080 });
const users = new Map();

wss.on("connection", (ws) => {
  console.log("new client connected");
  ws.on("message", (raw) => {
    const data = JSON.parse(raw);
    if (data.type == "register") {
      const userId = uuidv4();
      if (!users.has(data.username)) {
        console.log(data);
        users.set(data.username, { id: userId, socket: ws });
        ws.username = data.username;
        console.log(`user ${data.username} registered`);
        ws.send(JSON.stringify({ type: "registerSuccess" }));
      } else {
        ws.send(JSON.stringify({ error: "username already taken", code: 409 }));
      }
    }

    if (data.type == "message") {
      let receiver;
      try {
        receiver = data.to;
      } catch (e) {
        ws.send(
          JSON.stringify({
            error: "missing fields. required fields: receiver, sender",
          }),
        );
      }
      if (!users.has(receiver)) {
        ws.send(JSON.stringify({ error: "receiver doesnt exist", code: 404 }));
      } else {
        const receiverSocket = users.get(receiver).socket;
        receiverSocket.send(
          JSON.stringify({ message: data.message, from: ws.username }),
        );
      }
    }
  });
  ws.on("close", () => {
    console.log("-------------------------");
    console.log("user disconnected");
    console.log("username:", ws.username);
    console.log("-------------------------");
    users.delete(ws.username);
  });
});
