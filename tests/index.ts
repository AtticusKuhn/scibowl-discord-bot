import { run_tests } from "./test_methods";
import generate_tests from "./tests";
import { Client } from "discord.js";
import { main } from "../src/index";
const Discord = require("discord.js");
const test_client = new Discord.Client();

main().then(async (bot_client) => {
  run_tests(test_client, await generate_tests(bot_client));
});
