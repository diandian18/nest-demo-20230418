import StatusCodeEnum from "@/common/enums/StatusCodeEnum";
import genResponse from "@/common/utils/genResponse";
import {CallHandler, ExecutionContext, Injectable, InternalServerErrorException, Logger, LoggerService, NestInterceptor} from "@nestjs/common";
import {catchError, Observable, throwError} from "rxjs";

/**
 * 只要有报错就会走这里
 * 不用打日志，代码有报错时nest会捕获并打日志
 */
@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  constructor(
    // private readonly logger: Logger,
  ) {}
  intercept(_context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      catchError(err => throwError(() => {
        // console.log('err: ', JSON.stringify(err.stack));
        // this.logger.error(`[ErrorsInterceptor] err: ${err}`);
        // console.log('[ErrorsInterceptor] err: ', err);
        // return new InternalServerErrorException(genResponse.fail(StatusCodeEnum.UNKNOWN_ERROR)); 
        return err;
      }))
    );
  }
}

