# GAI Roadmap Capability DevBox

一个用于AI能力规划和路线图管理的开发环境。

## 项目概述

这个项目提供了一个完整的AI能力规划和管理系统，包括：

- **能力矩阵管理**: 管理和展示各种AI能力
- **路线图规划**: 技术路线图的可视化和规划
- **架构卡片**: 系统架构的可视化展示
- **解决方案库**: AI解决方案的集合和展示

## 功能特性

- 🎯 能力矩阵可视化
- 📊 技术路线图规划
- 🏗️ 架构卡片展示
- 📚 解决方案库管理
- 🔄 实时数据更新
- 📱 响应式设计

## 技术栈

- **前端**: React, Styled Components
- **后端**: Node.js, Express
- **数据**: JSON文件存储
- **部署**: Docker支持

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm start
```

或者使用提供的脚本：

```bash
./start.sh
```

### 构建生产版本

```bash
npm run build
```

## 项目结构

```
├── src/
│   ├── components/     # React组件
│   ├── data/          # 数据文件
│   ├── services/      # 服务层
│   ├── styles/        # 样式文件
│   └── utils/         # 工具函数
├── server/            # 后端服务
├── public/            # 静态资源
└── docs/              # 文档
```

## 开发指南

### 添加新的能力卡片

1. 在 `src/data/capabilitymaps/` 目录下创建新的JSON文件
2. 更新相应的manifest.json文件
3. 重新启动应用以加载新数据

### 自定义样式

样式文件位于 `src/styles/` 目录下，可以根据需要进行自定义。

## 部署

### Docker部署

```bash
docker build -t gai-roadmap .
docker run -p 3000:3000 gai-roadmap
```

### 手动部署

1. 构建项目：`npm run build`
2. 将构建文件部署到Web服务器
3. 配置反向代理（如需要）

## 贡献指南

1. Fork项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建Pull Request

## 许可证

本项目采用MIT许可证。

## 联系方式

如有问题或建议，请通过GitHub Issues联系我们。 