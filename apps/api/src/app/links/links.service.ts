import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomBytes, createHash } from 'crypto';
import { Repository } from 'typeorm';
import { environment } from '../../environments/environment';
import LinkExpiredError from './errors/link-expired';
import LinkNotFoundError from './errors/link-not-found';
import Link from './link.entity';

@Injectable()
export class LinksService {
  constructor(
    @InjectRepository(Link) private linkRepository: Repository<Link>
  ) {}

  private host = process.env.DISCORD_GALLERY_HOST || ''

  public async createLink(guildId: string, channelId?: string): Promise<string> {
    const linkId = this.generateRandomLinkId();
    const link = new Link();
    link.guildId = guildId;
    link.channelId = channelId;
    link.hashedLinkId = this.hashLinkId(linkId);
    link.validBefore = new Date(Date.now() + environment.linkExpireTime);

    await this.linkRepository.save(link);

    const linkURL = this.host ? this.host + `/${linkId}` : linkId;
    return linkURL;
  }

  /**
   * Will return Link entity instance based on hashed link id.
   *
   * Throws:
   * * LinkNotFoundError
   * * LinkExpiredError
   *
   * @param linkId
   * @returns
   */
  public async GetLinkByLinkId(linkId: string) {
    const linkIdHash = this.hashLinkId(linkId);

    const link = await this.linkRepository.findOne({ hashedLinkId: linkIdHash });
    if (!link) {
      throw new LinkNotFoundError();
    }

    if (Date.now() < link.validBefore.getTime()) {
      throw new LinkExpiredError();
    }

    return link;
  }

  private hashLinkId(linkId: string) {
    return createHash('sha256').update(linkId).digest('hex');
  }

  private generateRandomLinkId() {
    return randomBytes(10).toString('hex');
  }
}
