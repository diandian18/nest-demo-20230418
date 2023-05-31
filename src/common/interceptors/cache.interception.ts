import {CallHandler, ExecutionContext, Injectable, NestInterceptor} from "@nestjs/common";
import {Observable, of} from "rxjs";

/**
 * 有几个原因导致我们有时可能想要完全阻止调用处理程序并返回一个不同的值。
 * 一个明显的例子是实现缓存以提高响应时间。
 * 让我们看一下从缓存返回其响应的简单缓存拦截器。
 * 在一个现实的例子中，我们想要考虑其他因素，如 TTL、缓存失效、缓存大小等，但这超出了本次讨论的范围。
 * 在这里，我们将提供一个基本示例来演示主要概念
 */
@Injectable()
export class CacheInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    const isCached = true;
    if (isCached) {
      return of([]);
    }
    return next.handle();
  }
}
/**
 * 我们的 CacheInterceptor 有一个硬编码的 isCached 变量和一个硬编码的 response []。
 * 需要注意的关键点是我们在这里返回一个新流，由 RxJS of() 运算符创建，因此根本不会调用路由处理程序。
 * 当有人调用使用 CacheInterceptor 的端点时，将立即返回响应（硬编码的空数组）。
 * 为了创建通用解决方案，您可以利用 Reflector 并创建自定义装饰器。反射器在守卫章节中有很好的描述
 */

