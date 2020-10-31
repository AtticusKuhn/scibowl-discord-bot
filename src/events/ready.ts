import config from "../config";
import { my_client } from "../types";

export default function run(client: my_client) {
  // Function for when client has logged in.
  client.user.setPresence(
    // Set's presence data to following object \/
    {
      status: "online", // Makes status "online", (Green Bubble).
      afk: false, // Sets AFK to false, even though it's useless on bots....
      //   game: { // Game object.
      //     name: "name", // Set's game name to the statusMessage value of the config file.
      //     url: null, // Set's the game's URL to null because this is a PLAYING presence.
      //     type: "PLAYING" // Set's game type to "Playing ..." This is pretty easy to change and cool so here's a doc: https://discord.js.org/#/docs/main/stable/typedef/ActivityType
      //   }
    }
  );

  console.log(`logged in as ${client.user.tag}`);
}
