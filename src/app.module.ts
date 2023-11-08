import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogModule } from './blog/blog.module';
import { TestingModule } from './testing/testing.module';
import { PostModule } from './post/post.module';
import { CommentModule } from './comment/comment.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://romanovsky0815:5455301V@cluster0.d2r9cgs.mongodb.net/?retryWrites=true&w=majority',
    ),
    BlogModule,
    TestingModule,
    PostModule,
    CommentModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

//   imports: [ConfingService],
//   useFactory(cinfigService: Co)=> configService.get('db')
// }
