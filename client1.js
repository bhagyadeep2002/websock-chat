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

async function main() {
  const username = await ask("Enter your username: ");
  const chatWith = await ask("Enter receiver username: ");

  socket.send(
    JSON.stringify({
      type: "register",
      username: username,
    }),
  );

  socket.addEventListener("message", (event) => {
    const data = JSON.parse(event.data);
    console.log(`${data.from}: ${data.message}`);
  });

  rl.on("line", (line) => {
    if (!line.trim()) return;
    sendMessage(chatWith, line);
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
