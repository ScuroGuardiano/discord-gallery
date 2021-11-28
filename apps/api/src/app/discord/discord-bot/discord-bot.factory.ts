import { IndexSchedulerService } from "../../index-scheduler/index-scheduler.service";
import { LinksService } from "../../links/links.service";
import { DiscordBot } from "./discord-bot";

export const discordBotFactory = {
  provide: 'DiscordBot',
  useFactory: async (linksService: LinksService, indexShedulerService: IndexSchedulerService) => {
    const bot = new DiscordBot(linksService, indexShedulerService);
    await bot.start();
    return bot;
  },
  inject: [LinksService, IndexSchedulerService]
}
