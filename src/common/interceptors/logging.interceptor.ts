import {CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor} from "@nestjs/common";
import {Request} from "express";
import {Observable, tap} from "rxjs";

/**
 * 打打日志还是有用的
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(
    private logger: Logger,
  ) {}
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<Request>();
    const info = `${context.getClass().name} - ${request.url} - ${JSON.stringify(request.body)}`
    this.logger.log(info);
    // console.log(`[LogginInterceptor] Before... ${info}`); 
    const now = Date.now();
    return next
      .handle()
      .pipe(
        tap(() => {
          this.logger.log(`[LogginInterceptor] After... ${Date.now() - now}ms`);
          // console.log(`[LogginInterceptor] After... ${Date.now() - now}ms`);
        }),
      );
  }
}

