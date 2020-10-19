import { Client, Collection,Message, GuildEmbedData  } from 'discord.js';

export interface config_interface {

    prefix:string
}
export interface command {
    min_args: Number,
    max_args: Number,
    args:number,
    form:string,
    description:string,
    alias:Set<string>,
    sample_usage:string,
    run: (command_parsed: command_parsed_output, msg: Message, client:my_client) =>GuildEmbedData | string
}
export interface my_client extends Client {
   commands?: Collection<string,command>; 
}
export interface command_parsed_output{
    success?: boolean;
    title?: string | undefined;
    error_message?: string | undefined;
    form?: string;
    command?: undefined| command;
    args?: undefined| string[]
} 


