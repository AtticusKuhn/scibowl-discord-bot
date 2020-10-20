import {database_response} from "./types"
import axios from "axios"

export async function get_question(){
    const question:database_response = ((await axios.get("https://scibowldb.com/api/questions/random")).data).question
    return question
}