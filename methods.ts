import {database_response} from "./types"
import axios from "axios"
import { Message } from "discord.js"

export async function get_question(){
    const question:database_response = ((await axios.get("https://scibowldb.com/api/questions/random")).data).question
    return question
}
export function async_collection(msg:Message, check:(m:Message)=>boolean):Promise<{success?:boolean,message?:Message}>{
    return new Promise( (resolutionFunc,_) => {
        //@ts-ignore
        const collector:MessageCollector = new Discord.MessageCollector(msg.channel, m => m.author.id === msg.author.id, { time: 5e3 });
        collector.on('collect', async(message:Message) => {
            if(check(message)){
                resolutionFunc({success:true, message})
            }
            resolutionFunc({success:false, message})
        })
    })
}