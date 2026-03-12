const https = require('https');

module.exports = (req, res) => {
    // 1. Заголовки CORS (обязательно в самом начале)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // 2. Ответ на предварительный запрос браузера
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // 3. Тестовый GET запрос (чтобы проверить в браузере)
    if (req.method === 'GET') {
        return res.status(200).send("Vercel Proxy Active! Мост работает.");
    }

    // 4. Логика POST запроса (отправка команд)
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
        const options = {
            hostname: 'commandsend.lite.rent',
            port: 443,
            path: '/send',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + Buffer.from("cmds:9998").toString('base64'),
                'Content-Length': Buffer.byteLength(body),
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
            res.status(200).send("Ошибка запроса к lite.rent: " + e.message);
        });

        proxyReq.write(body);
        proxyReq.end();
    });
};
