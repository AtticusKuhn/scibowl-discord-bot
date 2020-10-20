import {json_embed} from "../discord_utils/embeds"
import {Message, MessageCollector} from "discord.js"
import {my_client, command_parsed_output} from "../types"
const Discord = require('discord.js');
const discordTTS=require("discord-tts");
import {get_question, async_collection} from "../methods"

export default {
    description:"Get a random question",
    alias: new Set(["question","newquestion","q"]),
    run:async (command_parsed:command_parsed_output, msg:Message, client:my_client)=>{
        const question = await get_question()
        const voiceChannel = msg.member.voice.channel;
        if(!voiceChannel){
            return "you must be in a voice channel to use this command"
        }
        voiceChannel.join().then(connection => {
            const stream = discordTTS.getVoiceStream(question.tossup_question);
            const dispatcher = connection.play(stream);
            dispatcher.on("finish",()=>voiceChannel.leave())
        });       
        const response = await async_collection(msg, (msg)=>msg.content === question.tossup_answer)
        if(response.success){
            return "sucess you are correct"
        }else{
            return `no, the correct answer was ${question.tossup_answer}`
        }
    }
}