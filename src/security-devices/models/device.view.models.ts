export class DeviceViewModels {
  constructor(
    public ip: string,
    public userId: string,
    public deviceId: string,
    public title: string,
    public lastActiveDate: string,
  ) {}
}
