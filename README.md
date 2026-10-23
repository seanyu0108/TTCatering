# 扫码点餐小程序

一个使用微信小程序原生语法搭建的扫码点餐基础项目。当前版本包含完整的本地点餐流程，可直接导入微信开发者工具进行体验。

## 已包含

- 扫描桌码或手动输入桌号
- 分类菜单与菜品数量增减
- 本地购物车持久化
- 堂食/打包、订单备注与金额汇总
- 下单结果与历史订单
- 无需安装依赖的项目结构检查

## 本地运行

1. 打开微信开发者工具，选择“导入项目”。
2. 项目目录选择本仓库根目录，也就是包含 `project.config.json` 的目录。
3. 初始 AppID 为 `touristappid`，可直接预览界面。扫码、真机调试和发布前，请把 `project.config.json` 中的 `appid` 换成你自己的小程序 AppID。
4. 运行 `npm run check` 可检查 JavaScript 语法、JSON 格式和页面文件是否齐全。

首页的“体验点餐”会直接使用示例桌号进入菜单；“扫桌码”支持二维码内容为纯桌号，或带有 `tableNo` / `table` 查询参数的链接，例如：

```text
https://example.com/order?tableNo=A08
```

## 目录

```text
.
├─ miniprogram/
│  ├─ data/          # 示例菜品
│  ├─ pages/         # 首页、菜单、结算、订单页
│  ├─ utils/         # 购物车、订单与金额工具
│  ├─ app.js
│  ├─ app.json
│  └─ app.wxss
├─ scripts/          # 项目结构检查
└─ project.config.json
```

## 后续接入

- 把 `miniprogram/data/menu.js` 替换为门店菜单接口。
- 在结算页接入后端订单接口和微信支付。
- 接入登录、门店 ID、桌台状态、库存、优惠券和叫号能力。
- 发布前配置合法请求域名，并在真机上验证扫码与支付流程。

