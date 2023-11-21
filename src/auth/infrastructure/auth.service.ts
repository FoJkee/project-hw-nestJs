import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from '../dto/login.dto';
import { UserService } from '../../user/infrastructure/user.service';
import { randomUUID } from 'crypto';
import { JwtServices } from '../jwt/jwt';
import { Device } from '../../security-devices/models/device.schema';
import { SecurityDevicesService } from '../../security-devices/infractructure/security-devices.service';
import { DeviceDto } from '../../security-devices/dto/device.dto';
import { RegistrationDto } from '../dto/registration.dto';
import { EmailService } from '../../email/email.service';
import { NewPasswordDto } from '../dto/newpassword.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtServices,
    private readonly securityDevicesService: SecurityDevicesService,
    private readonly emailService: EmailService,
  ) {}

  async login(loginDto: LoginDto, ip: string, deviceName: string) {
    const user = await this.userService.validateUserAndPass(
      loginDto.loginOrEmail,
      loginDto.password,
    );
    if (!user) return null;
    const deviceId = randomUUID();

    const { accessToken, refreshToken } =
      await this.jwtService.createAccessAndRefreshToken(deviceId, user.id);

    const lastActiveDate =
      await this.jwtService.getLastActiveDateFromToken(refreshToken);

    const newDevice: Device = {
      ip,
      userId: user.id,
      deviceId,
      title: deviceName,
      lastActiveDate,
    };
    await this.securityDevicesService.createNewDevice(newDevice);
    return { accessToken, refreshToken };
  }

  async logout(deviceDto: DeviceDto, userId: string) {
    const lastActiveDate = new Date(deviceDto.iat * 1000).toISOString();

    return this.securityDevicesService.deleteDeviceSessionUserId(
      deviceDto.deviceId,
      userId,
      lastActiveDate,
    );
  }

  async refreshToken(token: string) {
    const dataToken = await this.jwtService.verifyRefreshToken(token);
    if (!dataToken) throw new UnauthorizedException();
    const userId = dataToken.userId;
    const deviceId = dataToken.deviceId;
    const user = await this.userService.findUserId(dataToken.userId);
    if (!user) throw new UnauthorizedException();

    const { accessToken, refreshToken } =
      await this.jwtService.createAccessAndRefreshToken(deviceId, userId);

    const newDataToken =
      await this.jwtService.getLastActiveDateFromToken(refreshToken);
    await this.securityDevicesService.updateDevice(
      user.id,
      dataToken.deviceId,
      newDataToken,
    );

    return { accessToken, refreshToken };
  }

  async registration(registrationDto: RegistrationDto) {
    const newUser = await this.userService.createUser(registrationDto);
    await this.emailService.sendEmail(
      registrationDto.email,
      'Registration',
      `<h1>Registation</h1>
            <p>To finish registration please follow the link below:
             <a href="https://somesite.com/confirm-email?code=${
               newUser!.emailConfirmation.codeConfirmation
             }">complete registration</a>
            </p>`,
    );
    return;
  }

  async passwordRecovery(email: string) {
    const userEmail = await this.userService.findUserByLoginOrEmail(email);
    if (!userEmail) return null;
    const updateUser = await this.userService.updateUserByConfirmationCode(
      userEmail.id,
    );
    await this.emailService.sendEmail(
      email,
      'Email resending conformation',
      `<h1>Password recovery confirmation</h1>
            <p>To finish password recovery please follow the link below:
             <a href='https://somesite.com/password-recovery?recoveryCode=${
               updateUser!.emailConfirmation.codeConfirmation
             }'>recovery password</a></p>`,
    );

    return;
  }
  async newPassword(newPasswordDto: NewPasswordDto) {
    const user = await this.userService.findUserByConfirmationCode(
      newPasswordDto.recoveryCode,
    );
    if (!user) return null;
    await this.userService.updateUserPassword(
      user.id,
      newPasswordDto.newPassword,
    );
  }

  async registrationConfirmation(code: string) {
    return this.userService.findUserAndUpdateByConfirmationCode(code);
  }

  async registrationEmailResending(email: string) {
    const userEmail = await this.userService.findUserByLoginOrEmail(email);
    if (!userEmail) throw new BadRequestException();

    const updateUser = await this.userService.updateUserByConfirmationCode(
      userEmail.id,
    );

    await this.emailService.sendEmail(
      email,
      'Email resending confirmation',
      `<h1>Email resending confirmation</h1>
            <p>To finish email resending please follow the link below:
             <a href='https://somesite.com/confirm-email?code=${
               updateUser!.emailConfirmation.codeConfirmation
             }'>complete registration</a>
            </p>`,
    );
    return;
  }
}
