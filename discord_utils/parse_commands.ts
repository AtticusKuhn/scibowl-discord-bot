import { command } from "../types"

function parse_commands(msg: string, found_command:command){
    //check the number of arguments supplied
    const command_args: Array<string>= msg.match(/(```(.|\n)*?```|\S+)/g).slice(1)// this regex splits on spaces but does not distrub code blocks
        if(found_command.args && command_args.length != found_command.args){
        return{
            success:false,
            error_message:`incorrect number of arguments. I exprected ${found_command.args}, but got ${command_args.length}`,
            title:"args error"
        }
    }
    if(found_command.min_args && command_args.length < found_command.min_args){
        return{
            success:false,
            title:"args error",
            error_message:`incorrect number of arguments. I exprected at least ${found_command.min_args}, but got ${command_args.length}`
        }
    }
    if(found_command.max_args && command_args.length < found_command.max_args){
        return{
            success:false,
            title:"args error",
            error_message:`incorrect number of arguments. I exprected at most ${found_command.max_args}, but got ${command_args.length}`
        }
    }
    //check for form
    if(found_command.form){
        const form:{[key:string]:string}= {}
        const form_captures:Array<string> = found_command.form.match(/(\[.*?\]|\<.*?\>|\S+)/g)
        
        //for(const [index, argument] of form_captures.entries()){
        let word_index = 0
        for(let index = 0; index < form_captures.length;index++){
            const argument = form_captures[index]
            let name = argument.split(":")[0].substring(1)
            name = name.replace(/]/g,"")
            name = name.replace(/>/g,"")
            if(argument.startsWith("[") && index >=  command_args.length){
                return{
                    success:false,
                    title:"missing error",
                    error_message:`Missing Argument: ${name}`
                }
            }
            if(argument.startsWith("<") && index >=  command_args.length){
                break
            }
            if(argument.indexOf(":")>-1){
                const datatype = argument.split(":")[1].slice(0,-1)
                switch(datatype) {
                    case "number":{
                        if(isNaN(Number(command_args[word_index]))){
                            return{
                                success:false,
                                title:"type error",
                                error_message:`The argument ${name} expected a number, but got ${command_args[index]}`
                            }
                        }
                        break
                    }
                    case "int":{
                        if(Number(command_args[word_index]) %1 != 0){
                            return{
                                success:false,
                                title:"type error",
                                error_message:`The argument ${name} expected a integer, but got ${command_args[index]}`
                            }
                        }
                        break;
                    }
                    case "ping":{
                        if(!/^<@\!?\d{18}>$/.test(command_args[word_index])){
                            return{
                                success:false,
                                title:"type error",
                                error_message:`The argument ${name} expected a ping, but got ${command_args[index]}`
                            }
                        }
                        break
                    }
                    case "block":{
                        if( !(command_args[word_index].startsWith("```") && command_args[word_index].endsWith("```"))  ){
                            return{
                                success:false,
                                title:"type error",
                                error_message:`The argument ${name} expected a code block, but got ${command_args[index]}`
                            }
                        }
                        break
                    }
                    case "greedy":{
                        //console.log("index",index)
                        //console.log("command_args.length+index-form_captures.length",command_args.length+index-form_captures.length)
                        form[name] = command_args.slice(index, command_args.length+index-form_captures.length).join(" ")
                        word_index = command_args.length+index-form_captures.length
                        //console.log("new index is",index)
                    }
                }
                if(datatype.includes("|")){
                    const options: string[] = datatype.split("|")
                    if(!options.includes(command_args[index])){
                        return{
                            success:false,
                            title:"type error",
                            error_message: `The arguement ${name} expects one of the options ${options}, but it got ${command_args[index]}`
                        }
                    }
                }
            }
            if(!form[name])
                form[name] = command_args[index]
            word_index++
        }
        return{
            success:true,
            form:form,
            command:found_command,
            args:command_args
        }
    }
    return{
        success:true,
        command:found_command,
        args:command_args
    }
}


export default parse_commands