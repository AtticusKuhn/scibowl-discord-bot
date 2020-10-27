import {json_embed, simple_embed} from "../discord_utils/embeds"
import {Message, MessageCollector, Channel} from "discord.js"
import {my_client, command_parsed_output} from "../types"
import {check_answer} from "../methods"
const Discord = require('discord.js');
import {get_question} from "../methods"
function async_collect(msg: Message, client:my_client, question:any){
    let already_answered = new Set()
    return new Promise( (resolutionFunc,_) => {
        const collector:MessageCollector = msg.channel.createMessageCollector((m:Message)=>m.author.id !== client.user.id && !already_answered.has(msg.author.id), { time: 15000, max:2 });
        let counts = 0 
        collector.on('collect', (m:Message) => {
            already_answered.add(msg.author.id)
            console.log(`Collected ${m.content}`);
            if(check_answer(question.tossup_answer, m.content)){
                resolutionFunc( {success:true, m})
            }
            m.reply(simple_embed("no",false,"incorrect"))
            counts++
            if(counts >=2){
                resolutionFunc( {success:false, m})
            }
        });
        collector.on("end", _ => {
            resolutionFunc({success:false})
        })
    });
}
export default {
    description:"start a ffa round",
    alias: new Set(["start"]),
    run:async (command_parsed:command_parsed_output, msg:Message, client:my_client)=>{
        let round_points:any = {}
        // there are 13 questions in a scibowl round
        for(let question_number = 0;question_number<13;question_number++ ){
            const question = await get_question()
            await msg.channel.send(simple_embed("fffa",true,` ffa_round \n Tossup number ${question_number} \n ${question.tossup_question}`))
            const result:{success?:boolean, m?:Message} = await async_collect(msg,client, question)
            if(result.success){
                round_points[result.m.author.id] == (round_points[result.m.author.id] ?? 0) + 1
                result.m.reply(simple_embed("yay",true,"correct"))
            }else{
                await msg.channel.send(simple_embed("no answer",false,`no one got the correct answer, it was ${question.tossup_answer}`))
            }
            await msg.channel.send(simple_embed("end",true,` ffa_round \n end of question ${question_number} points are ${
                Object.keys(round_points).length > 0
                ? Object.keys(round_points).map((key)=> `<@${key}> - ${round_points[key]}`)
                :"no points"}`))
        }
    }
}