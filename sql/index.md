# sql语句

## user表

```sql
CREATE TABLE `user` (
`user_id` bigint(20) unsigned NOT NULL DEFAULT '0' COMMENT '用户id',
`user_account` varchar(32) NOT NULL DEFAULT '' COMMENT '用户账户',
`user_password` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '用户密码',
`is_active` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '用户账号是否已激活：0-未激活，1-已激活',
`creator_id` bigint(20) unsigned NOT NULL DEFAULT '0' COMMENT '创建人id',
`created_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
`updater_id` bigint(20) unsigned NOT NULL DEFAULT '0' COMMENT '更新人id',
`updated_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
PRIMARY KEY (`user_id`)
) ENGINE=InnoDB COMMENT='用户表';
```

## photo表

```sql
CREATE TABLE `photo` (
`photo_id` bigint(20) unsigned NOT NULL DEFAULT '0' COMMENT '照片id',
`user_id` bigint(20) unsigned NOT NULL DEFAULT '0' COMMENT '[外键]用户id',
`url` varchar(64) NOT NULL COMMENT '照片地址',
`creator_id` bigint(20) unsigned NOT NULL DEFAULT '0' COMMENT '创建人id',
`created_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
`updater_id` bigint(20) unsigned NOT NULL DEFAULT '0' COMMENT '更新人id',
`updated_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
PRIMARY KEY (`photo_id`),
FOREIGN KEY (user_id) REFERENCES user(user_id)
) ENGINE=InnoDB COMMENT='照片表';
```

## user_info表

```sql
CREATE TABLE `user_info` (
`user_info_id` bigint(20) unsigned NOT NULL DEFAULT '0' COMMENT '用户信息id',
`user_id` bigint(20) unsigned NOT NULL DEFAULT '0' COMMENT '[外键]用户id',
`nickname` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '用户昵称',
`creator_id` bigint(20) unsigned NOT NULL DEFAULT '0' COMMENT '创建人id',
`created_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
`updater_id` bigint(20) unsigned NOT NULL DEFAULT '0' COMMENT '更新人id',
`updated_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
PRIMARY KEY (`user_info_id`),
FOREIGN KEY (user_id) REFERENCES user(user_id)
) ENGINE=InnoDB COMMENT='用户信息表';
```

## tenant表

```sql
CREATE TABLE `tenant` (
  `tenant_id` bigint(20) unsigned NOT NULL DEFAULT '0' COMMENT '租户id',
  `tenant_name` varchar(64) NOT NULL DEFAULT '' COMMENT '租户名称',
  `tenant_status` tinyint(4) unsigned NOT NULL DEFAULT '1' COMMENT '启用状态：0-禁用，1-启用，2-未激活',
  `forbidden_reason` varchar(255) NOT NULL DEFAULT '' COMMENT '禁用理由',
  `contact_name` varchar(32) NOT NULL DEFAULT '' COMMENT '联系人名称',
  `contact_mobile` varchar(32) NOT NULL DEFAULT '' COMMENT '联系人电话',
  `contact_email` varchar(128) DEFAULT '' COMMENT '联系人邮箱',
  `remark` varchar(255) NOT NULL DEFAULT '' COMMENT '备注',
  `creator_id` bigint(20) unsigned NOT NULL DEFAULT '0' COMMENT '创建人id',
  `created_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updater_id` bigint(20) unsigned NOT NULL DEFAULT '0' COMMENT '更新人id',
  `updated_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `delete_flag` tinyint(4) unsigned NOT NULL DEFAULT '0' COMMENT '删除标记：0-未删除，1-已删除',
  PRIMARY KEY (`tenant_id`),
  KEY `idx_tenantStatus` (`tenant_status`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='租户 ';
```

