import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import IndexEntry from './entities/index-entry.entity';
import { IndexManagerService } from './index-manager.service';

@Module({
  imports: [ TypeOrmModule.forFeature([ IndexEntry ])],
  providers: [IndexManagerService],
  exports: [IndexManagerService]
})
export class IndexManagerModule {}
