# CARV Frontend aikit

这是一个基于 pnpm 的 monorepo 项目，包含多个 npm package 和一个 React + Vite 的演示项目。

## 项目结构

```
.
├── packages/          # npm packages
│   └── core/         # 核心包
├── apps/             # 应用
│   └── demo/         # 演示项目
└── .github/          # GitHub 配置
    └── workflows/    # GitHub Actions 工作流
```

## 开发

### 环境要求

- Node.js >= 16
- pnpm >= 8

### 安装依赖

```bash
pnpm install
```

### 开发模式

```bash
# 开发核心包
pnpm --filter @carv-protocol/core dev

# 开发演示项目
pnpm --filter demo dev
```

### 构建

```bash
# 构建所有包
pnpm build

# 构建特定包
pnpm --filter @carv-protocol build
```

## 发布

包发布通过 GitHub Actions 自动完成。当 `main` 分支上的 `packages` 目录发生变化时，会自动触发发布流程。

### 发布流程

1. 确保代码已提交到 `main` 分支
2. 确保 `packages/*/package.json` 中的版本号已更新
3. 推送代码到 GitHub
4. GitHub Actions 会自动构建并发布包

## 许可证

ISC
