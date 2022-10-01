//import modules
import { my_client } from "./types";
const Discord = require("discord.js");
const client: my_client = new Discord.Client();
const fs = require("fs");
const token: string = require("dotenv").config().parsed.TOKEN;
import { get_directories } from "./utils";
export async function main() {
  //check for discord bot tokn
  if (!token) {
    console.log("no bot token found");
    process.exit(1);
  }
  //set up commands
  client.commands = new Discord.Collection();
  get_directories("./src/commands", async (_: Error, res: Array<string>) => {
    console.log(res);
    for (const file of res) {
      const fileName: string = file
        .substring(0, file.length - 3)
        .match(/([^\/]+$)/g)[0];
      const trimmed = file.substring(2, file.length - 3);
      // Removes last three characters from file name to get rid of the .js extension (which should™ be .js ^^) for propper file name.
      const fileContents = await import(`${process.cwd()}/dist/${trimmed}.js`); // Defines fileContents of the export of the command in question.
      console.log(`${process.cwd()}/dist/${trimmed}`)
      client.commands.set(fileName, fileContents.default); // Adds the command name to the client.commands collection with a value of it's respective exports.
    }
    //console.log(res);
  });
  //set up for each event
  for (const file of fs.readdirSync("./dist/src/events/")) {
    // Iterates through every file in the ./events/ folder.
    if (!file.endsWith(".js") && !file.endsWith(".ts")) continue;
    const fileName: string = file.substring(0, file.length - 3); // Removes last three characters from file name to get rid of the .js extension (which should™ be .js ^^) for propper file name.
    const fileContents = await import(`./events/${file}`); // Defines fileContents of the export of the event in question.
    console.log(`./events/${file}`)
    //@ts-ignore
    client.on(fileName, fileContents.default.bind(null, client)); // Set's the event of whatever the file name is to the bound function of said export (this will automatically make the first parmater of the export function to client.
  }
  await client.login(token); //log in with bot
  return client;
}
if (require.main === module) {
  main();
}
