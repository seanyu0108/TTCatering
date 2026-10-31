# 扫码点餐系统

一个面向店内桌码点餐的前后端分离项目。前端使用 uni-app 同时构建微信小程序和 H5，后端使用 Java 21 + Spring Boot，数据库使用 PostgreSQL，部署目标为华为云 CCE、RDS 和 SWR。

当前代码完成了菜单展示、桌号进入、购物车、服务端计价下单、订单详情和历史订单基础流程。数据库由 Flyway 自动建表并写入演示菜单。

## 技术栈

| 模块 | 技术 |
|---|---|
| 小程序与 H5 | uni-app、Vue 3、TypeScript、Pinia、Vite |
| 后端 | Java 21、Spring Boot 3.5、Spring MVC、JdbcClient |
| 数据库 | PostgreSQL 16、Flyway |
| 容器与编排 | Docker、Kubernetes、Kustomize |
| 华为云 | CCE、RDS for PostgreSQL、SWR、ELB/Ingress、OBS（预留） |
| 持续集成 | GitHub Actions |

## 项目结构

```text
.
├─ frontend/                  # uni-app 前端
│  └─ src/
│     ├─ api/                 # 后端接口封装
│     ├─ pages/               # 首页、菜单、结算、订单
│     ├─ stores/              # Pinia 购物车状态
│     └─ types/               # 接口类型
├─ backend/                   # Spring Boot 后端
│  └─ src/main/
│     ├─ java/com/zaobian/order/
│     └─ resources/db/migration/
├─ deploy/k8s/
│  ├─ base/                   # 公共 Kubernetes 工作负载
│  └─ overlays/
│     ├─ test/                # 测试环境
│     └─ prod/                # 生产环境
└─ .github/workflows/         # CI 与手动部署
```

## 本地开发

### 1. 准备 PostgreSQL

本地默认连接 VMware 虚拟机中的 PostgreSQL：

| 使用面 | 数据库 | 用户名 | 地址 |
|---|---|---|---|
| 用户面 | `ttcatering_console` | `console_rw` | `192.168.165.129:5432` |
| 管理面 | `ttcatering_portal` | `portal_rw` | `192.168.165.129:5432` |

本地凭据分别保存在已被 Git 忽略的 `backend/.env.local` 和
`backend/.env.console.local` 中。其他开发者可从对应的 `.example`
文件创建自己的本地配置。

项目自带的本地容器仍保留用于独立实验；如果改用它，需要同时调整
`backend/.env.local` 中的数据库连接参数：

```bash
docker compose -f deploy/local/compose.yaml up -d postgres
```

### 2. 启动后端

需要 JDK 21 和 Maven 3.9+：

```bash
cd backend
mvn spring-boot:run
```

默认激活 `test` profile 并连接用户面数据库，访问
`http://localhost:8080/actuator/health` 检查服务状态。Flyway 会自动创建表和演示菜单。

管理面连接配置使用独立的 `console` profile：

```bash
cd backend
SPRING_PROFILES_ACTIVE=console mvn spring-boot:run
```

管理面配置监听 `http://localhost:8081`。当前后端已实现的是用户点餐业务，
管理端接口仍属于后续开发范围；该 profile 为管理面后续接口提供独立的数据库连接，
并暂时关闭 Flyway，避免把用户面表结构写入管理面数据库。

主要接口：

```text
GET  /api/v1/menu
POST /api/v1/orders
GET  /api/v1/orders/{orderNo}
GET  /api/v1/orders?tableNo=A08
```

下单接口要求请求头 `Idempotency-Key`，服务端以数据库唯一约束防止重复订单。

### 3. 启动前端

```bash
cd frontend
npm install
npm run dev:mp-weixin
```

微信开发者工具导入 `frontend/dist/dev/mp-weixin`。H5 使用 `npm run dev:h5`。

小程序测试和发布前，需要把 `frontend/src/manifest.json` 中的 `mp-weixin.appid` 改成真实 AppID，并把 `.env.test`、`.env.production` 中的 API 地址替换为已经配置到微信后台的合法 HTTPS 域名。

## 测试与生产环境

两套环境使用相同的 Kubernetes 基础清单，通过 Kustomize overlay 隔离：

| 环境 | Namespace | Spring Profile | 数据库 | 域名示例 |
|---|---|---|---|---|
| 测试 | `scan-order-test` | `test` | `scan_order_test` | `app-test.example.com`、`api-test.example.com` |
| 生产 | `scan-order-prod` | `prod` | `scan_order_prod` | `app.example.com`、`api.example.com` |

部署前必须修改以下占位内容：

- `deploy/k8s/overlays/*/kustomization.yaml` 中的 SWR 组织和区域。
- `deploy/k8s/overlays/*/configmap.yaml` 中的 RDS 地址、数据库名和域名。
- `deploy/k8s/overlays/*/ingress.yaml` 中的域名和 TLS Secret。
- `frontend/.env.test` 与 `frontend/.env.production` 中的 API 域名。

### 华为云资源建议

1. 在同一地域创建 CCE 集群、RDS for PostgreSQL 和 SWR 组织。测试库与生产库使用独立实例，至少独立数据库和账号。
2. CCE 安装 Nginx Ingress Controller，并绑定华为云 ELB。
3. RDS 只开放 CCE 节点网段访问，不开放公网；生产库开启自动备份和 PITR。
4. 为测试和生产分别创建 Kubernetes Secret，不要提交真实密码：

```bash
kubectl -n scan-order-test create secret generic scan-order-secrets \
  --from-literal=DB_USERNAME='scan_order_test' \
  --from-literal=DB_PASSWORD='replace-me'

kubectl -n scan-order-prod create secret generic scan-order-secrets \
  --from-literal=DB_USERNAME='scan_order_prod' \
  --from-literal=DB_PASSWORD='replace-me'
```

5. 创建 TLS Secret，并确认域名已解析到 ELB 地址。测试环境也可使用独立测试证书。
6. 在本地校验最终清单：

```bash
kubectl kustomize deploy/k8s/overlays/test
kubectl kustomize deploy/k8s/overlays/prod
kubectl apply -k deploy/k8s/overlays/test
```

### GitHub Actions 部署

`.github/workflows/ci.yml` 会在提交和 PR 时执行前端类型检查、双端构建、后端测试。

`.github/workflows/deploy.yml` 为手动触发的部署流程。需要配置：

```text
HUAWEI_SWR_REGISTRY
HUAWEI_SWR_ORGANIZATION
HUAWEI_SWR_USERNAME
HUAWEI_SWR_PASSWORD
KUBE_CONFIG_TEST
KUBE_CONFIG_PROD
TEST_API_BASE_URL
PROD_API_BASE_URL
```

`KUBE_CONFIG_*` 使用 kubeconfig 文件的 Base64 内容。GitHub 仓库中分别建立 `test`、`prod` Environment，并为 `prod` 开启人工审批保护。

小程序前端不运行在 K8s 中：H5 和 Java API 使用 Docker/CCE 部署，微信小程序构建产物通过微信开发者工具或 `miniprogram-ci` 上传审核。

## 上线前仍需完成

- 接入门店/桌台实体和多门店权限，当前桌号仅作为订单字段。
- 接入微信登录与微信支付 v3，处理支付回调验签、幂等和退款。
- 增加门店管理端、后厨叫号、打印小票、库存和菜品上下架。
- 根据真实支付和点餐压力补充数据库索引、限流和可观测性告警。
- 在 CCE 中接入日志服务 LTS、APM 和监控告警，并执行数据库恢复演练。

