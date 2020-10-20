import {json_embed} from "../discord_utils/embeds"
import {Message, MessageCollector} from "discord.js"
import {my_client, command_parsed_output} from "../types"
const Discord = require('discord.js');
import {get_question} from "../methods"

export default {
    description:"start a ffa round",
    alias: new Set(["start"]),
    run:async (command_parsed:command_parsed_output, msg:Message, client:my_client)=>{
        let round_points:any = {}
        // there are 13 questions in a scibowl round
        for(let question_number = 0;question_number<13;question_number++ ){
            const question = await get_question()
            await msg.reply(`Tossup number ${question_number} \n ${question.tossup_question}`)
            const collector:MessageCollector = msg.channel.createMessageCollector(()=>true, { time: 15000, max:2 });
            collector.on('collect', (m:Message) => {
                console.log(`Collected ${m.content}`);
                if(m.content===question.tossup_answer){
                    m.reply("correct")
                    round_points[m.author.id] == (round_points[m.author.id] ?? 0) + 1
                    return
                }
                m.reply("incorrect")
            });
            await msg.reply(`end of question ${question_number} points are ${Object.keys(round_points).map((key)=> `<@${key}> - ${round_points[key]}\n`)}`)
        }
    }
}