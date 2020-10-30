import { json_embed, simple_embed } from "../discord_utils/embeds";
import { Message } from "discord.js";
import { my_client, command_parsed_output, command } from "../types";
export default {
  description: "this shows all availiable commands",
  form: "<command>",
  alias: new Set(["h"]),
  run: async (
    command_parsed: command_parsed_output,
    msg: Message,
    client: my_client
  ) => {
    if (command_parsed.form.command) {
      const found_command =
        client.commands.get(command_parsed.form.command) ||
        client.commands.find((c: command) =>
          c.alias ? c.alias.has(command_parsed.form.command) : false
        ); //check if command is an actual comamnd
      if (!found_command) {
        return simple_embed(
          "can't find",
          false,
          "not a real command type help to see all commands"
        );
      }
      let formatted: any = found_command;
      delete formatted.run;
      formatted.alias = [...found_command.alias].join(", ");
      return json_embed(formatted);
    }
    const commands_json: { [command: string]: string } = {};
    for (const [command, value] of client.commands) {
      commands_json[command] = value.description;
    }
    return json_embed(commands_json);
  },
};
