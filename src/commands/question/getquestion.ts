import embeds, { json_embed, simple_embed } from "../../discord_utils/embeds";
import { Message, MessageCollector } from "discord.js";
import { my_client, command_parsed_output } from "../../types";
const Discord = require("discord.js");
import { get_question, async_collection, check_answer } from "../../methods";

export default {
  description: "Get a random question",
  alias: new Set(["question", "newquestion", "q"]),
  sample_usage: "getquestion",
  form:
    "<type:physics|general science|energy| earth and space|earth science|chemistry|biology|astronomy|math|computer science>",
  run: async (
    command_parsed: command_parsed_output,
    msg: Message,
    client: my_client
  ) => {
    const question = await get_question(
      //@ts-ignore
      command_parsed.form.type ? command_parsed.form.type.toUpperCase() : null
    );
    await msg.reply(
      embeds.simple_embed(
        "question",
        true,
        `question:\n${question.tossup_question}`
      )
    );
    // console.log(question.tossup_answer);
    const response = await async_collection(
      msg,
      (m: Message) => check_answer(question.tossup_answer, m.content),
      (m: Message) => m.author.id === msg.author.id
    );
    if (response.success) {
      return simple_embed(
        "yes",
        true,
        `success you are correct (answer was ${question.tossup_answer})`
      );
    } else {
      return simple_embed(
        "no",
        false,
        `no, the correct answer was ${question.tossup_answer}. Your answer was ${response.message}`
      );
    }
  },
};
