//import modules
import { my_client, test } from "../src/types";
const TEST_CHANNEL_ID = "771899161733758996";
import { async_collection } from "../src/methods";
import config from "../src/config";
import { Client, TextChannel, Message } from "discord.js";
import { sleep } from "../src/utils";
const token: string = require("dotenv").config().parsed.UNIT_TEST_TOKEN;

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
export async function message_test(client: Client, message: string) {
  const found_channel = await client.channels.fetch(TEST_CHANNEL_ID);
  const msg = await (found_channel as TextChannel).send(message);
  const response_message = await async_collection(
    msg,
    (m) => true,
    (m) => m.author.id === config.bot_id,
    5e3
  );
  return response_message.message;
}
export async function run_tests(client: Client, tests: Array<Test>) {
  await client.login(token);
  for (const test of tests) {
    const result = await test.check(await test.get_args(client));
    if (result) {
      console.log("\x1b[32m", `Unit Test: ${test.name} succeeded`, "\x1b[0m");
    } else {
      console.log("\x1b[31m", `Unit Test: ${test.name} failed`, "\x1b[0m");
    }
  }
  process.exit(0);
}
