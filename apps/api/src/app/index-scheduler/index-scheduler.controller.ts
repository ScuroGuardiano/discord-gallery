import { Controller, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, UseFilters } from '@nestjs/common';
import LinkErrorFilter from '../links/filters/link-error.filter';
import { LinksService } from '../links/links.service';
import IndexSchedulerErrorsFilter from './filters/index-scheduler-errors.filter';
import { IndexSchedulerService } from './index-scheduler.service';
import { IJobStatus } from './job-statuses';

/**
 * ╔═════════════════════════════════════════════════════════════════╗
 * ║  I M P O R T A N T   T O D O                                    ║
 * ║   G U A R D I A N O ,   P L E A S E                             ║
 * ║     A D D   E X C E P T I O N   H A N D L I N G                 ║
 * ║       W I T H   F R I E N D L Y   E R R O R   M E S S A G E S   ║
 * ╚═════════════════════════════════════════════════════════════════╝
 */

@Controller('index-scheduler')
export class IndexSchedulerController {
  constructor(
    private indexScheduler: IndexSchedulerService,
    private linkService: LinksService
  ) {}

  @Get('job/by-id/:queuedJobId/status')
  async getJobStatusByQueuedJobId(@Param('queuedJobId', ParseIntPipe) queuedJobId: number): Promise<IJobStatus> {
    return this.indexScheduler.getStatusOfJob(queuedJobId);
  }

  @Get('job/by-link/:linkId/status')
  @UseFilters(new LinkErrorFilter())
  async getJobStatusByLinkId(@Param('linkId') linkId: string): Promise<IJobStatus> {
    const link = await this.linkService.GetLinkByLinkId(linkId);

    if (!link.channelId) {
      throw new HttpException('Link is invalid', HttpStatus.BAD_REQUEST);
    }

    const queueId = await this.indexScheduler.getQueueJobIdByGuildChannel(link.guildId, link.channelId);
    if (queueId < 0) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }

    return this.indexScheduler.getStatusOfJob(queueId);
  }

  /**
   *
   * @param linkId
   * @returns queuedJobId
   */
  @Post('job/by-link/:linkId/schedule')
  @UseFilters(LinkErrorFilter, IndexSchedulerErrorsFilter)
  async scheduleScanJob(@Param('linkId') linkId: string): Promise<number> {
    const link = await this.linkService.GetLinkByLinkId(linkId);

    if (!link.channelId) {
      throw new HttpException('Link is invalid', HttpStatus.BAD_REQUEST);
    }

    const queuedJob = await this.indexScheduler.scheduleScanJob(link.guildId, link.channelId);

    return queuedJob.id;
  }
}
