import { LinksService } from "../../links/links.service";
import { DiscordBot } from "./discord-bot";

export const discordBotFactory = {
  provide: 'DiscordBot',
  useFactory: async (linksService: LinksService) => {
    const bot = new DiscordBot(linksService);
    await bot.start();
    return bot;
  },
  inject: [LinksService]
}
