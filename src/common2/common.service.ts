import { forwardRef, Inject, Injectable } from '@nestjs/common';
import CatsService from '../cat/cat.service';

@Injectable()
export class CommonService {
  constructor(
    @Inject(forwardRef(() => CatsService))
    private catsService: CatsService,
  ) {}
}
