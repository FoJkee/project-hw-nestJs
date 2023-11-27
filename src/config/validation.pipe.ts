import { BadRequestException, ValidationPipe } from '@nestjs/common';

export const GlobalValidationPipe = new ValidationPipe({
  whitelist: true,
  transform: true,
  stopAtFirstError: true,
  exceptionFactory: (errors) => {
    const result: any = [];
    errors.forEach((err) => {
      const keys = Object.keys(err.constraints!);
      keys.forEach((e) => {
        result.push({
          message: err.constraints![e],
          field: err.property,
        });
      });
    });
    throw new BadRequestException(result);
  },
});

// export const GlobalValidationPipe = new ValidationPipe({
//   whitelist: true,
//   transform: true,
//   stopAtFirstError: true,
//   exceptionFactory: (errors) => {
//     const result = errors.map((e) => {
//       const firstErr = JSON.stringify(e.constraints);
//       return { message: firstErr, field: e.property };
//     });
//     throw new BadRequestException(result);
//   },
// });
