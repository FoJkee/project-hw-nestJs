import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Device, DeviceDocument } from '../models/device.schema';
import { Model } from 'mongoose';
import { DeviceViewModels } from '../models/device.view.models';

@Injectable()
export class SecurityDevicesRepository {
  constructor(
    @InjectModel(Device.name)
    private readonly DeviceModel: Model<DeviceDocument>,
  ) {}

  async getDeviceId(deviceId: string): Promise<Device | null> {
    return this.DeviceModel.findOne({ id: deviceId });
  }
  async deleteDeviceSessionUserId(
    deviceId: string,
    userId: string,
    lastActiveDate: string,
  ) {
    return this.DeviceModel.findOneAndDelete({
      deviceId,
      userId,
      lastActiveDate,
    });
  }

  async getDeviceAllSessionUserId(userId: string): Promise<DeviceViewModels[]> {
    return this.DeviceModel.find({ userId }, { _id: 0 });
  }
  async createNewDevice(
    newDevice: DeviceViewModels,
  ): Promise<DeviceViewModels> {
    return this.DeviceModel.create(newDevice);
  }

  async deleteDeviceId(deviceId: string, userId: string) {
    try {
      await this.DeviceModel.findOneAndDelete({ deviceId, userId });
      return true;
    } catch (e) {
      return false;
    }
  }

  async deleteAllOtherSession(deviceId: string, userId: string) {
    try {
      await this.DeviceModel.findOneAndDelete({
        deviceId: { $ne: deviceId },
        userId,
      });
      return true;
    } catch (e) {
      return false;
    }
  }

  async updateDevice(userId: string, deviceId: string, newDataToken: string) {
    return this.DeviceModel.findOneAndUpdate(
      { userId, deviceId },
      { $set: { lastActiveDate: newDataToken } },
    );
  }
}
