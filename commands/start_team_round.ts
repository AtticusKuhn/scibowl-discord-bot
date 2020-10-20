import {json_embed} from "../discord_utils/embeds"
import {Message, MessageCollector, Channel} from "discord.js"
import {my_client, command_parsed_output} from "../types"
const Discord = require('discord.js');
import {get_question} from "../methods"

export default {
    description:"start a team round",
    alias: new Set(["start_team"]),
    run:async (command_parsed:command_parsed_output, msg:Message, client:my_client)=>{
        let round_points = {team_a:0,team_b:0}
        await msg.reply("give me the members of team one, as a comma separated list of pings")
        const team_1:string =  ((await msg.channel.awaitMessages((m:Message)=>(m.author.id === msg.author.id), { max: 1, time: 30000, errors: ['time']})).array()[0]).content
        const parsed_team_1 = team_1.split(",").map(member=>member.substr(2,member.length-1))
        await msg.reply("give me the members of team two, as a comma separated list of pings")
        const team_2:string =  ((await msg.channel.awaitMessages((m:Message)=>(m.author.id === msg.author.id), { max: 1, time: 30000, errors: ['time']})).array()[0]).content
        const parsed_team_2 = team_2.split(",").map(member=>member.substr(2,member.length-1))
        // there are 13 questions in a scibowl round
        for(let question_number = 0;question_number<13;question_number++ ){
      
        }
    }
}