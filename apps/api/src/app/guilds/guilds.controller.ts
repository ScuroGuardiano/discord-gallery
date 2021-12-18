import { Controller, Get, HttpException, HttpStatus, Param, Query, UseFilters } from '@nestjs/common';
import { TextChannel } from 'discord.js';
import { DiscordService } from '../discord/discord.service';
import { IndexManagerService } from '../index-manager/index-manager.service';
import { IndexSchedulerService } from '../index-scheduler/index-scheduler.service';
import LinkErrorFilter from '../links/filters/link-error.filter';
import { LinksService } from '../links/links.service';
import { IGalleryQuery, IGuildLinkInfo, IMediaElementDTO } from '@discord-gallery/api-interfaces';
import { indexEntryToMediaElementDTO } from './media-element-dto';

@Controller('guilds')
export class GuildsController {
  constructor(
    private discordService: DiscordService,
    private linksService: LinksService,
    private indexManager: IndexManagerService,
    private indexScheduler: IndexSchedulerService
  ) {}

  @Get(':linkId')
  @UseFilters(LinkErrorFilter)
  async getGuildLinkInfo(@Param('linkId') linkId: string): Promise<IGuildLinkInfo> {
    const link = await this.linksService.GetLinkByLinkId(linkId);
    const { guildId, channelId } = link;
    const guild = await this.discordService.getGuildById(guildId);
    if (!guild) {
      throw new HttpException('Link is invalid, can\'t access guild', HttpStatus.BAD_REQUEST);
    }
    const channel = await this.discordService.getChannelById(guild, channelId);
    if (!channel) {
      throw new HttpException('Link is invalid, can\'t acccess channel', HttpStatus.BAD_REQUEST);
    }

    const lastJobFinish = await this.indexScheduler.getLastFinishedJobTime(guildId, channelId);
    const mediaCount = await this.indexManager.countIndexEntries(guildId, channelId);

    return {
      guildId,
      channelId,
      guildName: guild.name,
      channelName: (channel as TextChannel).name,
      mediaAssetsCount: mediaCount,
      lastIndexedAt: lastJobFinish
    }
  }

  @Get(':linkId/gallery')
  @UseFilters(LinkErrorFilter)
  async getGuildGallery(@Param('linkId') linkId: string, @Query() query: IGalleryQuery): Promise<IMediaElementDTO[]> {
    const { guildId, channelId } = await this.linksService.GetLinkByLinkId(linkId);
    const { offset = 0, limit = 12 } = query;
    const entries = await this.indexManager.fetchEntries(guildId, channelId, limit, offset);
    if (entries.length === 0) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }

    const mediaElements = entries.map(indexEntryToMediaElementDTO);
    return mediaElements;
  }
}
