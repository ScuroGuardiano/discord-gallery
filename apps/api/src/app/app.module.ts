import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DiscordModule } from './discord/discord.module';
import { LinksModule } from './links/links.module';
import { GuildsModule } from './guilds/guilds.module';
import { IndexerModule } from './indexer/indexer.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "sqlite",
      database: "./db.sqlite",
      autoLoadEntities: true,
      synchronize: process.env.NODE_ENV === "development"
    }),
    DiscordModule,
    LinksModule,
    GuildsModule,
    IndexerModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
