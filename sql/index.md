# sql语句

## user表

```sql
CREATE TABLE `user` (
`user_id` bigint(20) unsigned NOT NULL DEFAULT '0' COMMENT '用户id',
`first_name` varchar(64) NOT NULL DEFAULT '' COMMENT '用户姓名之名',
`last_name` varchar(64) NOT NULL DEFAULT '' COMMENT '用户姓名之姓',
`is_active` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '用户账号是否已激活：0-未激活，1-已激活',
`password` bigint(20) unsigned NOT NULL DEFAULT '0' COMMENT '用户密码',
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
`url` varchar(64) NOT NULL DEFAULT '' COMMENT '图片地址',
`creator_id` bigint(20) unsigned NOT NULL DEFAULT '0' COMMENT '创建人id',
`created_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
`updater_id` bigint(20) unsigned NOT NULL DEFAULT '0' COMMENT '更新人id',
`updated_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
PRIMARY KEY (`user_id`),
FOREIGN KEY (user_id) REFERENCES user(user_id)
) ENGINE=InnoDB COMMENT='照片表';
```

