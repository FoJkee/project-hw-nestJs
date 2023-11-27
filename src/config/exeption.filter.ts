import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

// @Catch(HttpException)
// export class HttpExceptionFilter implements ExceptionFilter {
//   catch(exception: HttpException, host: ArgumentsHost) {
//     const ctx = host.switchToHttp();
//     const response = ctx.getResponse<Response>();
//     const request = ctx.getRequest<Request>();
//     const status = exception.getStatus();
//
//     if (status === 400) {
//       const errorResponse: any = {
//         errorsMessages: [],
//       };
//
//       const responseBody: any = exception.getResponse();
//
//       responseBody.message.forEach((e) => {
//         errorResponse.errorsMessages.push(e);
//       });
//
//       return response.status(status).send(errorResponse);
//     } else {
//       response.status(status).json({
//         statusCode: status,
//         timestamp: new Date().toISOString(),
//         path: request.url,
//       });
//     }
//   }
// }
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    if (status === 400) {
      const errorsResponse: any = {
        errorsMessages: [],
      };
      const responseBody: any = exception.getResponse();
      if (typeof responseBody.message === 'object') {
        responseBody.message.forEach((e) =>
          errorsResponse.errorsMessages.push(e),
        );
      } else {
        errorsResponse.errorsMessages.push(responseBody.message);
      }
      return response.status(status).json(errorsResponse);
    } else {
      response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }
  }
}
export const GlobalHttpExceptionFilter = new HttpExceptionFilter();
