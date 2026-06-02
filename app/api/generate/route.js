import { rateLimit } from '@/lib/rate-limit';

export async function POST(request) {
  try {
    // 频率限制：每个 IP 每小时 10 次
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || request.headers.get('x-real-ip')
      || 'unknown';
    const { allowed, remaining } = rateLimit(ip, 10);
    if (!allowed) {
      return Response.json({
        error: `请求过于频繁，每小时限 ${10} 次，剩余 ${remaining} 次`,
      }, {
        status: 429,
        headers: { 'X-RateLimit-Remaining': '0' },
      });
    }

    const { project, date, content, location, weather } = await request.json();

    if (!project || !date || !content) {
      return Response.json({ error: '项目名称、日期和施工内容为必填' }, { status: 400 });
    }

    const prompt = `你是一位经验丰富的施工日志编写专家。请根据以下信息，生成一份规范、专业的施工日志。

项目名称：${project}
日期：${date}
施工内容：${content}
${location ? `施工部位：${location}` : ''}
${weather ? `天气：${weather}` : ''}

要求：
1. 按照真实工程日志格式输出，包括：日期、天气、施工部位、施工内容、人员机械情况、质量情况、安全情况、明日计划
2. 内容专业、具体，不空洞
3. 如遇雨天等天气，需注明是否影响施工
4. 格式整齐，每个段落用简短标题开头
5. 不要用 markdown 格式，用纯文字段落`;

    const apiKey = process.env.DEEPSEEK_API_KEY || '';

    const res = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: '你是施工日志生成专家，输出专业、简洁、规范的工程日志。' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return Response.json({ error: `API 调用失败: ${res.status} ${errText}` }, { status: 500 });
    }

    const data = await res.json();
    const logText = data.choices?.[0]?.message?.content || '';

    return Response.json({ log: logText });

  } catch (err) {
    console.error(err);
    return Response.json({ error: '服务器错误: ' + err.message }, { status: 500 });
  }
}
