import { json_embed } from "../../../discord_utils/embeds";
import { Client, Message } from "discord.js";
import { command_parsed_output, my_client } from "../../../types";

export default {
  description: "show the bot dashboard",
  args: 0,
  alias: new Set(["dash"]),
  admin: true,
  run: async (
    command_parsed: command_parsed_output,
    msg: Message,
    client: my_client
  ) => {
    let date = new Date(0);
    date.setSeconds((new Date().getTime() - client.startup_time) / 1e3);
    const readable_date = date.toISOString().substr(11, 8);
    return json_embed({
      servers: client.guilds.cache.size,
      uptime: `:green_circle: Online for ${readable_date}`,
      "commands responded": client.commands_responded,
    });
  },
};
