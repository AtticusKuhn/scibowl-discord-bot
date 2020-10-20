import {json_embed} from "../discord_utils/embeds"
import {Message, MessageCollector, Channel} from "discord.js"
import {my_client, command_parsed_output} from "../types"
const Discord = require('discord.js');
import {get_question} from "../methods"
function async_collect(msg: Message, client:my_client, question:any){
    let already_answered = new Set()
    return new Promise( (resolutionFunc,rejectionFunc) => {
        const collector:MessageCollector = msg.channel.createMessageCollector((m:Message)=>m.author.id !== client.user.id && !already_answered.has(msg.author.id), { time: 15000, max:2 });
        let counts = 0 
        collector.on('collect', (m:Message) => {
            already_answered.add(msg.author.id)
            console.log(`Collected ${m.content}`);
            if(m.content===question.tossup_answer){
                resolutionFunc( {success:true, m})
            }
            msg.reply("incorrect")
            counts++
            if(counts >=2){
                resolutionFunc( {success:false, m})
            }
        });
        collector.on("end", collected => {
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
            await msg.channel.send(`Tossup number ${question_number} \n ${question.tossup_question}`)
            const collector:MessageCollector = msg.channel.createMessageCollector((m:Message)=>m.author.id !== client.user.id, { time: 15000, max:2 });
            // collector.on('collect', (m:Message) => {
            //     console.log(`Collected ${m.content}`);
            //     if(m.content===question.tossup_answer){
            //         m.reply("correct")
            //         round_points[m.author.id] == (round_points[m.author.id] ?? 0) + 1
            //         return
            //     }
            //     m.reply("incorrect")
            // });
            const result:any = await async_collect(msg,client, question)
            if(result.success){
                round_points[result.m.author.id] == (round_points[result.m.author.id] ?? 0) + 1
                result.m.reply("correct")
            }
            await msg.channel.send(`end of question ${question_number} points are ${
                Object.keys(round_points).length > 0
                ? Object.keys(round_points).map((key)=> `<@${key}> - ${round_points[key]}`)
                :"no points"}`)
        }
    }
}