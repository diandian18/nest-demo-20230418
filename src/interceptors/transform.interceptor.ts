import {CallHandler, ExecutionContext, Injectable, NestInterceptor} from "@nestjs/common";
import {map} from "rxjs";

// export interface Response<T> {
//   data: T;
// }

/**
 * 转换返回数据
 * 实际没有任何卵用
 */
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, T> {
  intercept(_context: ExecutionContext, next: CallHandler<T>) {
    return next.handle().pipe(map(data => data)); 
  }
}

