const https = require('https');
const querystring = require('querystring');

module.exports = (req, res) => {
    // 1. Сразу и безусловно отдаем CORS заголовки
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', '*');

    // 2. Отвечаем на проверочный запрос браузера
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // 3. Если просто открыть ссылку в браузере - покажем, что прокси жив
    if (req.method === 'GET') {
        return res.status(200).send("PROXY IS ALIVE! Vercel работает.");
    }

    // 4. Собираем данные для самокатов
    const postData = querystring.stringify(req.body || {});

    const options = {
        hostname: 'commandsend.lite.rent',
        port: 443,
        path: '/send',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(postData),
            'Authorization': 'Basic ' + Buffer.from("cmds:9998").toString('base64'),
            'User-Agent': 'Mozilla/5.0'
        },
        rejectUnauthorized: false // Игнорируем ошибку 526 SSL
    };

    // 5. Отправляем запрос
    const proxyReq = https.request(options, (proxyRes) => {
        let data = '';
        proxyRes.on('data', (chunk) => { data += chunk; });
        proxyRes.on('end', () => {
            res.status(200).send(data);
        });
    });

    // 6. Обработка ошибок
    proxyReq.on('error', (e) => {
        res.status(200).send("Внутренняя ошибка Vercel: " + e.message);
    });

    proxyReq.write(postData);
    proxyReq.end();
};
