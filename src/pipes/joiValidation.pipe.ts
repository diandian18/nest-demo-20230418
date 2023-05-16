import StatusCodeEnum from "@/enums/StatusCodeEnum";
import genResponse from "@/utils/genResponse";
import {ArgumentMetadata, BadRequestException, Injectable, PipeTransform} from "@nestjs/common";
import {ObjectSchema} from "joi";

@Injectable()
export default class JoiValidationPipe<T> implements PipeTransform<T, T> {
  constructor(private schema: ObjectSchema<T>) {}
  transform(value: T, metadata: ArgumentMetadata) {
    console.log('value: ', value); // value:  7701da90-e4d4-11ed-b5ea-0242ac120002
    console.log('metadata: ', metadata); // metadata:  { metatype: [Function: Number], type: 'param', data: 'id' }

    const { error } = this.schema.validate(value);
    if (error) {
      throw new BadRequestException(genResponse.fail(
        StatusCodeEnum.BIND_EXCEPTION.code,
        `${StatusCodeEnum.BIND_EXCEPTION.message}: ${error.message}`, // "message": "参数校验异常: \"breed\" is required"
      ));
    }

    return value;
  }
}
