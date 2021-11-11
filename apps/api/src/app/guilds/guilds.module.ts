import { Module } from '@nestjs/common';
import { DiscordModule } from '../discord/discord.module';
import { LinksModule } from '../links/links.module';
import { GuildsController } from './guilds.controller';

@Module({
  controllers: [GuildsController],
  imports: [LinksModule, DiscordModule]
})
export class GuildsModule {}
