# 美股定投计算器 (US Stock SIP Calculator)

这是一个现代化、响应式的 React 应用程序，用于模拟美股 ETF（如 VOO, QQQ, SPY）的定投计划（SIP）。它集成了 **Google Gemini API**，能够根据您的模拟结果生成专业的 AI 投资分析报告。

## 功能特点

*   **灵活模拟**: 支持设定“固定年化收益率”或使用“历史市场数据”进行回测。
*   **组合管理**: 自定义 ETF 投资组合（例如：60% VOO + 40% QQQ）。
*   **AI 分析**: 利用 Google Gemini 模型生成投资策略分析报告。
*   **多语言**: 支持中文、英语和日语。
*   **PDF 导出**: 针对打印优化的界面，可直接保存为 PDF 报告。
*   **Docker 支持**: 支持容器化部署，且 API Key 可在启动时动态注入。

## Vercel 部署 (推荐)

最简单的部署方式是使用 Vercel。

1.  **Fork** 本项目到你的 GitHub 账号。
2.  在 [Vercel](https://vercel.com) 导入该项目。
3.  在部署配置页面的 **Environment Variables** 部分：
    *   添加 Key: `API_KEY`
    *   添加 Value: 你的 Google Gemini API Key
4.  点击 **Deploy**。

Vercel 会自动检测 `vite.config.ts` 并完成构建。

## Docker 部署指南

本项目采用“构建一次，到处运行”的策略。API Key 不需要打包在镜像中，而是在运行容器时通过环境变量传入。

### 1. 构建镜像

在项目根目录下运行：

```bash
docker build -t sip-calculator .
```

### 2. 运行容器

使用 `API_KEY` 环境变量启动容器。请将 `your_actual_api_key_here` 替换为您从 Google AI Studio 获取的真实 Key。

```bash
docker run -d \
  -p 8080:80 \
  -e API_KEY=your_actual_api_key_here \
  sip-calculator
```

启动后，访问浏览器 `http://localhost:8080` 即可使用。

### 原理说明

在构建过程中，代码中会保留一个特殊的占位符 `__GEMINI_API_KEY_PLACEHOLDER__`。
当 Docker 容器启动时，`docker-entrypoint.sh` 脚本会自动执行，将构建产物中的占位符替换为您传入的真实 `API_KEY`。

## 本地开发

如果您希望在不使用 Docker 的情况下进行本地开发：

1.  **安装依赖**:
    ```bash
    npm install
    ```

2.  **配置环境**:
    在根目录创建 `.env` 文件（可选），或者在启动命令前加环境变量：
    ```bash
    export API_KEY=your_key
    ```
    *注意：本地开发模式下，Vite 会自动加载 `.env` 文件中的变量，或者您也可以直接修改 `vite.config.ts` 中的 define 配置用于测试。*

3.  **启动服务**:
    ```bash
    npm run dev
    ```

## 目录结构

*   `src/`: 源代码目录
*   `nginx.conf`: Nginx 配置文件
*   `Dockerfile`: 构建描述文件
*   `docker-entrypoint.sh`: 启动脚本（处理环境变量注入）

## License

MIT
