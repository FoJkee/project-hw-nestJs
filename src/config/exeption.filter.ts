// import { ArgumentsHost, ExceptionFilter, HttpException } from '@nestjs/common';
//
// @Cache(HttpException)
// export class CustomExceptionFilter implements ExceptionFilter {
//   catch(exception: HttpException, host: ArgumentsHost) {
//     const ctx = host.switchToHttp();
//     const response = ctx.getResponse<Response>();
//     const request = ctx.getRequest<Request>();
//     const status = exception.getStatus();
//   }
// }
