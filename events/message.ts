import config from "../config"
import parse_commands from "../discord_utils/parse_commands" 
import embeds from "../discord_utils/embeds"
import {Message} from 'discord.js';
import {my_client,command} from "../types"

export default async function  run (client: my_client, msg:Message) { // Function for when a message is sent. "message" = the message object of said new message.
    if (msg.author.bot) return //bot should not interact with other bots
    if (!msg.content.startsWith(config.prefix)) return //bot only responds to messages beggining with prefix
    if(!config.case_sensitive) msg.content = msg.content.toLowerCase()
    if(config.remove_duplicate_spaces) msg.content = msg.content.replace(/\s+/g," ")
    const trimmed:string = msg.content.substr(config.prefix.length)//remove prefix from command
    const command:string = trimmed.split(" ")[0]
    const found_command:command = client.commands.get(command)|| client.commands.find((c:command) => c.alias ? c.alias.has(command) : false )//check if command is an actual comamnd
    if(!found_command){
        msg.reply(embeds.simple_embed("Unkown Command",false,  `not a valid command. To see a list of possible commands, type ${config.prefix}help`))
        return
    }
    const command_parsed = parse_commands(trimmed,found_command)
    if(!command_parsed.success){
        msg.reply(embeds.simple_embed(command_parsed.title,  false,
        `${command_parsed.error_message}${found_command.sample_usage?"\n Sample usage:  "+found_command.sample_usage:""}${found_command.form?`\n General Form:  `+found_command.form:""}`
        ))
        return
    }else{
        msg.reply(await command_parsed.command.run(command_parsed, msg, client))
    }
}