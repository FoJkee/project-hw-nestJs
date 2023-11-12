import { Module } from '@nestjs/common';
import { UserController } from './infrastructure/user.controller';
import { UserService } from './infrastructure/user.service';
import { UserQueryRepository } from './infrastructure/user.query.repository';
import { UserRepository } from './infrastructure/user.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { UserEntity, UserSchema } from './models/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: UserEntity.name, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [UserService, UserQueryRepository, UserRepository],
})
export class UserModule {}
