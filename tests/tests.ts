import { Message } from "discord.js";
import config from "../src/config";

import { async_collection } from "../src/methods";
import { my_client } from "../src/types";
export default function generate_tests(client: my_client) {
  // const auto_generated_test_for_each_command = client.commands.map(
  //   (command, key) => {
  //     return {
  //       type: "message",
  //       check: (msg: Message) =>msg.embeds[0].color === config.success_color,
  //       name: `does the sample usage for ${key} word?`,
  //       message: `${config.prefix}${command.sample_usage}`,
  //     };
  //   }
  // );
  return [
    // ...auto_generated_test_for_each_command,
    {
      type: "message",
      check: (msg: Message) =>
        !!msg.embeds && msg.embeds[0].color === config.success_color,
      name: "does help return an embed?",
      message: `${config.prefix}help`,
    },
    {
      type: "message",
      check: async (msg: Message) => {
        await msg.channel.send("incorrect answer");
        const response_message = await async_collection(
          msg,
          (m) => true,
          (m) => m.author.id === config.bot_id,
          5e3
        );
        if (!response_message.success) return false;
        return !!response_message.message;
      },
      name: "does answering a question work?",
      message: `${config.prefix}q`,
    },
    {
      type: "message",
      check: async (msg: Message) => {
        await msg.channel.send("sample answer");
        return !!msg.embeds[0];
      },
      name: "does getquestion return an inital embed",
      message: `${config.prefix}q`,
    },
    {
      type: "function",
      check: async () => {
        const { get_question } = await import("../src/methods");
        return !!(await get_question());
      },
      name: "does get_question return a question?",
    },
    {
      type: "function",
      name: "does check_answer work as expected?",
      check: async () => {
        const { check_answer } = await import("../src/methods");
        // console.log(check_answer("w) yeet", "w"));
        // console.log(check_answer("w) yeet", "yeet"));
        // console.log(check_answer("bruh", "bruh"));
        // console.log(check_answer("bruh (ACCEPT: yeet)", "yeet"));
        // console.log(check_answer("Case", "case"));
        return (
          check_answer("w) yeet", "w") &&
          check_answer("w) yeet", "yeet") &&
          check_answer("bruh", "bruh") &&
          check_answer("bruh (ACCEPT: yeet)", "yeet") &&
          check_answer("Case", "case")
        );
      },
    },
  ];
}
