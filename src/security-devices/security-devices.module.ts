import { Module } from '@nestjs/common';
import { SecurityDevicesController } from './infractructure/security-devices.controller';
import { SecurityDevicesService } from './infractructure/security-devices.service';
import { SecurityDevicesRepository } from './infractructure/security-devices.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Device, DeviceSchema } from './models/device.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Device.name, schema: DeviceSchema }]),
  ],
  providers: [SecurityDevicesService, SecurityDevicesRepository],
  controllers: [SecurityDevicesController],
})
export class SecurityDevicesModule {}
