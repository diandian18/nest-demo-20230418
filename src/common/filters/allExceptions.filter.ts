import {ArgumentsHost, Catch, HttpException, HttpStatus, InternalServerErrorException, Logger} from '@nestjs/common';
import {BaseExceptionFilter} from '@nestjs/core';
import StatusCodeEnum from '../enums/StatusCodeEnum';
import genResponse from '../utils/genResponse';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  constructor(
    private readonly logger: Logger,
  ) {
    super();
  }
  catch(exception: unknown, host: ArgumentsHost) {
    // const { httpAdapter } = this.httpAdapterHost;
    // const ctx = host.switchToHttp();

    const httpStatus = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    // 业务中没有catch的错误，接口会返回500，在这里做拦截并自定义处理
    // @ts-ignore
    const { message, stack =  '' } = exception ?? {};
    if (httpStatus === HttpStatus.INTERNAL_SERVER_ERROR) {
      // @ts-ignore
      this.logger.error(message, stack, 'AllExceptionsFilter');
      // @ts-ignore
      throw new InternalServerErrorException(genResponse.fail(StatusCodeEnum.UNKNOWN_ERROR.code, JSON.stringify(message)));
    }

    super.catch(exception, host);
  }
} 

