//import modules
import {my_client} from "./types"
const Discord = require("discord.js")
const client:my_client = new Discord.Client();
const fs = require("fs")
const token:string =  require('dotenv').config().parsed.TOKEN
//check for discord bot tokn
if(!token){
    console.log("no bot token found")
    process.exit(1)
}
//set up commands
client.commands = new Discord.Collection(); 
for(const file of fs.readdirSync('./commands/')) { // Iterates through every file in the ./commands/ folder.
    if(!file.endsWith(".js") && !file.endsWith(".ts") ) // This is to prevent any files that aren't .js files from being processed as a command.
        continue
    const fileName:string = file.substring(0, file.length - 3); // Removes last three characters from file name to get rid of the .js extension (which should™ be .js ^^) for propper file name.
    const fileContents = require(`./commands/${file}`); // Defines fileContents of the export of the command in question.
    client.commands.set(fileName, fileContents.default); // Adds the command name to the client.commands collection with a value of it's respective exports.
}
//set up for each event
for(const file of fs.readdirSync('./events/')) { // Iterates through every file in the ./events/ folder.
    if(!file.endsWith(".js")&& !file.endsWith(".ts")) 
        continue
    const fileName:string = file.substring(0, file.length - 3); // Removes last three characters from file name to get rid of the .js extension (which should™ be .js ^^) for propper file name.
    const fileContents= require(`./events/${file}`); // Defines fileContents of the export of the event in question.
    //@ts-ignore
    client.on(fileName, fileContents.default.bind(null, client)); // Set's the event of whatever the file name is to the bound function of said export (this will automatically make the first parmater of the export function to client.
}
client.login(token)//log in with bot
""// get rid of implicit printing 
