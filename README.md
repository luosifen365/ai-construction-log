# AI 智能施工日志生成器

输入施工信息，AI 自动生成规范的专业施工日志。

## 技术栈

- Next.js 14（App Router）
- DeepSeek API

## 本地运行

```bash
# 1. 安装依赖
npm install

# 2. 在 .env.local 中配置你的 DeepSeek API Key
# DEEPSEEK_API_KEY=sk-your-key-here

# 3. 启动开发服务器
npm run dev
```

浏览器打开 http://localhost:3000

## 部署到 Vercel（免费）

1. 把代码推送到 GitHub
2. 打开 https://vercel.com 用 GitHub 登录
3. 点击 "Add New Project" → 选择这个仓库
4. 在 Environment Variables 中添加：
   - **Name:** `DEEPSEEK_API_KEY`
   - **Value:** 你的 DeepSeek API Key
5. 点击 Deploy，等 2 分钟即部署完成

## 功能

- 输入项目名称、日期、施工部位、天气、施工内容
- AI 自动生成完整施工日志（含天气影响、人员机械、质量安全、明日计划）
- 一键复制日志内容

## 作者

李思凡 - [GitHub](https://github.com/luosifen365)
