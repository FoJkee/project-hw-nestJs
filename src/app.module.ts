import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlogController } from './blog/blogController';
import { BlogService } from './blog/blog.servise';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './blog/models/blog.schema';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://FoJkee:5455301V@cluster.eqfs4gk.mongodb.net/?retryWrites=true&w=majority',
    ),
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
  ],
  controllers: [AppController, BlogController],
  providers: [AppService, BlogService],
})
export class AppModule {}
