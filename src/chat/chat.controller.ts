import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { MongoId, ObjId } from 'src/utils';
import { User } from 'src/user/user.model';
import { CreateMessage } from './dto/CreateMessage.dto';

@Controller('api/v1/chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @UseGuards(JwtGuard)
  @Post(':id')
  async createChat(@GetUser() user: User, @Param() params: MongoId) {
    return this.chatService.createChat(user._id.toString(), params.id);
  }

  @UseGuards(JwtGuard)
  @Get()
  async getChats(@GetUser() user: User) {
    return this.chatService.getChats(user._id as ObjId);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async deleteChat(@GetUser() user: User, @Param() params: MongoId) {
    return this.chatService.deleteChat(user._id as ObjId, params.id);
  }

  @UseGuards(JwtGuard)
  @Post('/message/:id')
  async createMessage(
    @Param() params: MongoId,
    @GetUser() author: User,
    @Body() dto: CreateMessage,
  ) {
    return this.chatService.createMessage(
      params.id,
      author._id as ObjId,
      dto.text,
    );
  }

  @UseGuards(JwtGuard)
  @Get('/message/:id')
  async getMessages(@Param() params: MongoId, @GetUser() user: User) {
    return this.chatService.getMessages(params.id, user._id as ObjId);
  }

  @UseGuards(JwtGuard)
  @Get('/:id')
  async getChatById(@GetUser() user: User, @Param() params: MongoId) {
    return this.chatService.getChatById(user._id as ObjId, params.id);
  }
}
