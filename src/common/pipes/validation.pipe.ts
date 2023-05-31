import StatusCodeEnum from "@/common/enums/StatusCodeEnum";
import genResponse from "@/common/utils/genResponse";
import {ArgumentMetadata, BadRequestException, Injectable, PipeTransform} from "@nestjs/common";
import {plainToInstance} from "class-transformer";
import {validateSync} from "class-validator";

@Injectable()
export class ValidationPipe<T> implements PipeTransform<T, T> {
  transform(value: T, metadata: ArgumentMetadata) {
    console.log('[ValidationPipe] value: ', value); // value:  7701da90-e4d4-11ed-b5ea-0242ac120002
    console.log('[ValidationPipe] metadata: ', metadata); // metadata:  { metatype: [Function: Number], type: 'param', data: 'id' }
    // value:  { name: 'chouchou', age: '3', breedxxxx: 'xxx' }
    // metadata:  { metatype: [class CreateCatDto], type: 'body', data: undefined }
    const { metatype } = metadata;
    console.log('[ValidationPipe] metatype: ', metatype);

    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const object = plainToInstance(metatype, value);
    console.log('[ValidationPipe] object: ', object);
    const errors = validateSync(object);
    console.log('[ValidationPipe] errors: ', errors);
    if (errors.length > 0) {
      throw new BadRequestException(genResponse.fail(
        StatusCodeEnum.BIND_EXCEPTION.code,
        `${StatusCodeEnum.BIND_EXCEPTION.message}: ${errors.map(item => item.constraints.isString).join('; ')}`,
      ));
    }

    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}

