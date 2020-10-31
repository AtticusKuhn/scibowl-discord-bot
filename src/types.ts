import { Client, Collection, Message, GuildEmbedData } from "discord.js";

export interface config_interface {
  prefix: string;
}
export enum subjects {
  "PHYSICS",
  "GENERAL SCIENCE",
  "ENERGY",
  "EARTH AND SPACE",
  "EARTH SCIENCE",
  "CHEMISTRY",
  "BIOLOGY",
  "ASTRONOMY",
  "MATH",
  "COMPUTER SCIENCE",
}
export interface command {
  min_args: Number;
  max_args: Number;
  args: number;
  form: string;
  description: string;
  alias: Set<string>;
  sample_usage: string;
  run: (
    command_parsed: command_parsed_output,
    msg: Message,
    client: my_client
  ) => GuildEmbedData | string;
}
export interface my_client extends Client {
  commands?: Collection<string, command>;
}
export interface command_parsed_output {
  success?: boolean;
  title?: string | undefined;
  error_message?: string | undefined;
  form?: {
    [key: string]: string;
  };
  command?: undefined | command;
  args?: undefined | string[];
}
//type api_url =`https://scibowldb.com/api/questions/random${String}`;

export interface database_response {
  api_url: string;
  bonus_answer: string;
  bonus_format: "Multiple Choice" | "Short Answer";
  bonus_question: string;
  category: subjects;
  id: number;
  search_vector: string;
  source: string;
  tossup_answer: string;
  tossup_format: string;
  tossup_question: string;
  uri: string;
}
export interface test {
  type: string;
  check: (args: any) => boolean | Promise<boolean>;
  name: string;
  message?: string;
}
