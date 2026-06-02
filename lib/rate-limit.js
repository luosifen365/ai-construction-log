/**
 * 简单的内存频率限制
 * 每个 IP 每小时最多 limit 次请求
 */

const rateMap = new Map();

const WINDOW_MS = 60 * 60 * 1000; // 1 小时

export function rateLimit(ip, limit = 10) {
  const now = Date.now();
  const record = rateMap.get(ip);

  if (!record || now - record.windowStart > WINDOW_MS) {
    // 新窗口
    rateMap.set(ip, { windowStart: now, count: 1 });
    return { allowed: true, remaining: limit - 1 };
  }

  if (record.count >= limit) {
    return { allowed: false, remaining: 0 };
  }

  record.count++;
  return { allowed: true, remaining: limit - record.count };
}

// 定期清理过期记录（防止内存泄漏）
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of rateMap) {
    if (now - record.windowStart > WINDOW_MS * 2) {
      rateMap.delete(ip);
    }
  }
}, 10 * 60 * 1000);
