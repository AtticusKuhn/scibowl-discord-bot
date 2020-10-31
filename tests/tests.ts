import { Message } from "discord.js";

export default [
  {
    type: "message",
    check: (msg: Message) => msg.content === "bruh",
    name: "example of a test",
    message: "this message is a test",
  },
];
