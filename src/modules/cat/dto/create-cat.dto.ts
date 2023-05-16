import {IsInt, IsString} from 'class-validator';
import * as Joi from 'joi';

export const createCatSchema = Joi.object<CreateCatDto>({
  name: Joi.string().required(),
  age: Joi.string().required(),
  breed: Joi.string().required(),
})

export class CreateCatDto {
  @IsString()
  name: string;
  @IsInt()
  age: number;
  @IsString()
  breed: string;
}

