//import modules
import { my_client, test } from "../src/types";
const TEST_CHANNEL_ID = "771899161733758996";
import { async_collection } from "../src/methods";
import config from "../src/config";
import { Client, TextChannel } from "discord.js";
import { sleep } from "../src/utils";
import { Test, Message_Test } from "./tests";
const token: string = require("dotenv").config().parsed.UNIT_TEST_TOKEN;

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
