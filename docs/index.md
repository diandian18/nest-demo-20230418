# test

## 依赖注入

### 背后原理

1. 在`cats.service.ts`文件中，装饰器`@Injectable()`声明了`CatsService`类是一个受Nest的IoC容器管理的类。
2. 在cats.controller.ts文件中`CatsController`用构造函数注入的方式对`CatsService`标识声明了一个依赖：`constructor(private readonly catsService: CatsService)`
3. 在app.module.ts文件中，我们将标识`CatsService`和cats.service.ts文件中的类`CatsService`联系起来。

### 背后原理

当Nest的IoC容器实例化`CatsController`时，它首先会寻找是否有任何依赖项[*]。当它找到了`CatsService`依赖，就会按照上面注册的步骤#3对返回`CatsService`类的标识`CatsService`进行查找。假设单例作用域（默认行为），Nest将创建一个`CatsService`的实例，缓存并返回它，或者已经有缓存时直接返回存在的实例。

## todo

1. 将auth和permission独立出来，在网关层处理

## 草稿

create user -> create tenant -> auto generate roles by template, creating user become admin role

