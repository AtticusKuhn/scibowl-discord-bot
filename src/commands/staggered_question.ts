import { json_embed } from "../discord_utils/embeds";
import { Message, MessageCollector } from "discord.js";
import { my_client, command_parsed_output } from "../types";
const Discord = require("discord.js");
import { get_question, async_collection, check_answer } from "../methods";
function sleep(ms: number): Promise<null> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default {
  description: "Get a staggered random question",
  alias: new Set(["s_q", "newquestion", "q"]),
  sample_usage: "s_q",
  form:
    "<type:physics|general science|energy| earth and space|earth science|chemistry|biology|astronomy|math|computer science>",
  run: async (
    command_parsed: command_parsed_output,
    msg: Message,
    client: my_client
  ) => {
    //@ts-ignore
    const question = await get_question(
      //@ts-ignore
      command_parsed.form.type ? command_parsed.form.type.toUpperCase() : null
    );
    const splited = question.tossup_question.match(
      /\b[\w']+(?:[^\w\n]+[\w']+){0,5}\b/g
    );
    const send_message = await msg.reply(`question:\n${splited.shift()}`);
    for (const edit of splited) {
      await sleep(1e3);
      await send_message.edit(send_message.content + " " + edit);
    }
    await send_message.edit(send_message.content + "\nEND OF QUESTION");
    console.log(question.tossup_answer);
    const response = await async_collection(
      msg,
      (m) => check_answer(question.tossup_answer, m.content),
      (m) => m.author.id === msg.author.id
    );
    if (response.success) {
      return `success you are correct (answer was ${question.tossup_answer})`;
    } else {
      return `no, the correct answer was ${question.tossup_answer}. Your answer was ${response.message}`;
    }
  },
};
