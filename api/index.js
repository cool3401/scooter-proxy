const https = require('https');

module.exports = (req, res) => {
  // Разрешаем CORS, чтобы браузер не блокировал запросы
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Ответ на проверку браузера (preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Ответ для проверки в обычном браузере
  if (req.method === 'GET') {
    return res.status(200).send("Proxy Online. Система готова к работе.");
  }

  // Vercel автоматически парсит body. Собираем его обратно в строку для lite.rent
  let bodyData = "";
  if (req.body && typeof req.body === 'object') {
    bodyData = Object.keys(req.body)
      .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(req.body[k])}`)
      .join('&');
  } else {
    bodyData = req.body || "";
  }

  const options = {
    hostname: 'commandsend.lite.rent',
    port: 443,
    path: '/send',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + Buffer.from("cmds:9998").toString('base64'),
      'Content-Length': Buffer.byteLength(bodyData),
      'User-Agent': 'Mozilla/5.0'
    },
    rejectUnauthorized: false
  };

  const proxyReq = https.request(options, (proxyRes) => {
    let result = '';
    proxyRes.on('data', d => { result += d; });
    proxyRes.on('end', () => {
      res.status(200).send(result);
    });
  });

  proxyReq.on('error', e => {
    res.status(200).send("Ошибка соединения: " + e.message);
  });

  proxyReq.write(bodyData);
  proxyReq.end();
};
