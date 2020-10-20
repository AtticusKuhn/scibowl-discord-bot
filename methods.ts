import {database_response} from "./types"
import axios from "axios"
import { Message } from "discord.js"
const Discord = require("discord.js")
export async function get_question(){
    const question:database_response = ((await axios.get("https://scibowldb.com/api/questions/random")).data).question
    return question
}

export function check_answer(answer:string, response:string){
    answer = answer.toLowerCase()
    response = response.toLowerCase()
    if (["w","x","y","z"].indexOf(answer.charAt(0)) > -1) {
        if (response === answer.charAt(0)){
            return true
        } else if (response === answer.slice(answer.indexOf(" ") + 1)) {
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