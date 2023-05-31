import { Body, Controller, Get, Header, HttpCode, HttpStatus, Param, Post, Query, Redirect, Req, Res } from '@nestjs/common';
import {Request, Response} from 'express';
import {Observable, of} from 'rxjs';
import {CreateCatDto} from './dto/create-cat.dto';

// @HostParams('account')
@Controller({ /** host: ':account.example.com', */ path: 'cat' })
export class CatController {
  @Post()
  create(): string {
    return 'Create cat';
  }

  @Post('204')
  @HttpCode(204)
  post204() {
    return 'Http code 204';
  }

  @Post('header')
  @Header('Cache-Control', 'none')
  header() {
    return 'Header';
  }

  @Get()
  findAll(@Req() request: Request, @Res({ passthrough: true }) res: Response) {
    console.log(request.path);
    // return 'All cats';
    // res.status(HttpStatus.OK).json([]);
    res.status(HttpStatus.OK);
    return [];
  }

  @Get('ab*cd')
  findAbWildcardCd(@Req() request: Request): string {
    return `Wildcard ${request.path}`;
  }

  @Get('302')
  @Redirect('https://www.baidu.com', 302)
  tryRedirect(@Query('version') version: string) {
    if (version && version === '5') {
      return { url: 'https://www.google.com' };
    }
  }

  @Get(':id/:gender')
  findOne(@Param('id') id: string, @Param('gender') gender: string): string {
    return `Find one, id: ${id}, gender: ${gender}`;
  }

  // promise
  @Get('promise')
  async findPromise(): Promise<any[]> {
    return [];
  }

  // rxjs
  @Get('rxjs')
  findRxjs(): Observable<any[]> {
    return of([]);
  }

  // post dto
  @Post('createCatDto')
  async createCatDtoFn(@Body() createCatDto: CreateCatDto, @Res() res: Response) {
    // return JSON.stringify(createCatDto);
    res.status(HttpStatus.CREATED).send(JSON.stringify(createCatDto));
  }
}

