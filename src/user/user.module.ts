import { Module } from '@nestjs/common';
import { UserController } from './infrastructure/user.controller';
import { UserService } from './infrastructure/user.service';
import { UserQueryRepository } from './infrastructure/user.query.repository';
import { UserRepository } from './infrastructure/user.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { UserEntity, UserSchema } from './models/user.schema';
import { EmailValidator, LoginValidator } from './dto/user.validator';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: UserEntity.name, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    UserQueryRepository,
    UserRepository,
    LoginValidator,
    EmailValidator,
  ],
})
export class UserModule {}
