import { Public } from '@/auth/auth.decorator';
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { PostTenantReqDto, PutTenantReqDto } from './tanant.dto';
import { TenantService } from './tenant.service';

@Controller('tenant')
export class TenantController {
  constructor(
    private tenantService: TenantService,
  ) {}
  @Post()
  async postTenant(@Body() postTenantReqDto: PostTenantReqDto) {
    await this.tenantService.postTenant(postTenantReqDto);
  }

  @Public()
  @Get(':tenantId')
  async getTenant(@Param('tenantId', ParseIntPipe) tenantId: number) {
    return await this.tenantService.getTenant(tenantId);
  }

  @Public()
  @Put(':tenantId')
  async putTenant(@Param('tenantId', ParseIntPipe) tenantId: number, @Body() putTenantReqDto: PutTenantReqDto) {
    return await this.tenantService.putTenant(tenantId, putTenantReqDto);
  }

  @Public()
  @Delete(':tenantId')
  async deleteTenant(@Param('tenantId', ParseIntPipe) tenantId: number) {
    await this.tenantService.deleteTenant(tenantId);
  }
}
