import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat } from './chat.model';
import { ChatMessage } from './chatMessage.model';
import { ObjId, returner, thrower } from 'src/utils';
import { User } from 'src/user/user.model';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel('Chat') private readonly chatModel: Model<Chat>,
    @InjectModel('ChatMessage')
    private readonly chatMessageModel: Model<ChatMessage>,
  ) {}

  verifyChatOwnership(chat: Chat, userId: ObjId) {
    if (!chat) throw new NotFoundException('Document not found');
    if (
      chat.user1.toString() === userId.toString() ||
      chat.user2.toString() === userId.toString()
    ) {
      return true;
    }
    if (
      (chat.user1 as User)._id.toString() === userId.toString() ||
      (chat.user2 as User)._id.toString() === userId.toString()
    ) {
      return true;
    }
    throw new ForbiddenException('Unauthorized for this action');
    // return false;
  }

  async createChat(user1: string, user2: string) {
    try {
      const chatAlreadyExists = await this.chatModel
        .find({
          $or: [
            { user1: user1, user2: user2 },
            { user2: user1, user1: user2 },
          ],
        })
        .populate([
          { path: 'user1', select: 'name image' },
          { path: 'user2', select: 'name image' },
        ]);

      if (chatAlreadyExists.length > 0) {
        return returner({ chat: chatAlreadyExists[0] });
      }
      const prepData = new this.chatModel({ user1, user2 });
      const newChat = await prepData.save();
      await newChat.populate([
        { path: 'user1', select: 'name image' },
        { path: 'user2', select: 'name image' },
      ]);
      return returner({ chat: newChat });
    } catch (err) {
      thrower(err);
    }
  }

  async getChats(userId: ObjId) {
    try {
      const chats = await this.chatModel
        .find({
          $or: [{ user1: userId }, { user2: userId }],
        })
        .populate([
          { path: 'user1', select: 'name image' },
          { path: 'user2', select: 'name image' },
        ])
        .sort('-lastSession')
        .limit(10);
      if (!chats.length) throw new NotFoundException('Documents not found');
      return returner({ results: chats.length, chats });
    } catch (err) {
      thrower(err);
    }
  }

  async getChatById(userId: ObjId, chatId: string) {
    try {
      const chat = await this.chatModel.findById(chatId).populate([
        { path: 'user1', select: 'name image' },
        { path: 'user2', select: 'name image' },
      ]);
      if (!chat) throw new NotFoundException('Document not found');
      this.verifyChatOwnership(chat, userId);
      return returner({ chat });
    } catch (err) {
      thrower(err);
    }
  }

  async deleteChat(userId: ObjId, chatId: string) {
    try {
      const chat = await this.chatModel.findById(chatId);
      this.verifyChatOwnership(chat, userId);
      const res = await chat.remove();
      if (res) return returner();
    } catch (err) {
      thrower(err);
    }
  }

  async createMessage(chatId: string, author: ObjId, text: string) {
    try {
      const chat = await this.chatModel.findById(chatId);
      this.verifyChatOwnership(chat, author);
      const prepData = new this.chatMessageModel({
        chat: chatId,
        author,
        text,
      });
      const message = await prepData.save();
      return returner({ message });
    } catch (err) {
      thrower(err);
    }
  }

  async getMessages(chatId: string, user: ObjId) {
    try {
      const chat = await this.chatModel.findById(chatId);
      this.verifyChatOwnership(chat, user);
      const messages = await this.chatMessageModel
        .find({ chat })
        .sort('createdAt')
        .limit(50);
      if (!messages || messages.length === 0)
        throw new NotFoundException('No messages found');
      return returner({ results: messages.length, messages });
    } catch (err) {
      thrower(err);
    }
  }
}
