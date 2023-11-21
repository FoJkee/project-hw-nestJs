import { Module } from '@nestjs/common';
import { AuthController } from './infrastructure/auth.controller';
import { AuthService } from './infrastructure/auth.service';
import { UserService } from '../user/infrastructure/user.service';
import { JwtServices } from './jwt/jwt';
import { UserRepository } from '../user/infrastructure/user.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { UserEntity, UserSchema } from '../user/models/user.schema';
import { Device, DeviceSchema } from '../security-devices/models/device.schema';
import { EmailService } from '../email/email.service';
import { SecurityDevicesService } from '../security-devices/infractructure/security-devices.service';
import { UserQueryRepository } from '../user/infrastructure/user.query.repository';
import { SecurityDevicesRepository } from '../security-devices/infractructure/security-devices.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: UserEntity.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Device.name, schema: DeviceSchema }]),
  ],
  providers: [
    AuthService,
    UserService,
    UserRepository,
    JwtServices,
    EmailService,
    SecurityDevicesService,
    UserQueryRepository,
    SecurityDevicesRepository,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
