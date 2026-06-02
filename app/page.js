'use client';

import { useState } from 'react';

export default function Home() {
  const today = new Date().toISOString().slice(0, 10);

  const [form, setForm] = useState({
    project: '',
    date: today,
    content: '',
    location: '',
    weather: '',
  });

  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult('');

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setResult(data.log);
      }
    } catch (err) {
      setError('请求失败，请检查网络后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result);
      alert('已复制到剪贴板');
    } catch {
      // fallback
      const ta = document.createElement('textarea');
      ta.value = result;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      alert('已复制到剪贴板');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%)',
      padding: '40px 20px',
    }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>

        {/* 标题 */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1a1a2e', margin: '0 0 8px' }}>
            📋 AI 智能施工日志生成器
          </h1>
          <p style={{ fontSize: 14, color: '#666', margin: 0 }}>
            输入施工信息，AI 自动生成规范的专业施工日志
          </p>
        </div>

        {/* 表单区域 */}
        <div style={{
          background: '#fff',
          borderRadius: 12,
          padding: 28,
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          marginBottom: 24,
        }}>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <label style={labelStyle}>项目名称 *</label>
                <input name="project" value={form.project} onChange={handleChange}
                  placeholder="如：浦东新区 XX 项目"
                  style={inputStyle} required />
              </div>
              <div>
                <label style={labelStyle}>日期 *</label>
                <input type="date" name="date" value={form.date} onChange={handleChange}
                  style={inputStyle} required />
              </div>
              <div>
                <label style={labelStyle}>施工部位</label>
                <input name="location" value={form.location} onChange={handleChange}
                  placeholder="如：3层梁板 / A区基础"
                  style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>天气</label>
                <input name="weather" value={form.weather} onChange={handleChange}
                  placeholder="如：晴 25°C"
                  style={inputStyle} />
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>施工内容 *</label>
              <textarea name="content" value={form.content} onChange={handleChange}
                placeholder="描述今日主要施工内容，如：3层梁板混凝土浇筑，C30混凝土约120m³"
                style={{ ...inputStyle, minHeight: 90, resize: 'vertical' }} required />
            </div>
            <button type="submit" disabled={loading}
              style={{
                width: '100%', padding: '12px 0', border: 'none', borderRadius: 8,
                fontSize: 16, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
                background: loading ? '#94a3b8' : '#1a1a2e',
                color: '#fff', transition: 'background 0.2s',
              }}>
              {loading ? '⏳ 生成中...' : '🚀 生成施工日志'}
            </button>
          </form>
        </div>

        {/* 错误提示 */}
        {error && (
          <div style={{
            background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8,
            padding: '12px 16px', marginBottom: 16, color: '#b91c1c', fontSize: 14,
          }}>
            ❌ {error}
          </div>
        )}

        {/* 结果区域 */}
        {result && (
          <div style={{
            background: '#fff',
            borderRadius: 12,
            padding: 28,
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1a1a2e', margin: 0 }}>
                ✅ 施工日志
              </h2>
              <button onClick={handleCopy}
                style={{
                  padding: '6px 16px', border: '1px solid #d1d5db', borderRadius: 6,
                  background: '#fff', cursor: 'pointer', fontSize: 13, color: '#374151',
                }}>
                📋 复制
              </button>
            </div>
            <div style={{
              background: '#f8fafc', borderRadius: 8, padding: 20,
              whiteSpace: 'pre-wrap', fontSize: 14, lineHeight: 1.8,
              color: '#1e293b', fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
            }}>
              {result}
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: 32, fontSize: 12, color: '#94a3b8' }}>
          GitHub: <a href="https://github.com/luosifen365" style={{ color: '#94a3b8' }}>luosifen365</a>
          {' '}| 使用 DeepSeek API
        </div>
      </div>
    </div>
  );
}

const labelStyle = {
  display: 'block', fontSize: 13, fontWeight: 600, color: '#374151',
  marginBottom: 4,
};

const inputStyle = {
  width: '100%', padding: '10px 12px', border: '1px solid #d1d5db',
  borderRadius: 6, fontSize: 14, outline: 'none',
  boxSizing: 'border-box',
  background: '#fff',
};
