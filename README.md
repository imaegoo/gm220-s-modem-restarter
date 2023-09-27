# CMCC Henan modem (GM220-S) restarter

河南移动光猫的重启脚本，已在 GM220-S 上测试，可通过定时任务来重启光猫

## 安装依赖

```sh
npm install # 或者 pnpm install
```

## 配置

打开 `config.json` 配置自己的光猫 IP、管理员用户名和密码（可在光猫背面找到）

## 执行重启

```sh
node index.js
```
