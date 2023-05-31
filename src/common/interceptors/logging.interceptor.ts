import {CallHandler, ExecutionContext, Injectable, NestInterceptor} from "@nestjs/common";
import {Request} from "express";
import {Observable, tap} from "rxjs";

/**
 * 打打日志还是有用的
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<Request>();
    const info = `${context.getClass().name} ${request.url} ${JSON.stringify(request.body)}`
    console.log(`[LogginInterceptor] Before... ${info}`); 
    const now = Date.now();
    return next
      .handle()
      .pipe(
        tap(() => console.log(`[LogginInterceptor] After... ${Date.now() - now}ms`))
      );
  }
}

