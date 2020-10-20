import {json_embed} from "../discord_utils/embeds"
import {Message, MessageCollector} from "discord.js"
import {my_client, command_parsed_output} from "../types"
const Discord = require('discord.js');
import {get_question,async_collection} from "../methods"


export default {
    description:"Get a random question",
    alias: new Set(["question","newquestion","q"]),
    run:async (command_parsed:command_parsed_output, msg:Message, client:my_client)=>{
        const question = await get_question()
        await msg.reply(`question:${question.tossup_question}`)
        console.log("given question")
        const response = await async_collection(msg, (msg:Message)=>msg.content === question.tossup_answer)
        if(response.success){
            return "sucess you are correct"
        }else{
            return `no, the correct answer was ${question.tossup_answer}`
        }
    }
}