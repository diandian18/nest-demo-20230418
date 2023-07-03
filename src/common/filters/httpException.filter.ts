import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from "@nestjs/common";
import { Response } from "express";
import genResponse from '../utils/genResponse';

const internalStatusCodes = [404];

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    private logger: Logger,
  ) {}
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    // const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const message = exception.message;
    let businessResponse = exception.getResponse().valueOf();

    //console.log('exception: ', exception);
    //// @ts-ignore
    //console.log('exception.code: ', exception.code);
    //// @ts-ignore
    //console.log('exception.data: ', exception.data);
    //console.log('exception.message: ', exception.message);
    //console.log('status: ', status);
    //console.log('businessResponse: ', businessResponse);

    // nest内部拦截的错误码
    // 内部的不会被authGuard拦截
    if (internalStatusCodes.includes(status)) {
      businessResponse = genResponse.fail(
        String(status),
        message,
      );
    }
    this.logger.error(businessResponse);
    response
      .status(status)
      .json(businessResponse);
  }
}

