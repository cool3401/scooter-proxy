const https = require('https');

module.exports = async (req, res) => {
    // 1. CORS - Разрешаем всё для браузера
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // 2. Тестовый вход для проверки через браузер
    if (req.method === 'GET') {
        return res.status(200).send("Proxy Server Status: ONLINE");
    }

    // 3. Подготовка данных для отправки на lite.rent
    // Собираем данные в строку вручную, чтобы избежать ошибок парсинга
    let bodyData = "";
    if (typeof req.body === 'object') {
        const params = new URLSearchParams();
        for (const key in req.body) {
            params.append(key, req.body[key]);
        }
        bodyData = params.toString();
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

    // 4. Выполнение запроса
    const proxyReq = https.request(options, (proxyRes) => {
        let result = '';
        proxyRes.on('data', d => { result += d; });
        proxyRes.on('end', () => {
            res.status(200).send(result);
        });
    });

    proxyReq.on('error', e => {
        res.status(200).send("Server Error: " + e.message);
    });

    proxyReq.write(bodyData);
    proxyReq.end();
};
