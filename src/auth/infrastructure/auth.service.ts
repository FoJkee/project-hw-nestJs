import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from '../dto/login.dto';
import { UserService } from '../../user/infrastructure/user.service';
import { randomUUID } from 'crypto';
import { JwtServicess } from '../jwt/jwt';
import { Device } from '../../security-devices/models/device.schema';
import { SecurityDevicesService } from '../../security-devices/infractructure/security-devices.service';
import { RegistrationDto } from '../dto/registration.dto';
import { EmailService } from '../../email/email.service';
import { NewPasswordDto } from '../dto/newpassword.dto';
import { UserRepository } from '../../user/infrastructure/user.repository';
import { DeviceDto } from '../../security-devices/dto/device.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtServicess,
    private readonly securityDevicesService: SecurityDevicesService,
    private readonly emailService: EmailService,
    private readonly userRepository: UserRepository,
  ) {}

  async login(loginDto: LoginDto, ip: string, deviceName: string) {
    const user = await this.userService.validateUserAndPass(
      loginDto.loginOrEmail,
      loginDto.password,
    );
    if (!user) throw new UnauthorizedException();

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
    const user = await this.userService.findUserId(dataToken.userId);
    if (!user) throw new UnauthorizedException();

    const { accessToken: accessTokenNew, refreshToken: refreshTokenNew } =
      await this.jwtService.createAccessAndRefreshToken(
        dataToken.deviceId,
        dataToken.userId,
      );

    const newDataToken =
      await this.jwtService.getLastActiveDateFromToken(refreshTokenNew);

    await this.securityDevicesService.updateDevice(
      dataToken.userId,
      dataToken.deviceId,
      newDataToken,
    );

    return { accessTokenNew, refreshTokenNew };
  }

  // async refreshToken(token: string) {
  //   const activeToken = await this.jwtService.getLastActiveDateFromToken(token);
  //   if (!activeToken) throw new UnauthorizedException();
  //
  //   const dataToken = await this.jwtService.verifyRefreshToken(token);
  //   if (!dataToken) throw new UnauthorizedException();
  //   const user = await this.userService.findUserId(dataToken.userId);
  //   if (!user) throw new UnauthorizedException();
  //
  //   const accessToken = await this.jwtService.createAccessToken(
  //     user.id,
  //     dataToken.deviceId,
  //   );
  //   const newRefreshToken = await this.jwtService.createRefreshToken(
  //     user.id,
  //     dataToken.deviceId,
  //   );
  //
  //   const newDataToken =
  //     await this.jwtService.getLastActiveDateFromToken(newRefreshToken);
  //
  //   await this.securityDevicesService.updateDevice(
  //     user.id,
  //     dataToken.deviceId,
  //     newDataToken,
  //   );
  //   return { accessToken, newRefreshToken };
  // }

  async registration(registrationDto: RegistrationDto) {
    const newUser = await this.userService.createUser(registrationDto);

    if (!newUser) throw new BadRequestException();
    await this.emailService.sendEmail(
      newUser.email,
      'Registration',
      `<h1>Registation</h1>
            <p>To finish registration please follow the link below:
             <a href="https://somesite.com/confirm-email?code=${newUser.emailConfirmation?.codeConfirmation}">complete registration</a>
            </p>`,
    );

    return;
  }
  async registrationConfirmation(code: string) {
    return this.userService.findUserAndUpdateByConfirmationCode(code);
  }

  async passwordRecovery(email: string) {
    const userEmail = await this.userRepository.findUserByEmail(email);
    if (!userEmail)
      throw new BadRequestException([
        {
          message: 'Email for user is not found',
          field: 'email',
        },
      ]);

    const newCodeConfirmation = randomUUID();

    const updateUser = await this.userService.updateUserByConfirmationCode(
      userEmail.id,
      newCodeConfirmation,
    );
    if (!updateUser) throw new BadRequestException();

    await this.emailService.sendEmail(
      userEmail.email,
      'Email resending conformation',
      `<h1>Password recovery confirmation</h1>
            <p>To finish password recovery please follow the link below:
             <a href='https://somesite.com/password-recovery?recoveryCode=${updateUser.emailConfirmation.codeConfirmation}'>recovery password</a></p>`,
    );

    return;
  }
  async newPassword(newPasswordDto: NewPasswordDto) {
    const user = await this.userService.findUserByConfirmationCode(
      newPasswordDto.recoveryCode,
    );
    if (!user) throw new BadRequestException();

    await this.userService.updateUserPassword(
      user.id,
      newPasswordDto.newPassword,
    );
    return;
  }

  async registrationEmailResending(email: string) {
    const userEmail = await this.userRepository.findUserByEmail(email);
    if (!userEmail)
      throw new BadRequestException([
        {
          message: `email don't exist`,
          field: 'email',
        },
      ]);
    if (userEmail.emailConfirmation.isConfirmed)
      throw new BadRequestException([
        {
          message: 'email already confirmed',
          field: 'email',
        },
      ]);

    const newCodeConfirmation = randomUUID();

    const updateUser = await this.userService.updateUserByConfirmationCode(
      userEmail.id,
      newCodeConfirmation,
    );

    // if (updateUser!.emailConfirmation.isConfirmed === true)
    //   throw new BadRequestException();

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
