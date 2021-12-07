import { Module } from '@nestjs/common';
import { DiscordModule } from '../discord/discord.module';
import { IndexManagerModule } from '../index-manager/index-manager.module';
import { IndexMessageListenerService } from './index-message-listener.service';

@Module({
  imports: [DiscordModule, IndexManagerModule],
  providers: [IndexMessageListenerService]
})
export class IndexMessageListenerModule {

}
