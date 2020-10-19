import {json_embed} from "../discord_utils/embeds"
import {Message} from "discord.js"
import {my_client, command_parsed_output} from "../types"
import axios from "axios"
const Discord = require('discord.js');

interface database_response {
    question: {
        api_url: string,
        bonus_answer: string,
        bonus_format: "Multiple Choice"| "Short Answer",
        bonus_question:string,
        category: string,
        id: number,
        search_vector:string,
        source: string,
        tossup_answer: string,
        tossup_format: string,
        tossup_question: string,
        uri: string
    }
}
export default {
    description:"Get a random question",
    alias: new Set(["question","newquestion","q"]),
    run:async (command_parsed:command_parsed_output, msg:Message, client:my_client)=>{
        const question:database_response = (await axios.get("https://scibowldb.com/api/questions/random")).data
        await msg.reply(`question:${question.question.tossup_question}`)
        //@ts-ignore
        const collector = new Discord.MessageCollector(msg.channel, m => m.author.id === msg.author.id, { time: 20000 });
        collector.on('collect', async(message:Message) => {
            if(message.content === question.question.tossup_answer){
                msg.reply( "correct")
            }
            msg.reply("incorrect"+question.question.tossup_answer)
        })
    }
}