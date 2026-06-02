export const metadata = {
  title: 'AI 智能施工日志生成器',
  description: '输入施工信息，AI 自动生成规范施工日志',
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body style={{ margin: 0, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
        {children}
      </body>
    </html>
  );
}
