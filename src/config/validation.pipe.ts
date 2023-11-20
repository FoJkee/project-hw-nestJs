import { ValidationError } from 'class-validator';
import { BadRequestException, ValidationPipe } from '@nestjs/common';

const errorResult = (errors: ValidationError[]) => {
  const result: any = [];
  errors.forEach((err) => {
    const keys: string[] = Object.keys(err.constraints!);
    keys.forEach((e) => {
      result.push({
        message: err.constraints![e],
        field: err.property,
      });
    });
  });
  return result;
};

export const GlobalValidationPipe = new ValidationPipe({
  whitelist: true,
  transform: true,
  stopAtFirstError: true,
  exceptionFactory: (errors: ValidationError[]) => {
    throw new BadRequestException(errorResult(errors));
  },
});
