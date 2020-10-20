import {json_embed} from "../discord_utils/embeds"
import {Message, MessageCollector, Channel} from "discord.js"
import {my_client, command_parsed_output} from "../types"
const Discord = require('discord.js');
import {get_question, async_collection} from "../methods"

export default {
    description:"start a team round",
    alias: new Set(["start_team"]),
    run:async (command_parsed:command_parsed_output, msg:Message, client:my_client)=>{
        let round_points = {team_a:0,team_b:0}
        await msg.reply("give me the members of team one, as a comma separated list of pings")
        const team_1:string =  ((await msg.channel.awaitMessages((m:Message)=>(m.author.id === msg.author.id), { max: 1, time: 30000, errors: ['time']})).array()[0]).content
        const parsed_team_1 = new Set(team_1.split(",").map(member=>member.substr(2,member.length-1)))
        await msg.reply("give me the members of team two, as a comma separated list of pings")
        const team_2:string =  ((await msg.channel.awaitMessages((m:Message)=>(m.author.id === msg.author.id), { max: 1, time: 30000, errors: ['time']})).array()[0]).content
        const parsed_team_2 = new Set(team_2.split(",").map(member=>member.substr(2,member.length-1)))
        // there are 13 questions in a scibowl round
        for(let question_number = 0;question_number<13;question_number++ ){
            const question = await get_question()
            await msg.channel.send(`Question ${question_number} \n ${question.tossup_question}`)
            const response = await async_collection(
                msg, 
                (m:Message)=>m.content === question.tossup_answer,
                (m:Message)=>parsed_team_1.has(m.author.id) || parsed_team_2.has(m.author.id),
            )  
            if(response.success)
                response.message.reply(`correct, score is ${parsed_team_1.has( response.message.author.id) ? round_points.team_a++ :round_points.team_b++ }`)
            else
                response.message.reply(`no, correct answer was ${question.tossup_answer}`)
            
            await msg.channel.send(`team round \n end of question ${question_number} points are ${
            JSON.stringify(round_points)}`)
        }
    }
}