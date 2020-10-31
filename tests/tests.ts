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
      name: "does help return an embed",
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
      message: `${config.prefix}get_question`,
    },
  ];
}
