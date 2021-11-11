import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Link from './link.entity';
import { LinksService } from './links.service';

/**
 * Module responsible for generating and managing links to galleries.
 */
@Module({
  imports: [TypeOrmModule.forFeature([Link])],
  providers: [LinksService],
  exports: [LinksService]
})
export class LinksModule {}
