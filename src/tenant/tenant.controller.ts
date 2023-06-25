import { Public, ReqUser } from '@/auth/auth.decorator';
import { UserRetDto } from '@/user/user.dto';
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { PostTenantReqDto, PutTenantReqDto } from './tanant.dto';
import { TenantService } from './tenant.service';

@Controller('tenant')
export class TenantController {
  constructor(
    private tenantService: TenantService,
  ) {}
  @Post()
  async postTenant(
    @ReqUser() user: UserRetDto,
    @Body() postTenantReqDto: PostTenantReqDto,
  ) {
    await this.tenantService.postTenant(user, postTenantReqDto);
  }

  @Get(':tenantId')
  async getTenant(@Param('tenantId', ParseIntPipe) tenantId: number) {
    return await this.tenantService.getTenant(tenantId);
  }

  @Put(':tenantId')
  async putTenant(@Param('tenantId', ParseIntPipe) tenantId: number, @Body() putTenantReqDto: PutTenantReqDto) {
    return await this.tenantService.putTenant(tenantId, putTenantReqDto);
  }

  @Delete(':tenantId')
  async deleteTenant(@Param('tenantId', ParseIntPipe) tenantId: number) {
    await this.tenantService.deleteTenant(tenantId);
  }
}
