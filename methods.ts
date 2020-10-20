import {database_response, subjects} from "./types"
import axios from "axios"
import { Message } from "discord.js"
const Discord = require("discord.js")
export async function get_question(topic?:Array<subjects>){
    if(topic){
        const topic_question:database_response = ((await axios.post("https://scibowldb.com/api/questions/random",{
             "categories": topic
        })).data).question
        return topic_question
    }else{
        const question:database_response = ((await axios.get("https://scibowldb.com/api/questions/random")).data).question
        return question
    }
}

export function check_answer(answer:string, response:string): boolean{
    answer = answer.toLowerCase()
    response = response.toLowerCase()
    //case if question is multiple choice
    if (["w","x","y","z"].indexOf(answer.charAt(0)) > -1) {
        if (response === answer.charAt(0)){
            //if person correctly answered with the letter
            return true
        } else if (response === answer.slice(answer.indexOf(" ") + 1)) {
            // if the person correctly answered with the answer
            return true
        }
    }
    //case if answer has "also accept"
    if(answer.indexOf("(ACCEPT:")>-1){
        const alertnate_answer = answer.match(/(?<=\(ACCEPT\:)[^\)]*\)/g)[0]
        if(response ===alertnate_answer.toLowerCase() ){
            return true
        }
    }
    return response === answer;
}

export function async_collection(msg:Message, check:(m:Message)=>boolean, filter:(m:Message)=>boolean):Promise<{success?:boolean,message?:Message}>{
    return new Promise( (resolutionFunc,_) => {
        //@ts-ignore
        const collector:MessageCollector = new Discord.MessageCollector(msg.channel,filter, { time: 5e3 });
        collector.on('collect', async(message:Message) => {
            if(check(message)){
                resolutionFunc({success:true, message})
            }
            resolutionFunc({success:false, message})
        })
        collector.on("end", ()=>{
            resolutionFunc({success:false})
        })
    })
}
