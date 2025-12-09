import readline from "readline";

const socket = new WebSocket("ws://localhost:8080");

function sendMessage(to, message) {
  socket.send(
    JSON.stringify({
      type: "message",
      to: to,
      message: message,
    }),
  );
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

function registerUser() {
  return new Promise(async (resolve) => {
    const handler = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "registerSuccess") {
        socket.removeEventListener("message", handler);

        resolve();
      }
      if (data.error && data.code === 409) {
        console.log("username already taken");
        askUsername();
      }
    };
    socket.addEventListener("message", handler);
    askUsername();
    async function askUsername() {
      const username = await ask("Enter your username: ");
      socket.send(
        JSON.stringify({
          type: "register",
          username: username,
        }),
      );
    }
  });
}

async function main() {
  await registerUser();
  console.log(
    "Username registered. Remember messages are typed in the format <username>: <message>",
  );

  socket.addEventListener("message", (event) => {
    const data = JSON.parse(event.data);
    if (data.error && data.code === 404) {
      console.log("receiver not found");
    } else {
      console.log(`(Received)  ${data.from}: ${data.message}`);
    }
  });

  rl.on("line", (line) => {
    if (!line.trim()) return;
    try {
      let chatWith = line.split(":")[0].trim();
      let message = line.split(":")[1].trim();
    } catch (error) {
      console.log("Invalid message format");
    }
    sendMessage(chatWith, message);
  });
}

socket.addEventListener("open", () => {
  console.log("Connected to server");
  main().catch((err) => {
    console.log(err);
  });
});

socket.addEventListener("error", (err) => {
  console.log(err);
});
