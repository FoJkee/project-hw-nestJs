import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DeviceViewModels } from '../models/device.view.models';
import { SecurityDevicesRepository } from './security-devices.repository';
import { DeviceDto } from '../dto/device.dto';

@Injectable()
export class SecurityDevicesService {
  constructor(
    private readonly securityDevicesRepository: SecurityDevicesRepository,
  ) {}

  async createNewDevice(
    newDevice: DeviceViewModels,
  ): Promise<DeviceViewModels> {
    return this.securityDevicesRepository.createNewDevice(newDevice);
  }

  async getDeviceAllSessionUserId(userId: string) {
    return this.securityDevicesRepository.getDeviceAllSessionUserId(userId);
  }

  async deleteDeviceSessionUserId(deviceId: string, userId: string) {
    return this.securityDevicesRepository.deleteDeviceSessionUserId(
      deviceId,
      userId,
    );
  }

  async findDeviceUserId(deviceId: string, userId: string) {
    return this.securityDevicesRepository.findDeviceUserId(deviceId, userId);
  }

  async deleteDeviceId(deviceId: string, userId: string) {
    const session = await this.securityDevicesRepository.getDeviceId(deviceId);
    if (!session) throw new NotFoundException();
    if (session.userId !== userId) throw new ForbiddenException();
    return this.securityDevicesRepository.deleteDeviceId(deviceId, userId);
  }

  async deleteAllOtherSession(deviceDto: DeviceDto) {
    return this.securityDevicesRepository.deleteAllOtherSession(
      deviceDto.deviceId,
      deviceDto.userId,
    );
  }

  async updateDevice(userId: string, deviceId: string, lastActiveDate: string) {
    return this.securityDevicesRepository.updateDevice(
      userId,
      deviceId,
      lastActiveDate,
    );
  }
}
