const https = require('https');

module.exports = (req, res) => {
    // CORS: Разрешаем запросы из браузера с любого сайта (включая Beget)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Ответ на предварительный запрос браузера
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Проверка статуса в браузере
    if (req.method === 'GET') {
        return res.status(200).send("Vercel Proxy Status: ONLINE. Ready to send commands.");
    }

    // Подготовка данных для lite.rent
    let bodyData = "";
    if (req.body && typeof req.body === 'object') {
        bodyData = Object.keys(req.body)
            .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(req.body[k]))
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
        res.status(200).send("Proxy Error: " + e.message);
    });

    proxyReq.write(bodyData);
    proxyReq.end();
};
