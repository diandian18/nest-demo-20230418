export default class StatusCodeEnum {
  static readonly OK = new this('200', 'SUCCESS');
  static readonly CREATED = new this('201', '成功，已创建该资源');

  static readonly NOT_FOUND = new this('404', 'Not Found');

  static readonly ACCOUNT_ALREADY_EXIST = new this('100080', '帐号已存在');
  static readonly PASS_WRONG = new this('100088', '帐号或密码有误');

  static readonly UNAUTHORIZED = new this('401', '登录状态失效，请重新登录');
  static readonly REFRESH_TOKEN_EXPIRED = new this('100100', 'refreshToken已过期');

  static readonly JWT_TOKEN_IS_FORBIDDEN = new this('100048', '您无权限进入');
  static readonly FORBIDDEN_ENTER = new this('100043', '禁止进入');
  static readonly BIND_EXCEPTION = new this('100012', '参数校验异常');

  static readonly SWITCHING_TENANT_NOT_FOUND = new this('100013', '切换的个人账号或租户不存在');

  static readonly UNKNOWN_ERROR = new this('100999', '服务开了点小差');

  // 407
  static readonly TIMEOUT = new this('100021', '访问超时');

  constructor(_code: string, _message: string) {
    this._code = _code;
    this._message = _message;
  }
  private _code: string;
  private _message: string;
  get code() {
    return this._code;
  }
  get message() {
    return this._message;
  }
}
