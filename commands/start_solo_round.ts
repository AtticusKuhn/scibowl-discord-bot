import {json_embed} from "../discord_utils/embeds"
import {Message, MessageCollector} from "discord.js"
import {my_client, command_parsed_output, database_response} from "../types"
const Discord = require('discord.js');
import {get_question, check_answer} from "../methods"
function async_collection(msg:Message,question:database_response){
    return new Promise( (resolutionFunc,_) => {
        const collector:MessageCollector = new Discord.MessageCollector(msg.channel, (m:Message) => m.author.id === msg.author.id, { time: 5e3 });
        collector.on('collect', async(message:Message) => {
            if(check_answer(question.tossup_answer,message.content )){
                resolutionFunc({success:true, message})
            }
            resolutionFunc({success:false, message})
        })
    })
}
export default {
    description:"Get a random question",
    alias: new Set(["solo"]),
    run:async (command_parsed:command_parsed_output, msg:Message, client:my_client)=>{
        let score = 0
        for(let question_number =0;question_number<13;question_number++){
            const question = await get_question()
            await msg.reply(`question number  ${question_number} \n:${question.tossup_question}`)
            const response:{success?:boolean, message?:Message} = await async_collection(msg, question)
            if(response.success){
                await msg.reply(`success, score is ${score++}`)
                await msg.reply(`BONUS: ${question.bonus_question}`)
                const bonus_response:{success?:boolean, message?:Message} = await async_collection(msg, question)
                if(bonus_response.success){
                    await msg.reply(`success, score is ${score++}`)
                }else{
                    await msg.reply(`incorrect: ${question.bonus_answer}`)
                }
            }else{
                await msg.reply(`incorrect: ${question.tossup_answer}`)
            }
        }
        return `Final score is ${score}`
    }
}