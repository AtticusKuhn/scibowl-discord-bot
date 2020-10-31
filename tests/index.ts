import { run_tests } from "./test_methods";
import tests from "./tests";
import { Client } from "discord.js";
import { main } from "../src/index";
const Discord = require("discord.js");
const test_client = new Discord.Client();

main().then(() => {
  run_tests(test_client, tests);
});
