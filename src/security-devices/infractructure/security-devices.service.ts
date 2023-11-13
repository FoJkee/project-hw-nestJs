import { Injectable } from '@nestjs/common';
import { DeviceViewModels } from '../models/device.view.models';
import { InjectModel } from '@nestjs/mongoose';
import { Device, DeviceDocument } from '../models/device.schema';
import { Model } from 'mongoose';

@Injectable()
export class SecurityDevicesService {
  constructor(
    @InjectModel(Device.name)
    private readonly DeviceModel: Model<DeviceDocument>,
  ) {}

  async createNewDevice(
    newDevice: DeviceViewModels,
  ): Promise<DeviceViewModels> {
    return this.DeviceModel.create(newDevice);
  }
}
