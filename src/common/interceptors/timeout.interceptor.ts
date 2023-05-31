import StatusCodeEnum from "@/common/enums/StatusCodeEnum";
import genResponse from "@/common/utils/genResponse";
import {CallHandler, ExecutionContext, Injectable, NestInterceptor, RequestTimeoutException} from "@nestjs/common";
import {catchError, Observable, throwError, timeout, TimeoutError} from "rxjs";

/**
 * 使用 RxJS 运算符操纵流的可能性为我们提供了许多功能。
 * 让我们考虑另一个常见的用例。假设您想处理路由请求的超时。当您的端点在一段时间后未返回任何内容时，您希望以错误响应终止。以下结构可以实现这一点
 * 5 秒后，请求处理将被取消。您还可以在抛出 RequestTimeoutException 之前添加自定义逻辑（例如释放资源）。
 */
@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      timeout(5000),
      catchError(err => {
        if (err instanceof TimeoutError) {
          return throwError(() => new RequestTimeoutException(genResponse.fail(StatusCodeEnum.TIMEOUT)));
        }
        return throwError(() => err);
      })
    ); 
  }
}

