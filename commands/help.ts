import {json_embed} from "../discord_utils/embeds"
import {Message} from "discord.js"
import {my_client, command_parsed_output} from "../types"
export default {
    description:"this shows all availiable commands",
    form: "<anything>",
    run:(command_parsed:command_parsed_output, msg:Message, client:my_client)=>{
        const commands_json:any = {}
        for(const[command, value] of client.commands){
            commands_json[command] = value.description
        }
        return json_embed(commands_json)
    }
}