import { ReqUser } from '@/auth/auth.decorator';
import { RedisTokenUserDto } from '@/user/user.dto';
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { PostSwitchTenantReqDto, PostTenantReqDto, PutTenantReqDto } from './tanant.dto';
import { TenantService } from './tenant.service';

@Controller('tenant')
export class TenantController {
  constructor(
    private tenantService: TenantService,
  ) {}
  @Post()
  async postTenant(
    @ReqUser() user: RedisTokenUserDto,
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

  @Post('/switch')
  async postSwitchTenant(@ReqUser() user: RedisTokenUserDto, @Body() postSwitchTenantReqDto: PostSwitchTenantReqDto) {
    await this.tenantService.postSwitchTenant(user, postSwitchTenantReqDto);
  }
}
