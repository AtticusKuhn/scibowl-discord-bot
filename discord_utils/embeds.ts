const Discord = require('discord.js');
import config from ".././config"
import {MessageEmbed} from "discord.js"

export function simple_embed(title:string, success:boolean=true, message:string){
    const example_embed:MessageEmbed = new Discord.MessageEmbed()
        .setColor(success ? config.success_color : config.failure_color)
        .setTitle(title)
        .setURL('https://repl.it/@AtticusKuhn/Sample-discordjs-template')
        .setDescription(message)
        .setThumbnail('https://storage.googleapis.com/replit/images/1578865152393_256089a828f3a4aad28080aba5e80078.jpeg')
        .setTimestamp()
        .setFooter('Some footer text here', 'https://storage.googleapis.com/replit/images/1578865152393_256089a828f3a4aad28080aba5e80078.jpeg');
    return example_embed
}

export function json_embed(json:any){
    const example_embed = new Discord.MessageEmbed()
        .setColor(config.success_color)
        .setTitle("sample bot")
        .setURL('https://repl.it/@AtticusKuhn/Sample-discordjs-template')
        .setThumbnail('https://storage.googleapis.com/replit/images/1578865152393_256089a828f3a4aad28080aba5e80078.jpeg')
        .setTimestamp()
        .setFooter('Some footer text here', 'https://storage.googleapis.com/replit/images/1578865152393_256089a828f3a4aad28080aba5e80078.jpeg');
    for(const key of Object.keys(json)){
        example_embed.addField(key, json[key], true)
    }
    return example_embed
}

export default {simple_embed,json_embed}
function flatten(array:Array<any>):Array<any>{
    if(array.length == 0)
        return array;
    else if(Array.isArray(array[0]))
        return flatten(array[0]).concat(flatten(array.slice(1)));
    else
        return [array[0]].concat(flatten(array.slice(1)));
}

// @ts-ignore
Array.prototype.flat = function(){
    return flatten(this)
}