//import modules
import { my_client, test } from "../src/types";
const TEST_SERVER_ID = "698693014628859955";
const TEST_CHANNEL_ID = "771899161733758996";
import { async_collection } from "../src/methods";
import config from "../src/config";
import { Client, Guild, Message, GuildChannel } from "discord.js";

export async function message_test(client: Client, message: string) {
  // console.log("message_test called");
  const found_channel = await client.channels.fetch(TEST_CHANNEL_ID);
  // console.log("client.guilds.cache is.", client.guilds.cache);
  // const found_guild = client.guilds.cache.find(
  //   (guild: Guild) => guild.id === TEST_SERVER_ID
  // );
  // console.log("found_guild is", found_guild);
  // console.log("I can see the channels", found_guild.channels.cache);
  // const found_channel = found_guild.channels.cache.find(
  //   (channel: GuildChannel) => channel.id === TEST_CHANNEL_ID
  // );
  // console.log("found_channel is", found_channel);
  //@ts-ignore
  const msg = await found_channel.send(message);
  const response_message = async_collection(
    msg,
    (m) => true,
    (m) => m.author.id === config.bot_id,
    5e3
  );
  return (await response_message).message;
}
export async function run_tests(client: Client, tests: Array<test>) {
  const token: string = require("dotenv").config().parsed.UNIT_TEST_TOKEN;
  await client.login(token);

  // console.log("run_tests called with", tests);
  for (const test of tests) {
    let result = false;
    if (test.type === "message") {
      const response_message = await message_test(client, test.message);
      if (response_message) {
        result = test.check(response_message);
      }
    }
    if (result) {
      console.log(`${test.name} succeeded`);
    } else {
      console.log(`${test.name} failed`);
    }
  }
  process.exit(0);
}
