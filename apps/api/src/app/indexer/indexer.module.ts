import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiscordModule } from '../discord/discord.module';
import IndexEntry from './entities/index-entry.entity';

/**
 * Module for making messages index. Coz fetching all the time messages can be expensive.
 * Indexed will be only messages with attachment, coz indexing all messages would be too storage expensive.
 * Indexer will have to listen to discord event like message editing or deleting in order to update database.
 * Indexer will be able to make index rebuild on demand.
 *
 * Important key features:
 * * Indexer must be able to crawl limited Discord channels at the same time.
 *   This is to avoid hitting rate limits on DiscordAPI and making enormously large waiting time for indexing
 * * Indexer must be able to allow someone to rebuild whole index but only once per given time.
 *   For example once per week. This is expensive operation hitting hard Discord API so it must be limited.
 * * Indexer must react to changes on Discord message. If for example message is deleted it also has to be deleted
 *   or marked as deleted on database.
 * * Indexer will export service that will help to query index database with sorting, filtering and pagination.
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([IndexEntry]),
    DiscordModule
  ]
})
export class IndexerModule {}
