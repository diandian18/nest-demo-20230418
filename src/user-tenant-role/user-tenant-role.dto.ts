import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class FindRoleByUserIdTenantIdReqDto {
  @Expose()
  roleId: number;
}

