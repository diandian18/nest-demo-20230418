# Flow

```flowchart
注册生成账号=>start: 注册生成账号
end=>end: end
创建租户吗=>condition: 创建租户吗
生成租户=>operation: 生成租户
创建role=>operation: 创建role
账号绑定role为admin=>operation: 账号绑定role为admin

注册生成账号->创建租户吗
创建租户吗(no)->end
创建租户吗(yes)->生成租户->创建role->账号绑定role为admin->end
```
