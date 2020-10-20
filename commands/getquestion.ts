import {json_embed} from "../discord_utils/embeds"
import {Message, MessageCollector} from "discord.js"
import {my_client, command_parsed_output} from "../types"
const Discord = require('discord.js');
import {get_question} from "../methods"
export default {
    description:"Get a random question",
    alias: new Set(["question","newquestion","q"]),
    run:async (command_parsed:command_parsed_output, msg:Message, client:my_client)=>{
        const question = await get_question()
        const firstLetter = question.tossup_answer.charAt(0).toLowerCase()
        await msg.reply(`question:\n${question.tossup_question}`)
        console.log(question.tossup_answer)
        //@ts-ignore
        const collector:MessageCollector = new Discord.MessageCollector(msg.channel, m => m.author.id === msg.author.id, { time: 5e3 });
        collector.on('collect', async(message:Message) => {
            if(message.content === question.tossup_answer){
                msg.reply("correct")
            } else if((firstLetter === "w" || firstLetter === "x" || firstLetter === "y" || firstLetter === "z") && message.content.toLowerCase() === firstLetter) {
                msg.reply("correct")
            } else{
                msg.reply("incorrect: " + question.tossup_answer)
            }
        })
    }
}