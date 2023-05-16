import StatusCodeEnum from "@/enums/StatusCodeEnum";
import genResponse from "@/utils/genResponse";
import {CallHandler, ExecutionContext, Injectable, InternalServerErrorException, NestInterceptor} from "@nestjs/common";
import {catchError, Observable, throwError} from "rxjs";

/**
 * 只要有报错就会走这里
 */
@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      catchError(err => throwError(() => {
        console.log('[ErrorsInterceptor] err: ', err);
        // return new InternalServerErrorException(genResponse.fail(StatusCodeEnum.UNKNOWN_ERROR)); 
        return err;
      }))
    );
  }
}

