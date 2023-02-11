import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { MongooseModule } from '@nestjs/mongoose';
import { chatSchema } from './chat.model';
import { chatMessageSchema } from './chatMessage.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Chat', schema: chatSchema },
      { name: 'ChatMessage', schema: chatMessageSchema },
    ]),
  ],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
