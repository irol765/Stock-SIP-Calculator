# 美股定投计算器 (US Stock SIP Calculator)

这是一个现代化、响应式的 React 应用程序，用于模拟美股 ETF（如 VOO, QQQ, SPY）的定投计划（SIP）。它支持固定收益率预测和基于真实历史数据的回测，并集成了 **Google Gemini API** 来生成智能投资分析报告。

## 功能亮点

*   **投资模拟**: 支持基于“固定年化收益率”或“历史市场数据”计算未来回报。
*   **投资组合管理**: 自定义配置 ETF 组合（如 60% VOO + 40% QQQ）。
*   **历史回测**: 使用自 2010 年以来的真实历史数据进行精确回测。
*   **AI 智能分析**: 使用 **Google Gemini 2.5 Flash** 模型，根据您的模拟结果生成专业的投资分析报告。
*   **多语言支持**: 支持简体中文、英语和日语。
*   **暗黑模式**: 完美适配深色主题。
*   **PDF 导出**: 针对打印优化的布局，可直接将结果保存为整洁的 PDF 报告。

## Docker 部署指南

本项目经过专门设计，支持通过 Docker 快速部署，并且可以在**容器启动时（Runtime）动态传入 API Key**，无需将 Key 打包进镜像。

### 前置条件

*   机器上已安装 Docker。
*   拥有一个 Google Gemini API Key。如果没有，请前往 [Google AI Studio](https://aistudio.google.com/) 免费申请。

### 1. 构建镜像

在项目根目录下运行以下命令：

```bash
docker build -t sip-calculator .
```

### 2. 启动容器

请将 `YOUR_ACTUAL_API_KEY` 替换为您真实的 Gemini API Key。

```bash
docker run -d -p 8080:80 -e API_KEY=YOUR_ACTUAL_API_KEY sip-calculator
```

启动后，访问浏览器 `http://localhost:8080` 即可使用。

### 原理说明

在 `vite.config.ts` 中，我们定义了一个占位符 `__GEMINI_API_KEY_PLACEHOLDER__`。Docker 容器启动时，`docker-entrypoint.sh` 脚本会自动检测环境变量 `API_KEY`，并将其替换到编译后的 JavaScript 文件中。这确保了您的镜像可以公开分享，而 Key 仅在运行时注入。

## 本地开发

如果您想在本地修改代码：

1.  **安装依赖**:
    ```bash
    npm install
    ```

2.  **配置环境变量** (可选，或者直接在启动命令中通过 cross-env 设置):
    创建 `.env` 文件:
    ```env
    API_KEY=your_key_here
    ```

3.  **启动开发服务器**:
    ```bash
    npm run dev
    ```

## 技术栈

*   **前端框架**: React 18, Vite
*   **语言**: TypeScript
*   **样式**: Tailwind CSS
*   **图表**: Recharts
*   **AI 模型**: Google Gemini (@google/genai)
*   **容器化**: Nginx, Docker Multi-stage Build

## 许可

MIT License
