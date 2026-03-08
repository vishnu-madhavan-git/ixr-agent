# IXR Agent

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/badge/IXR-Agent-black?style=for-the-badge&logo=robot&logoColor=white">
  <img alt="IXR Agent" src="https://img.shields.io/badge/IXR-Agent-white?style=for-the-badge&logo=robot&logoColor=black">
</picture>

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)

**The GUI Agent for IXR Systems.** Control any web interface with natural language — no Selenium, no headless browser, no screenshots.

Built on top of [page-agent](https://github.com/alibaba/page-agent) (MIT License) by Alibaba, rebranded and extended for the IXR ecosystem.

---

## ✨ Features

- **🎯 Zero-dependency integration** — Just inject a script. Works in any webpage.
- **📖 Text-based DOM manipulation** — No OCR. No multi-modal LLMs needed.
- **🧠 Bring your own LLMs** — Connect OpenAI, Gemini, Qwen, local Ollama, or any OpenAI-compatible API.
- **🎨 IXR-branded UI** — Human-in-the-loop panel styled for IXR products.
- **🔗 IXR system integration** — Connects natively to the IXR automation stack.

---

## 💡 IXR Use Cases

- **CRM Copilot** — Automate data entry in any web CRM with a sentence
- **Lead Scraping** — Control PropertyFinder/Bayut in-browser to extract villa owner contacts
- **Client Onboarding** — Auto-fill forms, generate contracts, trigger workflows
- **Dashboard Automation** — Control internal dashboards without API access

---

## 🚀 Quick Start

### One-line integration (demo mode)

```html
<script src="https://cdn.jsdelivr.net/npm/ixr-agent/dist/iife/ixr-agent.demo.js" crossorigin="true"></script>
```

### NPM

```bash
npm install ixr-agent
```

```javascript
import { IXRAgent } from 'ixr-agent'

const agent = new IXRAgent({
    model: 'gpt-4o-mini',
    baseURL: 'https://api.openai.com/v1',
    apiKey: 'YOUR_API_KEY',
    language: 'en-US',
})

await agent.execute('Click the Submit button')
await agent.execute('Fill in the contact form with: Name=John, Email=john@ixr.com')
await agent.execute('Extract all villa prices from the current page')
```

---

## 🏗️ Architecture

```
IXR Agent (browser layer)
    ↕ natural language commands
IXR Controller (DOM interaction)
    ↕ structured actions
IXR LLMs (model abstraction)
    ↕ OpenAI-compatible API
Your LLM (Qwen / GPT / Gemini / Local)
```

---

## 🔧 Configuration

```javascript
const agent = new IXRAgent({
    model: 'qwen-plus',
    baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    apiKey: process.env.DASHSCOPE_API_KEY,
    language: 'en-US',
    // Optional: IXR gateway integration
    ixrGatewayUrl: 'ws://bore.pub:PORT',
    ixrGatewayToken: 'minimax-agent',
})
```

---

## 📦 Packages

| Package | Description |
|---------|-------------|
| `ixr-agent` | Main entry point — IXRAgent class |
| `@ixr/core` | Core DOM agent logic |
| `@ixr/ixr-controller` | Page controller & action executor |
| `@ixr/llms` | LLM abstraction layer |
| `@ixr/ui` | IXR-branded panel UI |
| `@ixr/ext` | Chrome extension for multi-tab control |

---

## 📄 License

MIT — See [LICENSE](./LICENSE)

Based on [page-agent](https://github.com/alibaba/page-agent) by Alibaba Group (MIT License).
