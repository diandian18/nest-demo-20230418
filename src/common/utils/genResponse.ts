// genResponse.success([])

import {DEFAULT_ERROR_MESSAGE} from "@/common/consts/response";
import StatusCodeEnum from "@/common/enums/StatusCodeEnum";

export interface ResponseBody<T> {
  code: string,
  message: string,
  data: T,
}

function response<T>(code: string, message: string, data?: T): ResponseBody<T> {
  return {
    code,
    message,
    data: data !== undefined ? data : null,
  }
}

const genResponse = {
  success<T>(data?: T) {
    return response(
      StatusCodeEnum.OK.code,
      'success',
      data,
    );
  },
  fail(code: string | StatusCodeEnum, message?: string): ResponseBody<null> {
    if (code instanceof StatusCodeEnum) {
      return response(
        code.code,
        code.message, 
        null,
      );
    } else {
      return response(
        code,
        message || DEFAULT_ERROR_MESSAGE,
        null,
      );
    }
  },
};

export default genResponse;

