import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {Cat} from './interfaces/cat.interface';

@Injectable()
export default class CatsService {
  private readonly cats: Cat[] = [];

  // constructor(@Optional() @Inject('HTTP_OPTIONS') private httpClient: T) {
    // console.log(httpClient);
  // }

  create(cat: Cat) {
    this.cats.push(cat);
  }

  findAll(): Cat[] {
    return this.cats; 
  }
}
