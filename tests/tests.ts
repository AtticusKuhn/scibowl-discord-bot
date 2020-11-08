import { Message } from "discord.js";
import config from "../src/config";

import { async_collection } from "../src/methods";
import { my_client } from "../src/types";
import { message_test } from "./test_methods";
import { sleep } from "../src/utils";

export class Test {
  type: null | string;
  check: (args?: any) => boolean | Promise<boolean>;
  name: string;
  get_args: (my_client: my_client) => Promise<any>;
  constructor(check: (args: any) => boolean | Promise<boolean>, name: string) {
    this.check = check;
    this.name = name;
    this.type = null;
    this.get_args = async (my_client) => null;
  }
}
export class Message_Test extends Test {
  message: string;
  type: string;
  check: (args?: Message) => boolean | Promise<boolean>;
  name: string;

  get_args: (my_client: my_client) => Promise<Message>;
  constructor(
    message: string,
    check: (args?: Message) => boolean | Promise<boolean>,
    name: string
  ) {
    super(check, name);
    this.message = message;
    this.type = "message";
    this.get_args = async (client: my_client) => {
      const response_message = await message_test(client, message);
      await sleep(3e3); //sleep in order to not get ratelimited by discord api
      return response_message;
    };
  }
}

export default function generate_tests(client: my_client) {
  return [
    new Message_Test(
      `${config.prefix}help`,
      (msg) => !!msg.embeds && msg.embeds[0].color === config.success_color,
      "does help return an embed?"
    ),
    new Message_Test(
      `${config.prefix}q`,
      async (msg) => {
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
      "does answering a question work?"
    ),
    new Message_Test(
      `${config.prefix}q`,
      async (msg) => {
        await msg.channel.send("sample answer");
        return !!msg.embeds[0];
      },
      "does getquestion return an inital embed"
    ),
    new Message_Test(
      `${config.prefix}dashboard`,
      async (msg) => {
        return msg.embeds[0].color === config.failure_color;
      },
      "are admin commands denied to non-admins?"
    ),
    new Test(async () => {
      const { get_question } = await import("../src/methods");
      return !!(await get_question());
    }, "does get_question return a question?"),
    new Test(async () => {
      const { get_question } = await import("../src/methods");
      return !!(await get_question());
    }, "does get_question return a question?"),
    new Test(async () => {
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
    }, "does check_answer work as expected?"),
  ];
}
