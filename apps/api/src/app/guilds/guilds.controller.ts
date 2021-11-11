import { Controller, Get, Param } from '@nestjs/common';
import IChannel from '../discord/channel';
import { DiscordService } from '../discord/discord.service';
import { LinksService } from '../links/links.service';

@Controller('guilds')
export class GuildsController {
  constructor(
    private discordService: DiscordService,
    private linksService: LinksService
  ) {}

  @Get(':linkId')
  async getChannels(@Param('linkId') linkId: string): Promise<IChannel[]> {
    const link = await this.linksService.GetLinkByLinkId(linkId);
    let channels = await this.discordService.getGuildChannelList(link.guildId);

    if (link.channelId) {
      channels = channels.filter(channel => channel.snowflake === link.channelId);
    }

    return channels;
  }
}
