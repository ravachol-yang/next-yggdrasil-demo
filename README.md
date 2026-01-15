# 使用NextJS实现Yggdrasil API
**！仅作测试，数据都是写死的，没有什么安全性或可靠性的保障！**

## 已实现的API
`POST /authserver/authenticate` 用户登录(支持使用邮箱或直接使用角色名)

`POST /authserver/refresh` 刷新令牌

`POST /authserver/validate` 验证令牌

`POST /authserver/invalidate` 吊销令牌

`POST /authserver/signout` 登出

`POST /sessionserver/session/minecraft/join` 客户端进入服务器(不记录ip)

`GET /sessionserver/session/minecraft/hasJoined?username={username}&serverId={serverId}&ip={ip}` 服务端验证客户端(不验证ip)

`GET /sessionserver/session/minecraft/profile/{uuid}?unsigned={unsigned}` 查询角色属性

`GET /` API 元数据获取

## 外部资源

使用了planet minecraft上的皮肤（仅用作演示）

[Boy Mechanic]()

[Female Hive Style](https://www.planetminecraft.com/skin/female-hive-style/)

[Skin I Made](https://www.planetminecraft.com/skin/skin-i-made-6827728/)