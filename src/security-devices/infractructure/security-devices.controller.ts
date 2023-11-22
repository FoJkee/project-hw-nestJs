import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  UseGuards,
} from '@nestjs/common';
import { SecurityDevicesService } from './security-devices.service';
import { User } from '../../decorators/user.decorator';
import { UserEntity } from '../../user/models/user.schema';
import { RefreshTokenGuard } from '../../guard/refreshToken.guard';
import { DeviceViewModels } from '../models/device.view.models';
import { RefreshTokenDecorator } from '../../decorators/refreshtoken.decorator';
import { DeviceDto } from '../dto/device.dto';

@Controller('/security')
export class SecurityDevicesController {
  constructor(
    private readonly securityDevicesService: SecurityDevicesService,
  ) {}

  @Get('/devices')
  @UseGuards(RefreshTokenGuard)
  async getDevice(
    @User() user: UserEntity,
  ): Promise<DeviceViewModels[] | null> {
    return this.securityDevicesService.getDeviceAllSessionUserId(user.id);
  }

  @Delete('devices')
  @UseGuards(RefreshTokenGuard)
  @HttpCode(204)
  async deleteAllOtherSession(@RefreshTokenDecorator() deviceDto: DeviceDto) {
    return this.securityDevicesService.deleteAllOtherSession(deviceDto);
  }

  @Delete('devices/:deviceId')
  @UseGuards(RefreshTokenGuard)
  @HttpCode(204)
  async deleteDeviceId(
    @Param('deviceId') deviceId: string,
    @User() user: UserEntity,
  ) {
    return this.securityDevicesService.deleteDeviceId(deviceId, user.id);
  }
}
