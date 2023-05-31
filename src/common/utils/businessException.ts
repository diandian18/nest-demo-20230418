import {HttpException, HttpStatus} from "@nestjs/common";
import {ResponseBody} from "./genResponse";

export class BusinessException<T> extends HttpException {
  constructor(responseBody: ResponseBody<T>) {
    super(responseBody, HttpStatus.OK);
  }
}

