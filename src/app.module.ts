import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { VendorModule } from './vendor/vendor.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    PostModule,
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      process.env.NODE_ENV === 'development'
        ? process.env.DB_URI
        : process.env.DB_CLOUD.replace('<password>', process.env.DB_PASSWORD),
    ),
    VendorModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
