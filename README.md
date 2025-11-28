# US Stock SIP Calculator (美股定投计算器)

A modern, responsive React application for simulating systematic investment plans (SIP) for US ETFs like VOO and QQQ. It features both fixed-rate projections and historical backtesting, along with AI-powered investment analysis using the Google Gemini API.

## Features

*   **Investment Simulation**: Calculate future returns based on fixed annual rates or historical market data.
*   **Portfolio Management**: Mix and match ETFs (VOO, QQQ, SPY, etc.) with custom weights.
*   **Historical Backtesting**: Uses real historical returns from 2010 onwards.
*   **AI Analysis**: Generates professional investment reports using **Google Gemini 2.5 Flash**.
*   **Multi-language Support**: English, Simplified Chinese (简体中文), and Japanese (日本語).
*   **Dark Mode**: Fully supported.
*   **PDF Export**: Optimized print layout for saving reports as PDF.

## Docker Deployment

This project is designed to be deployed easily via Docker, with the API Key injected at runtime.

### Prerequisites

*   Docker installed on your machine.
*   A Google Gemini API Key. Get one at [Google AI Studio](https://aistudio.google.com/).

### 1. Build the Image

```bash
docker build -t sip-calculator .
```

### 2. Run the Container

Replace `YOUR_ACTUAL_API_KEY` with your real Gemini API key.

```bash
docker run -d -p 8080:80 -e API_KEY=YOUR_ACTUAL_API_KEY sip-calculator
```

Access the app at `http://localhost:8080`.

### Development (Local)

1.  Install dependencies:
    ```bash
    npm install
    ```
2.  Create a `.env` file (optional for dev, or just export in shell):
    ```bash
    export API_KEY=your_key_here
    ```
3.  Start dev server:
    ```bash
    npm run dev
    ```

## Technical Details

*   **Frontend**: React 18, Vite, TypeScript, Tailwind CSS.
*   **Charts**: Recharts.
*   **AI Integration**: @google/genai SDK.
*   **Containerization**: Nginx serving static files built with Vite. The API Key is injected into the static JavaScript bundles at container startup using a shell script.
