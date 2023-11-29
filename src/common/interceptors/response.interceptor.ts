import {CallHandler, ExecutionContext, HttpStatus, Injectable, NestInterceptor} from "@nestjs/common";
import {map, Observable} from "rxjs";
import genResponse from '../utils/genResponse';

/**
 * 对接口返回数据结构做统一处理
 */
@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    const request = _context.switchToHttp().getRequest<Request>();
    const response = _context.switchToHttp().getResponse<Response>();

    if (request.method === 'POST') {
      // @ts-ignore
      if (response.statusCode === HttpStatus.CREATED)
        // @ts-ignore
        response.status(HttpStatus.OK);
    }

    return next.handle().pipe(
      map(data => {
        return genResponse.success(data);
      }),
    );
  }
}

